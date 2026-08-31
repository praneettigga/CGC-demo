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
