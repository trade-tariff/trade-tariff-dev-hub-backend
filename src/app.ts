import express, { type Express, type Request, type Response, type NextFunction } from 'express'

import createError from 'http-errors'
import path from 'path'

import indexRouter from './routes/index'
import apiRouter from './routes/api'
import initEnvironment from './config/env'

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { apiDocs } from './swaggerDocs/apiDocs';

initEnvironment()

const app: Express = express()
const isDev = app.get('env') === 'development'

if (isDev) {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

const shouldServeSwaggerDocs = (): boolean => {
  return 'development' === app.get('env');
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'trade-tariff-dev-hub-backend',
      version: '1.0.0',
      description: 'An API app for managing FPO user keys',
    },
    paths: {
      ...apiDocs,
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
  next(createError(404))
})

// Error handler
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)

  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  })
})

app.listen(process.env.PORT)
