import { Composer, session } from 'grammy'

import expertiseCommand from './commands/expertise'
import listingCommand from './commands/listing'
import startCommand from './commands/start'
import skillsCommand from './commands/skills'
import rangeCommand from './commands/range'

import { handleCallbackQuery } from './handlers/callbacks'
import { handleTextMessage } from './handlers/messages'

import type { OnboardingContext, OnboardingSessionData } from './types'

export const composer = new Composer<OnboardingContext>()

const sessionMiddleware = session({
  initial(): OnboardingSessionData {
    return {
      selectedExpertise: [],
      selectedSkills: [],
      selectedListings: [],
    }
  },
})

export const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'listing', description: 'Open listings' },
  { command: 'expertise', description: 'Open expertise' },
  { command: 'skills', description: 'Open skills' },
  { command: 'range', description: 'Open range' },
]

composer.use(sessionMiddleware)

// Register commands
composer.command('start', startCommand)
composer.command('expertise', expertiseCommand)
composer.command('listing', listingCommand)
composer.command('skills', skillsCommand)
composer.command('range', rangeCommand)

// Register event handlers
composer.on('callback_query:data', handleCallbackQuery)
composer.on('message:text', handleTextMessage)

export default composer
