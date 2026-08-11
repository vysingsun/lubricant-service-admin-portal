export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth()

  if (user.value?.role !== 'Operator' && user.value?.role !== 'Super_Admin') {
    return navigateTo('/dashboard')
  }
})
