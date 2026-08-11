/** $fetch bound to kot-preng-api directly (the backend that issues the
 * bearer token, unlike useApi() which targets the other backend). Used
 * for resources that live only on kot-preng-api, e.g. the Bakong token
 * pool. Every Pinia Colada query/mutation fetcher for such resources
 * should go through this instead of calling $fetch or useFetch directly. */
export function useKotPrengApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.kotPrengApiBaseUrl,
    onRequest({ options }) {
      if (authStore.token) {
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
    }
  })

  return { apiFetch }
}
