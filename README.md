# trade-tariff-fpo-developer-hub

Express app giving FPO operators the ability to manage their own API credentials.

## Local development

### Prerequisites

- [docker-compose]
- [docker app][docker-app]
- [nodejs]
- [aws cli (optional)][awscli]
- [aws local cli (optional)][awscli-local]

### Running localstack

To reduce feedback loops and improve developer efficiency, we simulate aws services with [localstack]. You can bring up localstack using docker-compose with a simple `Makefile` wrapper

```sh
make localstack
```

### Starting the application

> Make sure you have started localstack before running the application.

```sh
make run
```

### Running tests

```sh
make test
```

## Authentication

When this backend app is deployed to ECS we enable client credentials authentication using Cognito User Pools

```mermaid
sequenceDiagram
participant Client Application
participant Cognito Authorization Server
participant Protected Resource / API

Client Application->>Cognito Authorization Server: Request Access Token (Client ID, Client Secret)
Cognito Authorization Server->>Cognito Authorization Server: Validate Credentials
Cognito Authorization Server->>Client Application: Access Token
Client Application->>Protected Resource / API: API Request (Access Token)
Protected Resource / API->>Protected Resource / API: Validate Token
Protected Resource / API->>Client Application: API Response
```

Access tokens need to be refreshed by the client and the backend decodes/verifies the JWT in the Authorisation header.

## Point in time recovery

When restoring from a PITR snapshot a new table will be generated with the data in it. Change the value of the env var in
main.tf to update this to the new table name for all environments (e.g. development, staging and production) as this application is released.

See [pitr-manual] for how-to instructions on restoring from a Point in Time Recovery snapshot.

## API Documentation

Once the application is running, open a web browser and navigate to the Swagger UI URL: <http://localhost:5001/api-docs>

This has been disabled to only run in development mode as the endpoints are designed to be be internal.

[pitr-manual]: https://docs.trade-tariff.service.gov.uk/manual/how-to-backup-and-restore-in-aws-dynamodb-pitr.html

[docker-compose]: https://formulae.brew.sh/formula/docker-compose
[nodejs]: https://formulae.brew.sh/formula/node
[docker-app]: https://docs.docker.com/desktop/install/mac-install/
[awscli]: https://formulae.brew.sh/formula/awscli
[awscli-local]: https://formulae.brew.sh/formula/awscli-local
[localstack]: https://www.localstack.cloud/
