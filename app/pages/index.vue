<script setup lang="ts">
const { isAuthenticated } = useAuth()

await navigateTo(isAuthenticated.value ? '/dashboard' : '/login')
</script>

<template>
  <div />
</template>
