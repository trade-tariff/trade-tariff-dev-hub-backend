import express, { type Request, type Response, type NextFunction } from 'express'

const router = express.Router()

/* GET home page. */
router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.render('index', { title: 'FPO Developer Hub' })
})

module.exports = router
