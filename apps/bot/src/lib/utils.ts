export const leftAlignTextTelegram = (text: string, maxLength: number) => {
  const textLength = text.length
  const remainingLength = maxLength - textLength
  const padding = ' '.repeat(remainingLength)
  return text + padding
}
