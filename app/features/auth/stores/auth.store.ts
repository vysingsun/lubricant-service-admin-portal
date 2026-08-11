import { defineStore } from 'pinia'

export interface AuthUser {
  userId: string
  role: 'User' | 'Admin' | 'Super_Admin' | 'Vendor' | 'Operator'
}

/** kot-preng-api's JWT only carries `_id`/`identifier` — no role — so
 * the role has to come from the login response body itself, not from
 * decoding the token. */
interface KotPrengRole {
  role_name?: string
}

interface KotPrengUser {
  _id: string
  role?: KotPrengRole | string
}

interface KotPrengLoginResponse {
  success?: boolean
  data?: {
    user?: KotPrengUser
    token?: string
  }
}

interface KotPrengErrorBody {
  success?: false
  error?: string | { message?: string }
}

function extractRoleName(role: KotPrengRole | string | undefined): string | undefined {
  return typeof role === 'string' ? role : role?.role_name
}

function extractErrorMessage(error: unknown): string | undefined {
  const body = (error as { data?: KotPrengErrorBody } | undefined)?.data
  if (!body?.error) return undefined
  return typeof body.error === 'string' ? body.error : body.error.message
}

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })
  // The token alone can't rehydrate `user` on reload (role isn't in it),
  // so role/userId are cached alongside it from the login response.
  const userCookie = useCookie<AuthUser | null>('auth_user', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })

  const token = ref(tokenCookie.value)
  const user = ref<AuthUser | null>(userCookie.value)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  /** `identifier` is kot-preng-api's login field — it accepts either an
   * email address or a phone number, there's no separate phone field. */
  async function login(identifier: string, password: string) {
    const config = useRuntimeConfig()

    let response: KotPrengLoginResponse
    try {
      response = await $fetch<KotPrengLoginResponse>('/auth/login', {
        baseURL: config.public.kotPrengApiBaseUrl,
        method: 'POST',
        body: { identifier, password }
      })
    } catch (error) {
      throw new Error(extractErrorMessage(error) ?? 'Login failed', { cause: error })
    }

    const accessToken = response.data?.token
    const rawUser = response.data?.user
    const roleName = extractRoleName(rawUser?.role)

    if (!accessToken || !rawUser?._id || !roleName) {
      throw new Error('Login response did not contain a token, user id, or role')
    }

    // This portal is for lubricant store vendors (managing their own
    // store), Super_Admin (the platform owner, with access to every
    // store), and Operator (manages the Bakong token pool only) — User
    // and Admin accounts belong to kot-preng-api's own apps. LoginForm
    // maps this sentinel to a translated message.
    if (roleName !== 'Vendor' && roleName !== 'Super_Admin' && roleName !== 'Operator') {
      throw new Error('VENDOR_ONLY')
    }

    const authUser: AuthUser = { userId: rawUser._id, role: roleName as AuthUser['role'] }

    token.value = accessToken
    tokenCookie.value = accessToken
    userCookie.value = authUser
    user.value = authUser
  }

  function logout() {
    token.value = null
    tokenCookie.value = null
    userCookie.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, logout }
})
