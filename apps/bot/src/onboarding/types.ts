import { type Context, type SessionFlavor } from 'grammy'

export interface OnboardingSessionData {
  waitingForName?: boolean
  userName?: string
  selectedExpertise?: string[]
  selectedSkills?: string[]
  selectedListings?: string[]
  selectedRange?: {
    min: number
    max: number
  }
}

export type OnboardingContext = Context & SessionFlavor<OnboardingSessionData>
