import express, { Router } from 'express';
import HealthchecksController from '../controllers/healthchecks_controller';
import CustomerApiKeys from '../controllers/customer_api_keys_controller';

const router: Router = express.Router();

router.get('/healthcheck', HealthchecksController.show);
router.get('/healthcheckz', HealthchecksController.showz);
router.get('/customer_api_keys', CustomerApiKeys.show);

module.exports = router
