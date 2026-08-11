import { useQuery } from '@pinia/colada'

export interface OrderItem {
  id: string
  variantId: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  buyerUserId: string
  stationId: string
  storeId: string
  status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled'
  totalAmount: number
  notes: string | null
  createdAt: string
  items: OrderItem[]
}

export function useStoreOrdersQuery(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()

  return useQuery({
    key: () => ['orders', storeId.value ?? ''],
    query: () => apiFetch<Order[]>(`/stores/${storeId.value}/orders`),
    enabled: () => !!storeId.value
  })
}
