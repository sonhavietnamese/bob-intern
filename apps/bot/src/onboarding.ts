import { type Context, type SessionFlavor, Composer, session } from 'grammy'
import { SKILL_GROUPS } from './constants'

interface SessionData {
  waitingForName?: boolean
  userName?: string
  selectedSkills?: string[]
  selectedListings?: string[]
}

type MyContext = Context & SessionFlavor<SessionData>

const composer = new Composer<MyContext>()

// Add session middleware
composer.use(
  session({
    initial(): SessionData {
      return {
        selectedSkills: [],
        selectedListings: [],
      }
    },
  }),
)

composer.command('start', async (ctx) => {
  await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/welcome.png', {
    caption: 'Welcome! I am Bob, your personal assistant. How can I call you?',
  })

  // Set session flag to indicate we're waiting for the user's name
  ctx.session.waitingForName = true
})

composer.command('skills', async (ctx) => {
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
    await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/skill.png', {
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
})

composer.command('listing', async (ctx) => {
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
    await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/listing.png', {
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
})

// Handle callback queries for skill selection and deletion
composer.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data

  if (!ctx.session.selectedSkills) {
    ctx.session.selectedSkills = []
  }

  if (!ctx.session.selectedListings) {
    ctx.session.selectedListings = []
  }

  if (data.startsWith('toggle_listing_')) {
    // Toggle listing selection
    const listing = data.replace('toggle_listing_', '')
    const listingName = listing === 'bounties' ? 'Bounties' : 'Projects'

    if (ctx.session.selectedListings.includes(listingName)) {
      // Remove from selected listings
      ctx.session.selectedListings = ctx.session.selectedListings.filter((l) => l !== listingName)
    } else {
      // Add to selected listings
      ctx.session.selectedListings.push(listingName)
    }

    // Update the message
    await updateListingMessage(ctx)
  } else if (data.startsWith('toggle_')) {
    // Toggle skill selection
    const skill = data.replace('toggle_', '')

    if (ctx.session.selectedSkills.includes(skill)) {
      // Remove from selected skills
      ctx.session.selectedSkills = ctx.session.selectedSkills.filter((s) => s !== skill)
    } else {
      // Add to selected skills
      ctx.session.selectedSkills.push(skill)
    }

    // Update the message
    await updateSkillsMessage(ctx)
  } else if (data === 'skills_done') {
    // Handle skills done button
    const selectedSkillsText =
      ctx.session.selectedSkills.length > 0 ? `Great! You've selected these skills: ${ctx.session.selectedSkills.join(', ')}` : 'No skills selected.'

    await ctx.editMessageText(selectedSkillsText, {
      reply_markup: { inline_keyboard: [] },
    })
  } else if (data === 'listing_done') {
    // Handle listing done button
    const selectedListingsText =
      ctx.session.selectedListings.length > 0 ? `Great! You prefer: ${ctx.session.selectedListings.join(', ')}` : 'No preference selected.'

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
  }

  // Answer the callback query to remove loading state
  await ctx.answerCallbackQuery()
})

// Handle text messages for skill selection and name capture
composer.on('message:text', async (ctx) => {
  if (ctx.session.waitingForName) {
    const userName = ctx.message.text

    // Log the user's name
    console.log(`User provided their name: ${userName}`)

    // Store the name in session
    ctx.session.userName = userName
    ctx.session.waitingForName = false

    await ctx.api.setMessageReaction(ctx.message.chat.id, ctx.message.message_id, [{ type: 'emoji', emoji: '🎉' }])
    // Reply to confirm we got their name
    await ctx.reply(`Nice to meet you, ${userName}! I'll remember your name.`, {})
  }
})

// Helper function to update the skills message
async function updateSkillsMessage(ctx: MyContext) {
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
async function updateListingMessage(ctx: MyContext) {
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

export default composer
