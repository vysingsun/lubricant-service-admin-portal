/** $fetch bound to the NestJS backend, with the vendor's bearer token
 * attached automatically. Every Pinia Colada query/mutation fetcher
 * should go through this instead of calling $fetch or useFetch directly,
 * so API calls stay inside the query-caching layer. */
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBaseUrl,
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
