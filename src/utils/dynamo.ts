import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.aws_access_key_id,
		secretAccessKey: process.env.aws_secret_access_key,
		sessionToken: process.env.aws_session_token,
	},
});

export default DynamoDBDocumentClient.from(dbClient);
