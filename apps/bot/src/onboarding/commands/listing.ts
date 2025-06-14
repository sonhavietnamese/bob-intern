import { CommandContext } from 'grammy'
import type { OnboardingContext } from '../types'

export default async function listing(ctx: CommandContext<OnboardingContext>) {
  // Initialize selected listings if not exists
  if (!ctx.session.selectedListings) {
    ctx.session.selectedListings = []
  }

  const listings = ['Bounties', 'Projects']

  const selectedListingsText = ctx.session.selectedListings.length > 0 ? `\n\nSelected: ${ctx.session.selectedListings.join(', ')}` : ''

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
    await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/welcome.png', {
      caption: `Superteam Earn comes with Bounties and Projects, which you most prefer?${selectedListingsText}`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  } catch (error) {
    // Fallback to text message if image fails
    console.error('Failed to send listing image:', error)
    await ctx.reply(`Superteam Earn comes with Bounties and Projects, which you most prefer?${selectedListingsText}`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    })
  }
}
