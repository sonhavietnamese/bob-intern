import { CommandContext } from 'grammy'
import { OnboardingContext } from '../types'

export default async function start(ctx: CommandContext<OnboardingContext>) {
  await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/welcome.png', {
    caption: 'Welcome! I am Bob, your personal assistant. How can I call you?',
  })

  ctx.session.waitingForName = true
}
