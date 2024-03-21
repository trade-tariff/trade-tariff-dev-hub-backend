import express, { type Router } from 'express'
import HealthchecksController from '../controllers/healthchecks_controller'

const router: Router = express.Router()

router.get('/healthcheck', HealthchecksController.show)
router.get('/healthcheckz', HealthchecksController.showz)

module.exports = router
