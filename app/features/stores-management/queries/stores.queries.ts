import { useQuery, useMutation, useQueryCache } from '@pinia/colada'

export interface Store {
  id: string
  ownerUserId: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  status: 'pending' | 'active' | 'suspended'
}

export interface CreateStorePayload {
  name: string
  slug: string
  description?: string
  logoUrl?: string
}

export interface UpdateStorePayload {
  name?: string
  slug?: string
  description?: string
  logoUrl?: string
  status?: Store['status']
}

/** Vendor sees only their own store(s); Super_Admin (platform owner) sees
 * every store on the platform. */
export function useStoresQuery() {
  const { apiFetch } = useApi()
  const { user } = useAuth()
  const isSuperAdmin = computed(() => user.value?.role === 'Super_Admin')

  return useQuery({
    key: () => ['stores', isSuperAdmin.value ? 'all' : 'mine'],
    query: () => apiFetch<Store[]>(isSuperAdmin.value ? '/stores' : '/stores/mine')
  })
}

export function useStoreQuery(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()

  return useQuery({
    key: () => ['stores', 'detail', storeId.value ?? ''],
    query: () => apiFetch<Store>(`/stores/${storeId.value}`),
    enabled: () => !!storeId.value
  })
}

export function useCreateStoreMutation() {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (payload: CreateStorePayload) =>
      apiFetch<Store>('/stores', { method: 'POST', body: payload }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['stores'] })
  })
}

export function useUpdateStoreMutation() {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, payload }: { id: string, payload: UpdateStorePayload }) =>
      apiFetch<Store>(`/stores/${id}`, { method: 'PATCH', body: payload }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['stores'] })
  })
}
