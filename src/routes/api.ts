import express, { type Router } from 'express'
import { HealthchecksController } from '../controllers/healthchecksController'
import { ApiKeyController } from '../controllers/apiKeysController'
import { UserController } from '../controllers/usersController'

import { CustomerApiKeyRepository } from '../repositories/customerApiKeyRepository'
import { UserRepository } from '../repositories/userRepository'
import { OrganisationRepository } from '../repositories/organisationRepository'
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
const organisationRepository = new OrganisationRepository(dynamodbClient)

const apiKeyController = new ApiKeyController(repository)
const userController = new UserController(userRepository, organisationRepository)
const healthchecksController = new HealthchecksController()

const router: Router = express.Router()

// ESlint does not understand async express route handlers
/* eslint-disable  @typescript-eslint/no-floating-promises */

router.get('/healthcheck', (req, res) => { healthchecksController.show(req, res) })
router.get('/healthcheckz', (req, res) => { healthchecksController.showz(req, res) })

router.post('/keys/:organisationId', (req, res, next) => { apiKeyController.create(req, res, next) })
router.get('/keys/:organisationId', (req, res, next) => { apiKeyController.index(req, res, next) })
router.get('/keys/:organisationId/:id', (req, res, next) => { apiKeyController.show(req, res, next) })
router.patch('/keys/:organisationId/:id', (req, res, next) => { apiKeyController.update(req, res, next) })
router.delete('/keys/:organisationId/:id', (req, res, next) => { apiKeyController.destroy(req, res, next) })

router.post('/users/:id', (req, res, next) => { userController.create(req, res, next) })
router.get('/users/:id', (req, res, next) => { userController.show(req, res, next) })

router.patch('/organisations/:organisationId', (req, res, next) => { userController.updateOrganisation(req, res, next) })

/* eslint-enable @typescript-eslint/no-floating-promises */

export default router
