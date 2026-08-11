import { useQuery, useMutation, useQueryCache } from '@pinia/colada'

export type StoreAdminRole = 'owner' | 'staff'

export interface StoreAdmin {
  id: string
  storeId: string
  userId: string
  role: StoreAdminRole
}

export interface InviteStaffPayload {
  userId: string
  role: StoreAdminRole
}

export function useStaffQuery(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()

  return useQuery({
    key: () => ['staff', storeId.value ?? ''],
    query: () => apiFetch<StoreAdmin[]>(`/stores/${storeId.value}/admins`),
    enabled: () => !!storeId.value
  })
}

export function useInviteStaffMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (payload: InviteStaffPayload) =>
      apiFetch<StoreAdmin>(`/stores/${storeId.value}/admins`, { method: 'POST', body: payload }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['staff', storeId.value ?? ''] })
  })
}

export function useRemoveStaffMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (id: string) =>
      apiFetch(`/stores/${storeId.value}/admins/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['staff', storeId.value ?? ''] })
  })
}
