import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { User } from '../types';
import docClient from '../utils/dynamo';

class UserDynModel {
	saveUser(user: User): Promise<PutCommandOutput> {
		const params = { TableName: process.env.DYNAMODB_TABLE_NAME, Item: user };

		return docClient.send(new PutCommand(params));
	}

    getUser(email: string): Promise<User> {
        const params = { TableName: process.env.DYNAMODB_TABLE_NAME, Key: { email } };

        return docClient.send(new GetCommand(params));
    }
}

export default new UserDynModel();
