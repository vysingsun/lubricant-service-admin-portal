export function useCurrentStore() {
  const currentStoreStore = useCurrentStoreStore()
  const { storeId } = storeToRefs(currentStoreStore)
  const { data: stores } = useStoresQuery()

  watchEffect(() => {
    const firstStore = stores.value?.[0]
    if (!storeId.value && firstStore) {
      currentStoreStore.setStoreId(firstStore.id)
    }
  })

  return {
    storeId,
    stores,
    setStoreId: currentStoreStore.setStoreId
  }
}
