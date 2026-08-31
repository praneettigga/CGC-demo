export const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024

export function validatePdf(file: File): string | null {
  const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf')
  const hasPdfType = file.type === '' || file.type === 'application/pdf'

  if (!hasPdfExtension || !hasPdfType) {
    return 'Please choose a PDF file.'
  }

  if (file.size === 0) {
    return 'This PDF is empty. Please choose another file.'
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return 'This PDF is larger than 10 MB. Please choose a smaller file.'
  }

  return null
}

export async function hasPdfSignature(file: File): Promise<boolean> {
  const signature = await file.slice(0, 5).text()
  return signature === '%PDF-'
}
