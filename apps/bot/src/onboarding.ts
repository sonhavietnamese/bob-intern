import { type Context, type SessionFlavor, Composer, session } from 'grammy'
import { SKILL_GROUPS } from './constants'

interface SessionData {
  waitingForName?: boolean
  userName?: string
  selectedSkills?: string[]
}

type MyContext = Context & SessionFlavor<SessionData>

const composer = new Composer<MyContext>()

// Add session middleware
composer.use(
  session({
    initial(): SessionData {
      return {
        selectedSkills: [],
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

  await ctx.replyWithPhoto('https://bob-intern-cdn.vercel.app/draft/skill.png', {
    caption: `What skills do you have?${selectedSkillsText}`,
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  })
})

// Handle callback queries for skill selection and deletion
composer.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data

  if (!ctx.session.selectedSkills) {
    ctx.session.selectedSkills = []
  }

  if (data.startsWith('toggle_')) {
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
    // Handle done button
    const selectedSkillsText =
      ctx.session.selectedSkills.length > 0 ? `Great! You've selected these skills: ${ctx.session.selectedSkills.join(', ')}` : 'No skills selected.'

    await ctx.editMessageText(selectedSkillsText, {
      reply_markup: { inline_keyboard: [] },
    })
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

  await ctx.editMessageCaption({
    caption: `What skills do you have?${selectedSkillsText}`,
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  })
}

export default composer
