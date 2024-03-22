import { type Express, type Request, type Response, type NextFunction } from 'express'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import indexRouter from './routes/index'
import apiRouter from './routes/api'
import initEnvironment from './config/env'
import { CustomerApiKeyRepository } from './repositories/customerApiKeyRepository'
initEnvironment()

const _client = new DynamoDBClient({ region: process.env.AWS_REGION })
// TODO: Pass this around to the relevant controllers
const _repository = new CustomerApiKeyRepository(_client)

const app: Express = express()
const isDev = app.get('env') === 'development'

if (isDev) {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(process.env.PORT)
