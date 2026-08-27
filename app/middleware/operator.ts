export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth()

  if (user.value?.role !== 'Operator') {
    return navigateTo('/dashboard')
  }
})
