import * as AWS from 'aws-sdk';

class ApiKeyService {
    private apiGateway: AWS.APIGateway;

    constructor() {
        this.apiGateway = new AWS.APIGateway({
            region: process.env.AWS_REGION || 'eu-west-2'
        });
    }

    public async createApiKeyAndSave(customerID: string, name: string, description?: string): Promise<AWS.APIGateway.ApiKey> {
        const params: AWS.APIGateway.CreateApiKeyRequest = {
            name,
            description,
            enabled: true
        };

        try {
            const apiKey = await this.apiGateway.createApiKey(params).promise();
            console.log('API Key created:', apiKey);
            return apiKey;
        } catch (error) {
            console.error('Error creating API key:', error);
            throw error;
        }
    }
}

export const apiKeyService = new ApiKeyService();
