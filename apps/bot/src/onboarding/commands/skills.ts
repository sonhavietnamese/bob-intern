import { CommandContext } from 'grammy'
import type { OnboardingContext } from '../types'
import { SKILLS } from '@/constants'

export default async function skills(ctx: CommandContext<OnboardingContext>) {
  // Initialize selectedSkills if it doesn't exist
  if (!ctx.session.selectedSkills) {
    ctx.session.selectedSkills = []
  }

  // Get all skills from selected expertise areas
  const allAvailableSkills: string[] = []
  if (ctx.session.selectedExpertise) {
    ctx.session.selectedExpertise.forEach((expertise) => {
      const skillsForExpertise = SKILLS[expertise as keyof typeof SKILLS]
      if (skillsForExpertise) {
        allAvailableSkills.push(...skillsForExpertise)
      }
    })
  }

  // Remove duplicates
  const uniqueSkills = [...new Set(allAvailableSkills)]

  const inlineKeyboard = [
    ...uniqueSkills.map((skill) => {
      const isSelected = ctx.session.selectedSkills!.includes(skill)
      const checkbox = isSelected ? '✅' : '☐'
      return [
        { text: skill, callback_data: `toggle_skill_${skill}` },
        { text: checkbox, callback_data: `toggle_skill_${skill}` },
      ]
    }),
    [{ text: 'Done', callback_data: 'skills_done' }],
  ]

  await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/skill.png', {
    caption: 'Select your specific skills',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  })
}
