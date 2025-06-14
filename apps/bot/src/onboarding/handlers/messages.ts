import type { OnboardingContext } from '../types'
import expertise from '../commands/expertise'

export async function handleTextMessage(ctx: OnboardingContext) {
  if (ctx.session.waitingForName) {
    const userName = ctx.message?.text

    if (!userName) {
      return
    }

    ctx.session.userName = userName
    ctx.session.waitingForName = false

    await ctx.api.setMessageReaction(ctx.message.chat.id, ctx.message.message_id, [{ type: 'emoji', emoji: '🎉' }])
    await ctx.reply(`Nice to meet you, ${userName}! Beautifull name!`, {})

    // Continue to expertise selection using the existing command
    await expertise(ctx as any)
  }
}
