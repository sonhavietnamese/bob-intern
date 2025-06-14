import 'dotenv/config'
import type { Context, SessionFlavor } from 'grammy'
import { Bot } from 'grammy'
import onboarding from './onboarding'

interface SessionData {
  waitingForName?: boolean
  userName?: string
}

type MyContext = Context & SessionFlavor<SessionData>

// // Handle inline button callbacks
// const handleButtonClicked = async (ctx: CallbackQueryContext<MyContext>) => {
//   // Acknowledge the callback so Telegram removes the "loading" state
//   await ctx.answerCallbackQuery({})

//   // Respond back in the chat
//   await ctx.reply('🎉 Button was clicked!')
//   // remove the button
//   if (ctx.msg) {
//     await ctx.api.deleteMessage(ctx.msg.chat.id, ctx.msg.message_id)
//   }
// }

// // Register the callback handler

// bot.catch((err) => {
//   const ctx = err.ctx
//   console.error(`Error while handling update ${ctx.update.update_id}:`)
//   const e = err.error
//   if (e instanceof GrammyError) {
//     console.error('Error in request:', e.description)
//   } else if (e instanceof HttpError) {
//     console.error('Could not contact Telegram:', e)
//   } else {
//     console.error('Unknown error:', e)
//   }
// })

// bot.on('message_reaction', async (ctx) => {
//   const { emojiAdded } = ctx.reactions()
//   if (emojiAdded.includes('🎉')) {
//     await ctx.reply('partY')
//   }
// })

// bot.start()

export const {
  TELEGRAM_BOT_TOKEN: token,
  TELEGRAM_SECRET_TOKEN: secretToken = String(token || '')
    .split(':')
    .pop(),
} = process.env

// Validate that bot token exists
if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set')
  console.log('Available environment variables:', Object.keys(process.env).length)
  process.exit(1)
}

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

console.log('✅ Environment variables loaded successfully')
console.log(`🔧 Running in ${isDevelopment ? 'DEVELOPMENT' : isProduction ? 'PRODUCTION' : 'UNKNOWN'} mode`)

// Default grammY bot instance
export const bot = new Bot<MyContext>(token)

bot.api.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'help', description: 'Show help text' },
  { command: 'settings', description: 'Open settings' },
  { command: 'onboarding', description: 'Onboarding' },
])

bot.use(onboarding)

// Start the bot
console.log('🚀 Starting bot...')
bot.start()
