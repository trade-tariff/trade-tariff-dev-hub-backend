import express, { type Request, type Response, type NextFunction } from 'express'

const router = express.Router()

/* GET users listing. */
router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.send('respond with a resource')
})

module.exports = router
