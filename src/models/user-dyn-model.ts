import {
	DeleteCommand,
	DeleteCommandOutput,
	GetCommand,
	GetCommandOutput,
	PutCommand,
	PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { User } from '../types';
import docClient from '../utils/dynamo';

class UserDynModel {
	saveUser(user: User): Promise<PutCommandOutput> {
		const params = { TableName: process.env.DYNAMODB_TABLE_NAME, Item: user };

		return docClient.send(new PutCommand(params));
	}

	getUser(id: string): Promise<GetCommandOutput> {
		const params = { TableName: process.env.DYNAMODB_TABLE_NAME, Key: { id } };

		return docClient.send(new GetCommand(params));
	}

	deleteUser(id: string): Promise<DeleteCommandOutput> {
		const params = { TableName: process.env.DYNAMODB_TABLE_NAME, Key: { id } };

		return docClient.send(new DeleteCommand(params));
	}
}

export default new UserDynModel();
