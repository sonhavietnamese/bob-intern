import { EXPERTISE_GROUPS, USD_RANGES } from '@/constants'
import type { OnboardingContext } from '../types'

// Helper function to update the skills message
export async function updateExpertiseMessage(ctx: OnboardingContext) {
  const selectedExpertiseText = ctx.session.selectedExpertise!.length > 0 ? `\n\nSelected: ${ctx.session.selectedExpertise!.join(', ')}` : ''

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
    await ctx.editMessageCaption({
      caption: `What is your expertise?${selectedExpertiseText}`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // If editing caption fails (might be a text message), try editing text instead
    try {
      await ctx.editMessageText(`What is your expertise?${selectedExpertiseText}`, {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      })
    } catch (editError) {
      console.error('Failed to update expertise message:', editError)
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
