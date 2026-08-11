<script setup lang="ts">
const { t } = useI18n()
const { storeId } = useCurrentStore()
const inviteMutation = useInviteStaffMutation(storeId)

const open = ref(false)
const userId = ref('')
const role = ref<'owner' | 'staff'>('staff')

const roleOptions = [
  { label: 'Staff', value: 'staff' },
  { label: 'Owner', value: 'owner' }
]

async function onSubmit() {
  await inviteMutation.mutateAsync({ userId: userId.value, role: role.value })
  open.value = false
  userId.value = ''
  role.value = 'staff'
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('staff.invite')"
  >
    <UButton icon="i-lucide-user-plus">
      {{ t('staff.invite') }}
    </UButton>

    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="User ID (from kot-preng-api)">
          <UInput
            v-model="userId"
            class="w-full"
            placeholder="uuid"
          />
        </UFormField>
        <UFormField :label="t('staff.role')">
          <USelect
            v-model="role"
            :items="roleOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>
        <UButton
          :loading="inviteMutation.isLoading.value"
          block
          @click="onSubmit"
        >
          {{ t('staff.invite') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
