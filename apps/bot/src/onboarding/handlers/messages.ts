import type { OnboardingContext } from '../types'

export async function handleTextMessage(ctx: OnboardingContext) {
  if (ctx.session.waitingForName) {
    const userName = ctx.message?.text

    if (!userName) {
      return
    }

    // Log the user's name
    console.log(`User provided their name: ${userName}`)

    // Store the name in session
    ctx.session.userName = userName
    ctx.session.waitingForName = false

    await ctx.api.setMessageReaction(ctx.message.chat.id, ctx.message.message_id, [{ type: 'emoji', emoji: '🎉' }])
    // Reply to confirm we got their name
    await ctx.reply(`Nice to meet you, ${userName}! I'll remember your name.`, {})
  }
}
