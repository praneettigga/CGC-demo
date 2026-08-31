import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api'

GlobalWorkerOptions.workerSrc = workerUrl

export interface ExtractedResume {
  text: string
  pageCount: number
}

export function textItemsToString(
  items: Array<TextItem | TextMarkedContent>,
): string {
  return items
    .filter((item): item is TextItem => 'str' in item)
    .map((item) => `${item.str}${item.hasEOL ? '\n' : ' '}`)
    .join('')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export async function extractPdfText(file: File): Promise<ExtractedResume> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = getDocument({ data: bytes })

  try {
    const pdf = await loadingTask.promise
    const pages: string[] = []

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()
      const pageText = textItemsToString(content.items)
      if (pageText) pages.push(pageText)
      page.cleanup()
    }

    const text = pages.join('\n\n').trim()
    if (!text) {
      throw new Error('NO_READABLE_TEXT')
    }

    return { text, pageCount: pdf.numPages }
  } finally {
    await loadingTask.destroy()
  }
}

export function getExtractionErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  const name = error instanceof Error ? error.name : ''

  if (message === 'NO_READABLE_TEXT') {
    return 'This PDF has no readable text. Try a text-based PDF instead of a scanned image.'
  }

  if (name === 'PasswordException' || /password/i.test(message)) {
    return 'This PDF is password-protected. Remove the password and try again.'
  }

  return 'We could not read this PDF. Please check the file and try another one.'
}
