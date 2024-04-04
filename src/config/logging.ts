import { type Request, type Response } from 'express'
import morgan from 'morgan'

function jsonFormat (tokens: morgan.TokenIndexer, req: Request, res: Response): string {
  return JSON.stringify({
    time: tokens.date(req, res, 'iso'),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    'content-length': tokens.res(req, res, 'content-length'),
    referrer: tokens.referrer(req, res),
    'user-agent': tokens['user-agent'](req, res)
  })
}

export default function loggingMiddleware (): any {
  return morgan(jsonFormat as morgan.FormatFn)
}
