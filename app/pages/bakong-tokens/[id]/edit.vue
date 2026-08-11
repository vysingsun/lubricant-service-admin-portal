<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'operator']
})

const { t } = useI18n()
const route = useRoute()
const tokenId = computed(() => route.params.id as string)
const { data: token, isLoading } = useBakongTokenQuery(tokenId)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      {{ t('bakongTokens.edit') }}
    </h1>

    <div
      v-if="isLoading"
      class="text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <BakongTokenForm
      v-else-if="token"
      :token="token"
    />
  </div>
</template>
