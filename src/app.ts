import express, { type Express, type Request, type Response, type NextFunction } from 'express'
import createError, { type HttpError } from 'http-errors'
import * as Sentry from '@sentry/node'
import path from 'path'
import morgan from 'morgan'

import indexRouter from './routes/index'
import apiRouter from './routes/api'
import initEnvironment from './config/env'
import loggingMiddleware from './config/logging'

initEnvironment()

const app: Express = express()
const isDev = app.get('env') === 'development'
const sentryDsn = process.env.SENTRY_DSN ?? ''
const sentryEnv = process.env.SENTRY_ENVIRONMENT ?? ''

async function loadDev (): Promise<void> {
  if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerJsdoc = require('swagger-jsdoc')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require('swagger-ui-express')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const apiDocs = require('./docs/apiDocs').default

    app.use(morgan('dev'))

    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'trade-tariff-dev-hub-backend',
          version: '1.0.0',
          description: 'An API app for managing FPO user keys'
        },
        paths: {
          ...apiDocs
        }
      },
      apis: []
    }
    const swaggerSpec = swaggerJsdoc(swaggerOptions)

    app.use(
      '/api-docs',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      swaggerUi.serve,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      swaggerUi.setup(swaggerSpec)
    )
  } else {
    app.use(loggingMiddleware())
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await loadDev()
})()

if (sentryDsn !== '') {
  Sentry.init({ dsn: sentryDsn, environment: sentryEnv })
  app.use(Sentry.Handlers.requestHandler())
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/api', apiRouter)
app.get('/debug-sentry', function mainHandler (_req, _res) {
  throw new Error('My first Sentry error!')
})

if (sentryDsn !== '') {
  app.use(Sentry.Handlers.errorHandler())
}

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = isDev ? err : {}

  const statusCode = err.statusCode ?? 500

  if (isDev) {
    console.error(err)
    // In development, you can send the full error
    res.status(statusCode).contentType('application/json').json(
      {
        error: err,
        stack: err.stack
      }
    )
  } else {
    err.message = err.message ?? 'Internal Server Error'
    // In production, send a generic message
    Sentry.captureException(err)
    res.status(statusCode).json({ error: 'Internal Server Error' })
  }
})

app.listen(process.env.PORT)
