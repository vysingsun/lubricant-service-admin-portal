<script setup lang="ts">
import type { StoreAdmin } from '../queries/staff.queries'

defineProps<{
  staff: StoreAdmin[]
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <UTable
    :data="staff"
    :columns="[
      { accessorKey: 'userId', header: 'User ID' },
      { accessorKey: 'role', header: t('staff.role') },
      { accessorKey: 'actions', header: '' }
    ]"
  >
    <template #userId-cell="{ row }">
      <span class="font-mono text-xs">{{ row.original.userId }}</span>
    </template>
    <template #role-cell="{ row }">
      <UBadge
        :color="row.original.role === 'owner' ? 'primary' : 'neutral'"
        variant="subtle"
      >
        {{ row.original.role }}
      </UBadge>
    </template>
    <template #actions-cell="{ row }">
      <div class="flex justify-end">
        <UButton
          size="xs"
          variant="ghost"
          color="error"
          icon="i-lucide-trash"
          :disabled="row.original.role === 'owner'"
          @click="emit('remove', row.original.id)"
        />
      </div>
    </template>
  </UTable>
</template>
