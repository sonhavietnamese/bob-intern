import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    TELEGRAM_BOT_TOKEN: z.string().min(1),
  },

  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
})
