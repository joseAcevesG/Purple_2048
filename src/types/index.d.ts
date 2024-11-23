import { Request } from 'express';
export interface User {
	id?: string;
	email: string;
	password: string;
	username: string;
	saveBoards?: SaveBoardsItem[];
	bests?: BestsItem[];
}

export interface UserRds {
	id?: string;
	email: string;
	password: string;
	username: string;
	saveBoards?: SaveBoardsItem[];
}

export interface UserDyn {
	id?: string;
	bests?: BestsItem[];
}

export interface leaderBoardMember {
	id: string;
	score: number;
}

interface SaveBoardsItem {
	name: string;
	board: BoardItem[];
	score: number;
}
interface BoardItem {
	x: number;
	y: number;
	value: number;
}
interface BestsItem {
	board: BoardItem[];
	score: number;
}

export type InputToken = {
	name: string;
	email: string;
};

export interface RequestUser extends Request {
	user?: User;
}
