const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

export default function initEnvironment (): void {
  let envFilePath = path.join(process.cwd(), '.env')

  switch (process.env.NODE_ENV) {
    case 'test':
      envFilePath = path.join(process.cwd(), '.env.test')
      break
    case 'development':
      envFilePath = path.join(process.cwd(), '.env.development')
      break
  }

  if (fs.existsSync(envFilePath) === true) {
    dotenv.config({ path: envFilePath })
  } else {
    console.warn(`Environment file not found: ${envFilePath}`)
  }
}
