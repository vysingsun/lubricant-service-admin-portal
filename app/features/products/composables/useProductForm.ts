import type { Product, ProductPayload } from '../queries/products.queries'

export function useProductForm(initial?: Product) {
  const form = reactive<ProductPayload>({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    brand: initial?.brand ?? undefined,
    description: initial?.description ?? undefined,
    categoryId: initial?.categoryId ?? undefined,
    status: initial?.status ?? 'draft'
  })

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function syncSlugFromName() {
    if (!initial) {
      form.slug = slugify(form.name)
    }
  }

  return { form, syncSlugFromName }
}
