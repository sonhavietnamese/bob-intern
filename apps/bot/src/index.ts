import 'dotenv/config'

import type { Context, SessionFlavor } from 'grammy'
import { Bot } from 'grammy'

import { composer as onboardingComposer, commands as onboardingCommands } from './onboarding/composer'
import type { OnboardingSessionData } from './onboarding/types'

type MyContext = Context & SessionFlavor<OnboardingSessionData>

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

export const bot = new Bot<MyContext>(token)

bot.api.setMyCommands([...onboardingCommands, { command: 'help', description: 'Show help text' }])

bot.use(onboardingComposer)

console.log('🚀 Starting bot...')
bot.start()
