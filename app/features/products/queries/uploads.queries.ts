import { useMutation } from '@pinia/colada'

interface UploadResponse {
  url: string
}

export function useUploadImageMutation() {
  const { apiFetch } = useApi()

  return useMutation({
    mutation: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiFetch<UploadResponse>('/uploads/image', {
        method: 'POST',
        body: formData
      })
    }
  })
}
