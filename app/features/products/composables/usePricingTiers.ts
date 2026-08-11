import type { PriceTierPayload } from '../queries/products.queries'

export function usePricingTiers(initial: PriceTierPayload[] = []) {
  const tiers = ref<PriceTierPayload[]>([...initial])

  function addTier() {
    tiers.value.push({ minQty: 1, unitPrice: 0 })
  }

  function removeTier(index: number) {
    tiers.value.splice(index, 1)
  }

  const sortedTiers = computed(() =>
    [...tiers.value].sort((a, b) => a.minQty - b.minQty)
  )

  return { tiers, sortedTiers, addTier, removeTier }
}
