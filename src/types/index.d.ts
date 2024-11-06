export interface User {
	email: string;
	password: string;
	username: string;
	saveBoards: SaveBoardsItem[];
	bests: BestsItem[];
	leader: number;
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
