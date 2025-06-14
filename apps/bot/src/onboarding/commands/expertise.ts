import { CommandContext } from 'grammy'
import type { OnboardingContext } from '../types'
import { EXPERTISE_GROUPS } from '@/constants'

export default async function expertise(ctx: CommandContext<OnboardingContext>) {
  // Initialize selected expertise if not exists
  if (!ctx.session.selectedExpertise) {
    ctx.session.selectedExpertise = []
  }

  const inlineKeyboard = [
    ...Object.values(EXPERTISE_GROUPS).map((expertise) => {
      const isSelected = ctx.session.selectedExpertise!.includes(expertise)
      const checkbox = isSelected ? '✅' : '☐'
      return [
        { text: `${expertise}`, callback_data: `toggle_${expertise}` },
        {
          text: `${checkbox}`,
          callback_data: `toggle_${expertise}`,
        },
      ]
    }),
    [{ text: 'Done', callback_data: 'expertise_done' }],
  ]

  try {
    await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/skill.png', {
      caption: `What is your expertise?`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // Fallback to text message if image fails
    console.error('Failed to send expertise image:', error)
    await ctx.reply(`What is your expertise?`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  }
}
