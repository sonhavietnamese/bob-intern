import { CommandContext } from 'grammy'
import type { OnboardingContext } from '../types'
import { askForName } from '../utils/helpers'

export default async function name(ctx: CommandContext<OnboardingContext>) {
  // Set to individual command mode
  ctx.session.isOnboarding = false
  await askForName(ctx)
}
