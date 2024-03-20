import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-2',
});

export default dynamoDb;
