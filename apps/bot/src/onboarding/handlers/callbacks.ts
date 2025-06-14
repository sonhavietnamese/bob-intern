import { USD_RANGES } from '@/constants'
import type { OnboardingContext } from '../types'
import { updateExpertiseMessage, updateListingMessage, showUSDRangeSelection } from '../utils/helpers'

export async function handleCallbackQuery(ctx: OnboardingContext) {
  if (!ctx.callbackQuery?.data) {
    return
  }

  const data = ctx.callbackQuery.data

  if (!ctx.session.selectedExpertise) {
    ctx.session.selectedExpertise = []
  }

  if (!ctx.session.selectedSkills) {
    ctx.session.selectedSkills = []
  }

  if (!ctx.session.selectedListings) {
    ctx.session.selectedListings = []
  }

  if (data.startsWith('toggle_listing_')) {
    await handleListingToggle(ctx, data)
  } else if (data.startsWith('toggle_')) {
    await handleExpertiseToggle(ctx, data)
  } else if (data === 'expertise_done') {
    await handleExpertiseDone(ctx)
  } else if (data === 'listing_done') {
    await handleListingDone(ctx)
  } else if (data.startsWith('select_range_')) {
    await handleRangeSelection(ctx, data)
  }

  // Answer the callback query to remove loading state
  await ctx.answerCallbackQuery()
}

async function handleListingToggle(ctx: OnboardingContext, data: string) {
  const listing = data.replace('toggle_listing_', '')
  const listingName = listing === 'bounties' ? 'Bounties' : 'Projects'

  if (ctx.session.selectedListings!.includes(listingName)) {
    // Remove from selected listings
    ctx.session.selectedListings = ctx.session.selectedListings!.filter((l) => l !== listingName)
  } else {
    // Add to selected listings
    ctx.session.selectedListings!.push(listingName)
  }

  // Update the message
  await updateListingMessage(ctx)
}

async function handleExpertiseToggle(ctx: OnboardingContext, data: string) {
  const expertise = data.replace('toggle_', '')

  if (ctx.session.selectedExpertise!.includes(expertise)) {
    // Remove from selected expertise
    ctx.session.selectedExpertise = ctx.session.selectedExpertise!.filter((e) => e !== expertise)
  } else {
    // Add to selected expertise
    ctx.session.selectedExpertise!.push(expertise)
  }

  // Update the message
  await updateExpertiseMessage(ctx)
}

async function handleExpertiseDone(ctx: OnboardingContext) {
  const selectedExpertiseText =
    ctx.session.selectedExpertise!.length > 0
      ? `Great! You've selected these expertise: ${ctx.session.selectedExpertise!.join(', ')}
      you can tell me more about your specific skills later using /skills command`
      : 'No expertise selected.'

  try {
    await ctx.editMessageCaption({
      caption: selectedExpertiseText,
      reply_markup: { inline_keyboard: [] },
    })
  } catch (error) {
    // Fallback to editing text if caption fails
    await ctx.editMessageText(selectedExpertiseText, {
      reply_markup: { inline_keyboard: [] },
    })
  }
}

async function handleListingDone(ctx: OnboardingContext) {
  const selectedListingsText =
    ctx.session.selectedListings!.length > 0 ? `Great! You prefer: ${ctx.session.selectedListings!.join(', ')}` : 'No preference selected.'

  try {
    await ctx.editMessageCaption({
      caption: selectedListingsText,
      reply_markup: { inline_keyboard: [] },
    })
  } catch (error) {
    // Fallback to editing text if caption fails
    await ctx.editMessageText(selectedListingsText, {
      reply_markup: { inline_keyboard: [] },
    })
  }

  // Show USD range selection
  await showUSDRangeSelection(ctx)
}

async function handleRangeSelection(ctx: OnboardingContext, data: string) {
  const rangeIndex = parseInt(data.replace('select_range_', ''))
  const selectedRange = USD_RANGES[rangeIndex]

  if (selectedRange) {
    ctx.session.selectedRange = selectedRange.value

    // Send final message with min and max values
    await ctx.editMessageText(
      `Perfect! You've selected "${selectedRange.label}" with a range of $${selectedRange.value.min} - $${selectedRange.value.max}`,
      {
        reply_markup: { inline_keyboard: [] },
      },
    )
  }
}
