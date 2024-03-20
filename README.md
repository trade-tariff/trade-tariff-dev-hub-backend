# trade-tariff-fpo-developer-hub

Express app giving FPO operators the ability to manage their own API credentials.

# Starting the app
```
npm run build && npm start
```


# Project structure idea?

trade-tariff-dev-hub-backend/
├── public/
├── src/
│ ├── api/
│ │   ├── controllers/
│ │   │   ├── apiKeyController.ts
│ │   ├── routes/
│ │   │   ├── apiKeyRoutes.ts
│ ├── config/
│ │   ├── awsConfig.ts
│ ├── services/
│ │   ├── apiKeyService.ts
│ ├── repositories/
│ │   ├── apiKeyRepository.ts
│ ├── models/
│ │   ├── apiKey.ts
│ ├── utils/
│ │   ├── dynamoDbClient.ts
│ │   ├── apiGatewayClient.ts
│ ├── types/
│ │   ├── index.d.ts
│ ├── app.ts
│ └── index.ts
├── tests/
│   ├── integration/
│   └── unit/
├── .env
├── package.json
├── tsconfig.json
└── README.md

  - api/controllers/apiKeyController.ts: Handles incoming HTTP requests, parses request data, and calls the appropriate service methods. It sends back the HTTP responses to the client.

  - api/routes/apiKeyRoutes.ts: Defines routes for your API and associates them with the controller methods.

  - services/apiKeyService.ts: Contains the business logic for managing API keys. It interacts with AWS API Gateway to create or delete keys and calls the repository for database operations.

  - repositories/apiKeyRepository.ts: Encapsulates the logic for database interactions, specifically with DynamoDB in this case. It’s responsible for storing, retrieving, and deleting API key details in DynamoDB.

  - models/apiKey.ts: Defines the TypeScript interface or class for an API key, ensuring type safety and clarity across the application.

  - utils/dynamoDbClient.ts and utils/apiGatewayClient.ts: Initialize and export configured instances of DynamoDB and AWS API Gateway clients, respectively. These can be used throughout the application to interact with AWS services.

  - config/awsConfig.ts: Centralizes configuration for AWS services, such as region and credentials.

  - types/index.d.ts: Contains custom TypeScript type definitions and interfaces used across the application.

  - app.ts: Sets up the application, registers routes, and includes any middleware.

  - index.ts: The entry point of the application, responsible for starting the server.
