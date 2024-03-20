import { type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'

const revision = fs.readFileSync(path.join(__dirname, '..', '..', 'REVISION'), 'utf-8').trim()

class CustomerApiKeysController {
  public show (_req: Request, res: Response): void {
    res.json({ test: 'test' })
  }
}

export default new CustomerApiKeysController()
