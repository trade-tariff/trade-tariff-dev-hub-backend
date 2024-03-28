import express, { type Router } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { ApiKeyController } from '../controllers/apiKeysController'

import { CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'

const dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION })
const apiGatewayClient = new APIGatewayClient({ region: process.env.AWS_REGION })
const repository = new CustomerApiKeyRepository(dynamodbClient, apiGatewayClient)

const apiKeyController = new ApiKeyController(repository)
const healthchecksController = new HealthchecksController()

const router: Router = express.Router()

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })

// ESlint does not understand async express route handlers
router.post('/keys/:fpoId', (req, res) => { apiKeyController.create(req, res) }) // eslint-disable-line @typescript-eslint/no-floating-promises
router.get('/keys/:fpoId', (req, res) => { apiKeyController.index(req, res) }) // eslint-disable-line @typescript-eslint/no-floating-promises
router.get('/keys/:fpoId/:customerApiKeyId', (req, res) => { apiKeyController.show(req, res) }) // eslint-disable-line @typescript-eslint/no-floating-promises
router.patch('/keys/:fpoId/:customerApiKeyId', (req, res) => { apiKeyController.update(req, res) }) // eslint-disable-line @typescript-eslint/no-floating-promises

export default router
