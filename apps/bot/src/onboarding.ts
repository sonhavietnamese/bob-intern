import { Composer } from 'grammy'
import type { Context, SessionFlavor } from 'grammy'
import { session } from 'grammy'

interface SessionData {
  waitingForName?: boolean
  userName?: string
}

type MyContext = Context & SessionFlavor<SessionData>

const composer = new Composer<MyContext>()

// Add session middleware
composer.use(
  session({
    initial(): SessionData {
      return {}
    },
  }),
)

composer.command('start', async (ctx) => {
  await ctx.replyWithPhoto('https://localhost:3001/draft/welcomming.png', {
    caption: 'Welcome! I am Bob, your personal assistant. How can I call you?',
  })

  // Set session flag to indicate we're waiting for the user's name
  ctx.session.waitingForName = true
})

// Handle text messages to capture the user's name
composer.on('message:text', async (ctx) => {
  if (ctx.session.waitingForName) {
    const userName = ctx.message.text

    // Log the user's name
    console.log(`User provided their name: ${userName}`)

    // Store the name in session
    ctx.session.userName = userName
    ctx.session.waitingForName = false

    // Reply to confirm we got their name
    await ctx.reply(`Nice to meet you, ${userName}! I'll remember your name.`)
  }
})

export default composer
