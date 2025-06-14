import { CommandContext } from 'grammy'
import { OnboardingContext } from '../types'
import { SKILL_GROUPS } from '@/constants'

export default async function expertise(ctx: CommandContext<OnboardingContext>) {
  // Initialize selected skills if not exists
  if (!ctx.session.selectedSkills) {
    ctx.session.selectedSkills = []
  }

  const selectedSkillsText = ctx.session.selectedSkills.length > 0 ? `\n\nSelected skills: ${ctx.session.selectedSkills.join(', ')}` : ''

  const inlineKeyboard = [
    ...Object.values(SKILL_GROUPS).map((skill) => {
      const isSelected = ctx.session.selectedSkills!.includes(skill)
      const checkbox = isSelected ? '✅' : '☐'
      return [
        { text: `${skill}`, callback_data: `toggle_${skill}` },
        {
          text: `${checkbox}`,
          callback_data: `toggle_${skill}`,
        },
      ]
    }),
    [{ text: 'Done', callback_data: 'skills_done' }],
  ]

  try {
    await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/welcome.png', {
      caption: `What skills do you have?${selectedSkillsText}`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // Fallback to text message if image fails
    console.error('Failed to send skill image:', error)
    await ctx.reply(`What skills do you have?${selectedSkillsText}`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  }
}
