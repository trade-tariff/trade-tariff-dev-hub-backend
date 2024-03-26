import express, { type Router } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { ApiKeyController } from '../controllers/apiKeysController'

const apiKeyController = new ApiKeyController()
const healthchecksController = new HealthchecksController()

const router: Router = express.Router()

router.get('/healthcheck', healthchecksController.show)
router.get('/healthcheckz', healthchecksController.showz)
router.post('/keys/:fpoId', apiKeyController.create)
router.get('/keys/:fpoId', apiKeyController.index)
router.get('/keys/:fpoId/:id', apiKeyController.show)

export default router
