<script setup lang="ts">
const { t } = useI18n()
const { login } = useAuth()

const identifier = ref('')
const password = ref('')
const pending = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  pending.value = true
  try {
    await login(identifier.value, password.value)
    await navigateTo('/dashboard')
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined
    errorMessage.value = message === 'VENDOR_ONLY'
      ? t('auth.login.vendorOnly')
      : message || t('auth.login.error')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-sm">
    <template #header>
      <h1 class="text-lg font-semibold">
        {{ t('auth.login.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ t('auth.login.subtitle') }}
      </p>
    </template>

    <form
      class="flex flex-col gap-4"
      @submit.prevent="onSubmit"
    >
      <UFormField :label="t('auth.login.identifier')">
        <UInput
          v-model="identifier"
          type="text"
          required
          autocomplete="username"
          :placeholder="t('auth.login.identifierPlaceholder')"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('auth.login.password')">
        <UInput
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />

      <UButton
        type="submit"
        block
        :loading="pending"
      >
        {{ t('auth.login.submit') }}
      </UButton>
    </form>
  </UCard>
</template>
