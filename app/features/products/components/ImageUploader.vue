<script setup lang="ts">
const props = defineProps<{
  images: { id: string, url: string }[]
}>()

const emit = defineEmits<{
  add: [url: string]
  remove: [id: string]
}>()

const { t } = useI18n()
const uploadMutation = useUploadImageMutation()
const fileInput = useTemplateRef('fileInput')

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const result = await uploadMutation.mutateAsync(file)
  emit('add', result.url)

  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div>
    <p class="text-sm font-medium mb-2">
      {{ t('products.images') }}
    </p>

    <div class="flex flex-wrap gap-3 mb-3">
      <div
        v-for="image in props.images"
        :key="image.id"
        class="relative group"
      >
        <img
          :src="image.url"
          class="size-20 rounded-md object-cover border border-default"
        >
        <UButton
          icon="i-lucide-x"
          size="xs"
          color="error"
          variant="solid"
          class="absolute -top-2 -right-2 rounded-full"
          @click="emit('remove', image.id)"
        />
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    >
    <UButton
      icon="i-lucide-upload"
      color="neutral"
      variant="outline"
      :loading="uploadMutation.isLoading.value"
      @click="fileInput?.click()"
    >
      Upload image
    </UButton>
  </div>
</template>
