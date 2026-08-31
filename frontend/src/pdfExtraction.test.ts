import type {
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api'
import { textItemsToString } from './pdfExtraction'
import { getExtractionErrorMessage } from './pdfExtractionErrors'

function textItem(str: string, hasEOL = false): TextItem {
  return {
    str,
    dir: 'ltr',
    transform: [1, 0, 0, 1, 0, 0],
    width: 1,
    height: 1,
    fontName: 'font',
    hasEOL,
  }
}

describe('PDF text extraction helpers', () => {
  it('joins readable text while preserving line endings', () => {
    const markedContent = { type: 'beginMarkedContent', id: 'section' } as TextMarkedContent
    const result = textItemsToString([
      textItem('JavaScript'),
      markedContent,
      textItem('React', true),
      textItem('Projects'),
    ])

    expect(result).toBe('JavaScript React\nProjects')
  })

  it('returns a useful message for an image-only PDF', () => {
    expect(getExtractionErrorMessage(new Error('NO_READABLE_TEXT'))).toMatch(
      /no readable text/i,
    )
  })

  it('returns a useful message for a protected PDF', () => {
    const error = new Error('Password required')
    error.name = 'PasswordException'
    expect(getExtractionErrorMessage(error)).toMatch(/password-protected/i)
  })

  it('returns a safe message for an unknown parser error', () => {
    expect(getExtractionErrorMessage(new Error('broken data'))).toMatch(
      /could not read/i,
    )
  })
})
