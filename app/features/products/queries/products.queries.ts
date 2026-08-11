import { useQuery, useMutation, useQueryCache } from '@pinia/colada'

export type ProductUnit = 'liter' | 'kg' | 'piece'
export type ProductStatus = 'draft' | 'active' | 'archived'

export interface PriceTier {
  id: string
  minQty: number
  unitPrice: number
}

export interface ProductVariant {
  id: string
  sku: string
  label: string
  unit: ProductUnit
  unitSize: number
  price: number
  stockQty: number
  minOrderQty: number
  status: string
  priceTiers?: PriceTier[]
}

export interface ProductImage {
  id: string
  url: string
  sortOrder: number
}

export interface Product {
  id: string
  storeId: string
  categoryId: string | null
  name: string
  slug: string
  brand: string | null
  description: string | null
  status: ProductStatus
  images: ProductImage[]
  variants: ProductVariant[]
}

export interface ProductPayload {
  name: string
  slug: string
  brand?: string
  description?: string
  categoryId?: string
  status?: ProductStatus
}

export interface VariantPayload {
  sku: string
  label: string
  unit: ProductUnit
  unitSize: number
  price: number
  stockQty: number
  minOrderQty: number
}

export interface PriceTierPayload {
  minQty: number
  unitPrice: number
}

export function useProductsQuery(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()

  return useQuery({
    key: () => ['products', storeId.value ?? ''],
    query: () => apiFetch<Product[]>(`/stores/${storeId.value}/products`),
    enabled: () => !!storeId.value
  })
}

export function useProductQuery(storeId: Ref<string | null | undefined>, productId: Ref<string>) {
  const { apiFetch } = useApi()

  return useQuery({
    key: () => ['products', storeId.value ?? '', productId.value],
    query: () => apiFetch<Product>(`/stores/${storeId.value}/products/${productId.value}`),
    enabled: () => !!storeId.value && !!productId.value
  })
}

export function useCreateProductMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (payload: ProductPayload) =>
      apiFetch<Product>(`/stores/${storeId.value}/products`, { method: 'POST', body: payload }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['products', storeId.value ?? ''] })
  })
}

export function useUpdateProductMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ id, payload }: { id: string, payload: Partial<ProductPayload> }) =>
      apiFetch<Product>(`/stores/${storeId.value}/products/${id}`, { method: 'PATCH', body: payload }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['products', storeId.value ?? ''] })
  })
}

export function useDeleteProductMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: (id: string) =>
      apiFetch(`/stores/${storeId.value}/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['products', storeId.value ?? ''] })
  })
}

export function useAddVariantMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ productId, payload }: { productId: string, payload: VariantPayload }) =>
      apiFetch<ProductVariant>(`/stores/${storeId.value}/products/${productId}/variants`, {
        method: 'POST',
        body: payload
      }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['products', storeId.value ?? ''] })
  })
}

export function useAddPriceTierMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ productId, variantId, payload }: { productId: string, variantId: string, payload: PriceTierPayload }) =>
      apiFetch<PriceTier>(
        `/stores/${storeId.value}/products/${productId}/variants/${variantId}/price-tiers`,
        { method: 'POST', body: payload }
      ),
    onSuccess: () => queryCache.invalidateQueries({ key: ['products', storeId.value ?? ''] })
  })
}

export function useAddProductImageMutation(storeId: Ref<string | null | undefined>) {
  const { apiFetch } = useApi()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ productId, url, sortOrder }: { productId: string, url: string, sortOrder?: number }) =>
      apiFetch<ProductImage>(`/stores/${storeId.value}/products/${productId}/images`, {
        method: 'POST',
        body: { url, sortOrder }
      }),
    onSuccess: () => queryCache.invalidateQueries({ key: ['products', storeId.value ?? ''] })
  })
}
