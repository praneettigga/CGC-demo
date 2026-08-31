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
