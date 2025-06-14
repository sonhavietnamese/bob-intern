import type { OnboardingContext } from '../types'

export async function handleTextMessage(ctx: OnboardingContext) {
  if (ctx.session.waitingForName) {
    const userName = ctx.message?.text

    if (!userName) {
      return
    }

    ctx.session.userName = userName
    ctx.session.waitingForName = false

    await ctx.api.setMessageReaction(ctx.message.chat.id, ctx.message.message_id, [{ type: 'emoji', emoji: '🎉' }])
    await ctx.reply(`Nice to meet you, ${userName}!`, {})
  }
}
