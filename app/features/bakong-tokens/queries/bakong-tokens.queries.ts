import { useQuery, useMutation, useQueryCache } from '@pinia/colada'

export type BakongTokenStatus = 'active' | 'limit_reached' | 'expired'

export interface BakongToken {
  _id: string
  email: string
  token: string
  status: BakongTokenStatus
  dailyCount: number
  dailyLimit: number
  remaining: number
  expiringSoon: boolean
  createdDate: string
  expiredDate: string
  lastUsedAt: string | null
  notes: string | null
}

export interface BakongTokenPayload {
  email: string
  token: string
  createdDate?: string
  expiredDate: string
  notes?: string
}

interface KotPrengApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const TOKENS_KEY = ['bakong-tokens']

// Live-ish usage counts without adding websocket infra.
const REFETCH_INTERVAL_MS = 20_000

export function useBakongTokensQuery() {
  const { apiFetch } = useKotPrengApi()

  return useQuery({
    key: () => TOKENS_KEY,
    query: async () => {
      const res = await apiFetch<KotPrengApiResponse<BakongToken[]>>('/bakong-token/all')
      return res.data ?? []
    },
    refetchInterval: REFETCH_INTERVAL_MS
  })
}

export function useBakongTokenQuery(id: Ref<string>) {
  const { apiFetch } = useKotPrengApi()

  return useQuery({
    key: () => [...TOKENS_KEY, id.value],
    query: async () => {
      const res = await apiFetch<KotPrengApiResponse<BakongToken>>(`/bakong-token/${id.value}`)
      return res.data
    },
    enabled: () => !!id.value
  })
}

export function useCreateBakongTokenMutation() {
  const { apiFetch } = useKotPrengApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: async (payload: BakongTokenPayload) => {
      const res = await apiFetch<KotPrengApiResponse<BakongToken>>('/bakong-token/create', {
        method: 'POST',
        body: payload
      })
      return res.data
    },
    onSuccess: () => queryCache.invalidateQueries({ key: TOKENS_KEY })
  })
}

export function useUpdateBakongTokenMutation() {
  const { apiFetch } = useKotPrengApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: async ({ id, payload }: { id: string, payload: Partial<BakongTokenPayload> }) => {
      const res = await apiFetch<KotPrengApiResponse<BakongToken>>(`/bakong-token/update/${id}`, {
        method: 'POST',
        body: payload
      })
      return res.data
    },
    onSuccess: () => queryCache.invalidateQueries({ key: TOKENS_KEY })
  })
}

export function useDeleteBakongTokenMutation() {
  const { apiFetch } = useKotPrengApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (id: string) => apiFetch(`/bakong-token/delete/${id}`, { method: 'POST' }),
    onSuccess: () => queryCache.invalidateQueries({ key: TOKENS_KEY })
  })
}

export function useRenewBakongTokenMutation() {
  const { apiFetch } = useKotPrengApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: async (id: string) => {
      const res = await apiFetch<KotPrengApiResponse<BakongToken>>(`/bakong-token/renew/${id}`, {
        method: 'POST'
      })
      return res.data
    },
    onSuccess: () => queryCache.invalidateQueries({ key: TOKENS_KEY })
  })
}
