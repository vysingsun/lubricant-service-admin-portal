<script setup lang="ts">
import type { BakongToken } from '../queries/bakong-tokens.queries'

const props = defineProps<{
  token?: BakongToken
}>()

const { t } = useI18n()
const router = useRouter()
const createMutation = useCreateBakongTokenMutation()
const updateMutation = useUpdateBakongTokenMutation()

function toDateInput(value?: string) {
  return value ? value.slice(0, 10) : ''
}

const form = reactive({
  email: props.token?.email ?? '',
  token: props.token?.token ?? '',
  createdDate: toDateInput(props.token?.createdDate) || toDateInput(new Date().toISOString()),
  expiredDate: toDateInput(props.token?.expiredDate),
  notes: props.token?.notes ?? ''
})

const saving = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  saving.value = true
  try {
    if (props.token) {
      await updateMutation.mutateAsync({
        id: props.token._id,
        payload: {
          token: form.token,
          expiredDate: form.expiredDate,
          notes: form.notes || undefined
        }
      })
    } else {
      await createMutation.mutateAsync({
        email: form.email,
        token: form.token,
        createdDate: form.createdDate || undefined,
        expiredDate: form.expiredDate,
        notes: form.notes || undefined
      })
    }
    await router.push('/bakong-tokens')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('common.error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UCard class="w-full max-w-lg">
    <template #header>
      <h1 class="text-lg font-semibold">
        {{ props.token ? props.token.email : t('bakongTokens.create') }}
      </h1>
    </template>

    <div class="flex flex-col gap-4">
      <UFormField :label="t('bakongTokens.email')">
        <UInput
          v-model="form.email"
          type="email"
          class="w-full"
          :disabled="!!props.token"
        />
      </UFormField>

      <UFormField :label="t('bakongTokens.token')">
        <UTextarea
          v-model="form.token"
          class="w-full"
          :rows="3"
        />
      </UFormField>

      <UFormField
        v-if="!props.token"
        :label="t('bakongTokens.createdDate')"
      >
        <UInput
          v-model="form.createdDate"
          type="date"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('bakongTokens.expiredDate')">
        <UInput
          v-model="form.expiredDate"
          type="date"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('bakongTokens.notes')">
        <UTextarea
          v-model="form.notes"
          class="w-full"
        />
      </UFormField>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        :title="errorMessage"
      />
    </div>

    <template #footer>
      <UButton
        :loading="saving"
        :disabled="!form.email || !form.token || !form.expiredDate"
        block
        @click="onSubmit"
      >
        {{ props.token ? t('bakongTokens.save') : t('bakongTokens.create') }}
      </UButton>
    </template>
  </UCard>
</template>
