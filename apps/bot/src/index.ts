// import 'dotenv/config'
// import type { CallbackQueryContext, Context, SessionFlavor } from 'grammy'
// import { Bot, GrammyError, HttpError } from 'grammy'
// import onboarding from './onboarding'

// interface SessionData {
//   waitingForName?: boolean
//   userName?: string
// }

// type MyContext = Context & SessionFlavor<SessionData>

// const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_TOKEN || '')

// bot.api.setMyCommands([
//   { command: 'start', description: 'Start the bot' },
//   { command: 'help', description: 'Show help text' },
//   { command: 'settings', description: 'Open settings' },
//   { command: 'onboarding', description: 'Onboarding' },
// ])

// // bot.use(onboarding)

// bot.command('hey', (ctx) => ctx.reply('hey bob'))

// bot.command('test', async (ctx) => {
//   // test image
//   await ctx.replyWithPhoto('https://picsum.photos/500/200', {
//     caption: 'Welcome! Here is a random image for you.',
//     reply_markup: {
//       inline_keyboard: [[{ text: 'Click me!', callback_data: 'button_clicked' }]],
//     },
//   })
// })

// bot.command('button', (ctx) => {
//   ctx.reply('<b>Hi!</b> <i style="color: red;">Welcome</i> to <a href="https://grammy.dev">grammY</a>.', {
//     parse_mode: 'HTML',
//     reply_markup: {
//       resize_keyboard: true,
//       keyboard: [[{ text: 'Click me!' }, { text: 'Click me!' }]],
//     },
//   })
// })

// bot.hears(/echo *(.+)?/, async (ctx) => {
//   ctx.reply('wau')
// })

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
// bot.callbackQuery('button_clicked', handleButtonClicked)

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

// bot.on('message', async (ctx) => {
//   // Get the chat identifier.
//   const chatId = ctx.msg.chat.id
//   // The text to reply with
//   const text = 'I got your message!'
//   // Send the reply.
//   // await bot.api.sendMessage(chatId, text)
//   await ctx.reply('^ This is a message!', {
//     reply_parameters: { message_id: ctx.msg.message_id },
//     reply_markup: {
//       inline_keyboard: [[{ text: 'Click me!', callback_data: 'button_clicked' }]],
//     },
//   })

//   await ctx.api.setMessageReaction(chatId, ctx.msg.message_id, [{ type: 'emoji', emoji: '🎉' }])
// })

// bot.on('edited_message', async (ctx) => {
//   // Get the new, edited, text of the message.
//   const editedText = ctx.editedMessage.text

//   if (editedText) {
//     await ctx.reply(editedText)
//   }
// })

// bot.on('message_reaction', async (ctx) => {
//   const { emojiAdded } = ctx.reactions()
//   if (emojiAdded.includes('🎉')) {
//     await ctx.reply('partY')
//   }
// })

// bot.start()
import { Bot } from 'grammy'

export const {
  // Telegram bot token from t.me/BotFather
  TELEGRAM_BOT_TOKEN: token,

  // Secret token to validate incoming updates
  TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(':').pop(),
} = process.env

// Default grammY bot instance
export const bot = new Bot(token || '')

// Sample handler for a simple echo bot
bot.on('message:text', (ctx) => ctx.reply(ctx.msg.text))
