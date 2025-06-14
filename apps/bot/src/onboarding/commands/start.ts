import type { OnboardingContext } from '@/onboarding/types'
import { CommandContext } from 'grammy'

export default async function start(ctx: CommandContext<OnboardingContext>) {
  await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/welcome.png', {
    caption: 'Welcome! I am Bob, your personal assistant. How can I call you?',
  })

  ctx.session.waitingForName = true
}
