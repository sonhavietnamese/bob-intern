import type { OnboardingContext } from '../types'
import { handleNameInput } from '../utils/helpers'

export async function handleTextMessage(ctx: OnboardingContext) {
  // Check if we're waiting for name input
  if (ctx.session.waitingForName && ctx.message?.text) {
    await handleNameInput(ctx, ctx.message.text)
    return
  }

  // Handle other text inputs if needed in the future
}
