import {
	DeleteCommand,
	DeleteCommandOutput,
	GetCommand,
	GetCommandOutput,
	PutCommand,
	PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { UserDyn } from '../types';
import docClient from '../utils/dynamo';

class UserDynModel {
	saveUser(user: UserDyn): Promise<PutCommandOutput> {
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

	getLeaders(): Promise<GetCommandOutput> {
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Key: { id: 'leaderBoard' },
		};

		return docClient.send(new GetCommand(params));
	}

	saveLeaders(leaders: string[]): Promise<PutCommandOutput> {
		const params = {
			TableName: process.env.DYNAMODB_TABLE_NAME,
			Item: { id: 'leaderBoard', leaders },
		};

		return docClient.send(new PutCommand(params));
	}
}

export default new UserDynModel();
