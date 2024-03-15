import { type Express, type Request, type Response, type NextFunction, type Router } from 'express'

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const indexRouter: Router = require('./routes/index')
const usersRouter: Router = require('./routes/users')
const expressNunjucks = require('express-nunjucks').default

const app: Express = express()
const isDev = app.get('env') === 'development'

const dirname = path.join(__dirname, '../views')

app.set('views', dirname)

expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

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

app.listen(5001)
