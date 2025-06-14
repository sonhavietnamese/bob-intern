import { SKILL_GROUPS, USD_RANGES } from '@/constants'
import { OnboardingContext } from '../types'

// Helper function to update the skills message
export async function updateSkillsMessage(ctx: OnboardingContext) {
  const selectedSkillsText = ctx.session.selectedSkills!.length > 0 ? `\n\nSelected skills: ${ctx.session.selectedSkills!.join(', ')}` : ''

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
    await ctx.editMessageCaption({
      caption: `What skills do you have?${selectedSkillsText}`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // If editing caption fails (might be a text message), try editing text instead
    try {
      await ctx.editMessageText(`What skills do you have?${selectedSkillsText}`, {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      })
    } catch (editError) {
      console.error('Failed to update skills message:', editError)
    }
  }
}

// Helper function to update the listing message
export async function updateListingMessage(ctx: OnboardingContext) {
  const listings = ['Bounties', 'Projects']

  const selectedListingsText = ctx.session.selectedListings!.length > 0 ? `\n\nSelected: ${ctx.session.selectedListings!.join(', ')}` : ''

  const inlineKeyboard = [
    ...listings.map((listing) => {
      const isSelected = ctx.session.selectedListings!.includes(listing)
      const checkbox = isSelected ? '✅' : '☐'
      return [
        { text: `${listing}`, callback_data: `toggle_listing_${listing.toLowerCase()}` },
        { text: `${checkbox}`, callback_data: `toggle_listing_${listing.toLowerCase()}` },
      ]
    }),
    [{ text: 'Done', callback_data: 'listing_done' }],
  ]

  try {
    await ctx.editMessageCaption({
      caption: `Superteam Earn comes with Bounties and Projects, which you most prefer?${selectedListingsText}`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // If editing caption fails, try editing text instead
    try {
      await ctx.editMessageText(`Superteam Earn comes with Bounties and Projects, which you most prefer?${selectedListingsText}`, {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      })
    } catch (editError) {
      console.error('Failed to update listing message:', editError)
    }
  }
}

// Helper function to show USD range selection
export async function showUSDRangeSelection(ctx: OnboardingContext) {
  const inlineKeyboard = USD_RANGES.map((range, index) => [
    {
      text: `${range.label} ($${range.value.min} - $${range.value.max})`,
      callback_data: `select_range_${index}`,
    },
  ])

  try {
    await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/usd-range.png', {
      caption: 'What is your preferred USD range for projects?',
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // Fallback to text message if image fails
    console.error('Failed to send USD range image:', error)
    await ctx.reply('What is your preferred USD range for projects?', {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  }
}
