<script setup lang="ts">
import type { BakongToken, BakongTokenStatus } from '../queries/bakong-tokens.queries'

defineProps<{
  tokens: BakongToken[]
}>()

const emit = defineEmits<{
  delete: [id: string]
  renew: [id: string]
}>()

const { t } = useI18n()

const statusColor: Record<BakongTokenStatus, 'success' | 'warning' | 'error'> = {
  active: 'success',
  limit_reached: 'warning',
  expired: 'error'
}
</script>

<template>
  <UTable
    :data="tokens"
    :columns="[
      { accessorKey: 'email', header: t('bakongTokens.email') },
      { accessorKey: 'status', header: t('bakongTokens.status') },
      { accessorKey: 'usage', header: t('bakongTokens.usage') },
      { accessorKey: 'expiredDate', header: t('bakongTokens.expiredDate') },
      { accessorKey: 'actions', header: '' }
    ]"
  >
    <template #status-cell="{ row }">
      <UBadge
        :color="statusColor[row.original.status]"
        variant="subtle"
      >
        {{ t(`bakongTokens.statusValues.${row.original.status}`) }}
      </UBadge>
    </template>
    <template #usage-cell="{ row }">
      <span :class="row.original.dailyCount >= row.original.dailyLimit ? 'text-error font-medium' : ''">
        {{ row.original.dailyCount }}/{{ row.original.dailyLimit }}
      </span>
    </template>
    <template #expiredDate-cell="{ row }">
      <div class="flex items-center gap-2">
        {{ new Date(row.original.expiredDate).toLocaleDateString() }}
        <UBadge
          v-if="row.original.expiringSoon && row.original.status !== 'expired'"
          color="warning"
          variant="subtle"
          size="sm"
        >
          {{ t('bakongTokens.expiringSoon') }}
        </UBadge>
      </div>
    </template>
    <template #actions-cell="{ row }">
      <div class="flex justify-end gap-2">
        <UButton
          v-if="row.original.expiringSoon || row.original.status === 'expired'"
          size="xs"
          variant="ghost"
          icon="i-lucide-refresh-cw"
          :title="t('bakongTokens.renew')"
          @click="emit('renew', row.original._id)"
        />
        <UButton
          size="xs"
          variant="ghost"
          icon="i-lucide-pencil"
          :to="`/bakong-tokens/${row.original._id}/edit`"
        />
        <UButton
          size="xs"
          variant="ghost"
          color="error"
          icon="i-lucide-trash"
          @click="emit('delete', row.original._id)"
        />
      </div>
    </template>
  </UTable>
</template>
