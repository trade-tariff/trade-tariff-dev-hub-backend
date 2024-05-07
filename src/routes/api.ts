import express, { type Router } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { ApiKeyController } from '../controllers/apiKeysController'
import { UserController } from '../controllers/usersController'

import { CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
import { UserRepository } from '../repositories/userRepository'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { APIGatewayClient } from '@aws-sdk/client-api-gateway'

const endpoint = process.env.AWS_ENDPOINT

const dynamodbClient = new DynamoDBClient(
  {
    region: process.env.AWS_REGION,
    endpoint
  }
)
const apiGatewayClient = new APIGatewayClient(
  {
    region: process.env.AWS_REGION,
    endpoint
  }
)
const repository = new CustomerApiKeyRepository(dynamodbClient, apiGatewayClient)
const userRepository = new UserRepository(dynamodbClient)

const apiKeyController = new ApiKeyController(repository)
const userController = new UserController(userRepository)
const healthchecksController = new HealthchecksController()

const router: Router = express.Router()

// ESlint does not understand async express route handlers
/* eslint-disable  @typescript-eslint/no-floating-promises */

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })

router.post('/keys/:fpoId', (req, res) => { apiKeyController.create(req, res) })
router.get('/keys/:fpoId', (req, res) => { apiKeyController.index(req, res) })
router.get('/keys/:fpoId/:id', (req, res) => { apiKeyController.show(req, res) })
router.patch('/keys/:fpoId/:id', (req, res) => { apiKeyController.update(req, res) })
router.delete('/keys/:fpoId/:id', (req, res) => { apiKeyController.destroy(req, res) })

router.post('/users/:id', (req, res) => { userController.create(req, res) })
router.get('/users/:id', (req, res) => { userController.show(req, res) })
router.patch('/users/:id', (req, res) => { userController.update(req, res) })

/* eslint-enable @typescript-eslint/no-floating-promises */

export default router
