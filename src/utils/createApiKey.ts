import * as AWS from 'aws-sdk';

const apiGateway = new AWS.APIGateway({
    region: 'eu-west-2'
});

async function createApiKey(customerID: string, name: string, description?: string): Promise<AWS.APIGateway.ApiKey> {
    const params: AWS.APIGateway.CreateApiKeyRequest = {
        // customerID:
        name,
        description,
        enabled: true
    };

    try {
        const apiKey = await apiGateway.createApiKey(params).promise();
        console.log('API Key created:', apiKey);
        return apiKey;
    } catch (error) {
        console.error('Error creating API key:', error);
        throw error;
    }
}
