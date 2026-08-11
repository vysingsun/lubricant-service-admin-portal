<script setup lang="ts">
import type { Store } from '../queries/stores.queries'

const props = defineProps<{
  store?: Store
}>()

const { t } = useI18n()
const router = useRouter()
const createMutation = useCreateStoreMutation()
const updateMutation = useUpdateStoreMutation()
const uploadMutation = useUploadImageMutation()
const { setStoreId } = useCurrentStore()

const form = reactive({
  name: props.store?.name ?? '',
  slug: props.store?.slug ?? '',
  description: props.store?.description ?? '',
  logoUrl: props.store?.logoUrl ?? '',
  status: props.store?.status ?? 'pending'
})

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' }
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function syncSlugFromName() {
  if (!props.store) {
    form.slug = slugify(form.name)
  }
}

const fileInput = useTemplateRef('fileInput')

async function onLogoChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const result = await uploadMutation.mutateAsync(file)
  form.logoUrl = result.url
}

const saving = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''
  saving.value = true
  try {
    if (props.store) {
      await updateMutation.mutateAsync({
        id: props.store.id,
        payload: {
          name: form.name,
          slug: form.slug,
          description: form.description || undefined,
          logoUrl: form.logoUrl || undefined,
          status: form.status
        }
      })
    } else {
      const created = await createMutation.mutateAsync({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined
      })
      setStoreId(created.id)
      await router.push('/dashboard')
    }
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
        {{ props.store ? props.store.name : t('storeSettings.create') }}
      </h1>
      <p class="text-sm text-muted">
        {{ t('storeSettings.createSubtitle') }}
      </p>
    </template>

    <div class="flex flex-col gap-4">
      <UFormField :label="t('storeSettings.name')">
        <UInput
          v-model="form.name"
          class="w-full"
          @update:model-value="syncSlugFromName"
        />
      </UFormField>

      <UFormField label="Slug">
        <UInput
          v-model="form.slug"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('storeSettings.description')">
        <UTextarea
          v-model="form.description"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('storeSettings.logo')">
        <div class="flex items-center gap-3">
          <UAvatar
            :src="form.logoUrl || undefined"
            size="lg"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onLogoChange"
          >
          <UButton
            icon="i-lucide-upload"
            color="neutral"
            variant="outline"
            :loading="uploadMutation.isLoading.value"
            @click="fileInput?.click()"
          >
            {{ t('storeSettings.uploadLogo') }}
          </UButton>
        </div>
      </UFormField>

      <UFormField v-if="props.store" :label="t('storeSettings.status')">
        <USelect
          v-model="form.status"
          :items="statusOptions"
          value-key="value"
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
        :disabled="!form.name || !form.slug"
        block
        @click="onSubmit"
      >
        {{ props.store ? t('storeSettings.save') : t('storeSettings.create') }}
      </UButton>
    </template>
  </UCard>
</template>
