import { defineStore } from 'pinia'

/** Tracks which store a Vendor is currently managing, since products,
 * staff, and orders are all scoped by `storeId` on the backend. */
export const useCurrentStoreStore = defineStore('current-store', () => {
  const storeIdCookie = useCookie<string | null>('current_store_id', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30
  })

  const storeId = ref(storeIdCookie.value)

  function setStoreId(id: string) {
    storeId.value = id
    storeIdCookie.value = id
  }

  return { storeId, setStoreId }
})
