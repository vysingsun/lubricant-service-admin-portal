<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { storeId } = useCurrentStore()
const { data: staff, isLoading } = useStaffQuery(storeId)
const removeMutation = useRemoveStaffMutation(storeId)

async function onRemove(id: string) {
  await removeMutation.mutateAsync(id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h1 class="text-2xl font-semibold">
        {{ t('staff.title') }}
      </h1>
      <InviteStaffForm />
    </div>

    <div
      v-if="isLoading"
      class="text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <UAlert
      v-else-if="!staff?.length"
      icon="i-lucide-users"
      color="neutral"
      variant="soft"
      :title="t('staff.empty')"
    />

    <StaffTable
      v-else
      :staff="staff"
      @remove="onRemove"
    />
  </div>
</template>
