import { Composer, session } from 'grammy'

import expertiseCommand from './commands/expertise'
import listingCommand from './commands/listing'
import startCommand from './commands/start'

import { handleCallbackQuery } from './handlers/callbacks'
import { handleTextMessage } from './handlers/messages'

import type { OnboardingContext, OnboardingSessionData } from './types'

export const composer = new Composer<OnboardingContext>()

const sessionMiddleware = session({
  initial(): OnboardingSessionData {
    return {
      selectedSkills: [],
      selectedListings: [],
    }
  },
})

export const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'listing', description: 'Open listings' },
  { command: 'expertise', description: 'Open expertise' },
]

composer.use(sessionMiddleware)

// Register commands
composer.command('start', startCommand)
composer.command('expertise', expertiseCommand)
composer.command('listing', listingCommand)

// Register event handlers
composer.on('callback_query:data', handleCallbackQuery)
composer.on('message:text', handleTextMessage)

export default composer
