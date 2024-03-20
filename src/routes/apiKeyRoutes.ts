import express from 'express';
import { apiKeyController } from '../controllers/apiKeyController';

const router = express.Router();

router.post('/createapikey', apiKeyController.createApiKey);


export { router as apiKeyRoutes };
