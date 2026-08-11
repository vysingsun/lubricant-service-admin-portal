<script setup lang="ts">
import type { ProductVariant, VariantPayload } from '../queries/products.queries'

const props = defineProps<{
  productId: string
  variants: ProductVariant[]
}>()

const { t } = useI18n()
const { storeId } = useCurrentStore()
const addVariantMutation = useAddVariantMutation(storeId)
const addPriceTierMutation = useAddPriceTierMutation(storeId)

const showForm = ref(false)
const form = reactive<VariantPayload>({
  sku: '',
  label: '',
  unit: 'liter',
  unitSize: 1,
  price: 0,
  stockQty: 0,
  minOrderQty: 1
})

const unitOptions = [
  { label: 'Liter', value: 'liter' },
  { label: 'Kg', value: 'kg' },
  { label: 'Piece', value: 'piece' }
]

async function onAddVariant() {
  await addVariantMutation.mutateAsync({ productId: props.productId, payload: { ...form } })
  showForm.value = false
  form.sku = ''
  form.label = ''
  form.unitSize = 1
  form.price = 0
  form.stockQty = 0
  form.minOrderQty = 1
}

const newTierByVariant = reactive<Record<string, { minQty: number, unitPrice: number }>>({})

function tierDraft(variantId: string) {
  if (!newTierByVariant[variantId]) {
    newTierByVariant[variantId] = { minQty: 1, unitPrice: 0 }
  }
  return newTierByVariant[variantId]
}

async function onAddPriceTier(variantId: string) {
  const draft = tierDraft(variantId)
  await addPriceTierMutation.mutateAsync({
    productId: props.productId,
    variantId,
    payload: { ...draft }
  })
  newTierByVariant[variantId] = { minQty: 1, unitPrice: 0 }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <p class="text-sm font-medium">
        {{ t('products.variants') }}
      </p>
      <UButton
        size="xs"
        variant="soft"
        icon="i-lucide-plus"
        @click="showForm = !showForm"
      >
        Add variant
      </UButton>
    </div>

    <UCard
      v-if="showForm"
      class="mb-4"
    >
      <div class="grid grid-cols-2 gap-3">
        <UFormField label="SKU">
          <UInput
            v-model="form.sku"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Label">
          <UInput
            v-model="form.label"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Unit">
          <USelect
            v-model="form.unit"
            :items="unitOptions"
            value-key="value"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Unit size">
          <UInput
            v-model.number="form.unitSize"
            type="number"
            min="0"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Price">
          <UInput
            v-model.number="form.price"
            type="number"
            min="0"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Stock qty">
          <UInput
            v-model.number="form.stockQty"
            type="number"
            min="0"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Min order qty">
          <UInput
            v-model.number="form.minOrderQty"
            type="number"
            min="1"
            class="w-full"
          />
        </UFormField>
      </div>
      <template #footer>
        <UButton
          :loading="addVariantMutation.isLoading.value"
          @click="onAddVariant"
        >
          Save variant
        </UButton>
      </template>
    </UCard>

    <div class="flex flex-col gap-3">
      <UCard
        v-for="variant in props.variants"
        :key="variant.id"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">
              {{ variant.label }} <span class="text-muted">({{ variant.sku }})</span>
            </p>
            <p class="text-sm text-muted">
              {{ formatCurrency(variant.price) }} / {{ variant.unitSize }} {{ variant.unit }} · stock {{ variant.stockQty }}
            </p>
          </div>
          <UBadge
            :color="variant.status === 'active' ? 'success' : 'neutral'"
            variant="subtle"
          >
            {{ variant.status }}
          </UBadge>
        </div>

        <div class="mt-3">
          <p class="text-xs font-medium text-muted mb-1">
            {{ t('products.priceTiers') }}
          </p>
          <div class="flex flex-wrap gap-2 mb-2">
            <UBadge
              v-for="tier in variant.priceTiers"
              :key="tier.id"
              color="neutral"
              variant="subtle"
            >
              {{ tier.minQty }}+ @ {{ formatCurrency(tier.unitPrice) }}
            </UBadge>
          </div>
          <div class="flex items-end gap-2">
            <UFormField label="Min qty">
              <UInput
                v-model.number="tierDraft(variant.id).minQty"
                type="number"
                min="1"
                class="w-24"
              />
            </UFormField>
            <UFormField label="Unit price">
              <UInput
                v-model.number="tierDraft(variant.id).unitPrice"
                type="number"
                min="0"
                class="w-28"
              />
            </UFormField>
            <UButton
              size="xs"
              variant="soft"
              :loading="addPriceTierMutation.isLoading.value"
              @click="onAddPriceTier(variant.id)"
            >
              Add tier
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
