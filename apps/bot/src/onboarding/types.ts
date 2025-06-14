import { type Context, type SessionFlavor } from 'grammy'

export interface OnboardingSessionData {
  waitingForName?: boolean
  userName?: string
  selectedSkills?: string[]
  selectedListings?: string[]
  selectedRange?: string
}

export type OnboardingContext = Context & SessionFlavor<OnboardingSessionData>
