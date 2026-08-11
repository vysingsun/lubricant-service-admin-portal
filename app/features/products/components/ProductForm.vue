<script setup lang="ts">
import type { Product } from '../queries/products.queries'

const props = defineProps<{
  product?: Product
}>()

const { t } = useI18n()
const { storeId } = useCurrentStore()
const { form, syncSlugFromName } = useProductForm(props.product)

const createMutation = useCreateProductMutation(storeId)
const updateMutation = useUpdateProductMutation(storeId)
const addImageMutation = useAddProductImageMutation(storeId)

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' }
]

async function onSubmit() {
  if (props.product) {
    await updateMutation.mutateAsync({ id: props.product.id, payload: form })
  } else {
    const created = await createMutation.mutateAsync(form)
    await navigateTo(`/products/${created.id}/edit`)
  }
}

async function onAddImage(url: string) {
  if (!props.product) return
  await addImageMutation.mutateAsync({ productId: props.product.id, url })
}

const saving = computed(() => createMutation.isLoading.value || updateMutation.isLoading.value)
</script>

<template>
  <div class="flex flex-col gap-6 max-w-2xl">
    <UCard>
      <div class="grid grid-cols-2 gap-4">
        <UFormField
          :label="t('products.name')"
          class="col-span-2"
        >
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
        <UFormField :label="t('products.brand')">
          <UInput
            v-model="form.brand"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="t('products.status')">
          <USelect
            v-model="form.status"
            :items="statusOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="t('products.description')"
          class="col-span-2"
        >
          <UTextarea
            v-model="form.description"
            class="w-full"
          />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="neutral"
            variant="ghost"
            to="/products"
          >
            {{ t('products.cancel') }}
          </UButton>
          <UButton
            :loading="saving"
            @click="onSubmit"
          >
            {{ t('products.save') }}
          </UButton>
        </div>
      </template>
    </UCard>

    <UCard v-if="props.product">
      <ImageUploader
        :images="props.product.images"
        @add="onAddImage"
      />
    </UCard>

    <UCard v-if="props.product">
      <VariantEditor
        :product-id="props.product.id"
        :variants="props.product.variants"
      />
    </UCard>
  </div>
</template>
