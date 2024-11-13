// cSpell:ignore vmin
import Tile from './Tile.js';

const GRID_SIZE = 4;
const CELL_SIZE = 14.5;
const CELL_GAP = 2;

export default class Grid {
	#cells;

	constructor(gridElement, data = undefined) {
		gridElement.style.setProperty('--grid-size', GRID_SIZE);
		gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
		gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
		this.#cells = createCellElements(gridElement).map((cellArr, indexX) => {
			return cellArr.map((cell, indexY) => {
				return new Cell(cell, indexX, indexY);
			});
		});
		if (data !== undefined) {
			for (const item of data) {
				this.#cells[item.x][item.y].tile = new Tile(
					gridElement,
					item.value,
					item.x,
					item.y,
				);
			}
		}
	}

	get grid() {
		const tiles = [];
		for (const row of this.#cells) {
			for (const cell of row) {
				if (cell.tile !== undefined) {
					tiles.push({
						x: cell.x,
						y: cell.y,
						value: cell.tile.value,
					});
				}
			}
		}
		return tiles;
	}

	get cells() {
		return this.#cells;
	}

	get cellsByColumn() {
		return this.#cells;
	}

	get cellsByRow() {
		const tmpCells = new Array(GRID_SIZE);
		for (let i = 0; i < GRID_SIZE; i++) {
			tmpCells[i] = new Array(GRID_SIZE);
		}
		for (let i = 0; i < GRID_SIZE; i++) {
			for (let j = 0; j < GRID_SIZE; j++) {
				tmpCells[j][i] = this.#cells[i][j];
			}
		}
		return tmpCells;
	}

	get #emptyCells() {
		let tmpCells = new Array(GRID_SIZE);
		for (let i = 0; i < GRID_SIZE; i++) {
			tmpCells[i] = this.#cells[i].filter((cell) => cell.tile == null);
		}
		tmpCells = tmpCells.filter((arrCell) => arrCell.length !== 0);
		return tmpCells;
	}

	randomEmptyCell() {
		const indexX = Math.floor(Math.random() * this.#emptyCells.length);
		const indexY = Math.floor(Math.random() * this.#emptyCells[indexX].length);
		return this.#emptyCells[indexX][indexY];
	}
}

class Cell {
	#cellElement;
	#x;
	#y;
	#tile;
	#mergeTile;

	constructor(cellElement, x, y) {
		this.#cellElement = cellElement;
		this.#x = x;
		this.#y = y;
	}

	get x() {
		return this.#x;
	}

	get y() {
		return this.#y;
	}

	get tile() {
		return this.#tile;
	}

	get mergeTile() {
		return this.#mergeTile;
	}

	set tile(value) {
		this.#tile = value;
		if (value == null) return;
		this.#tile.x = this.#x;
		this.#tile.y = this.#y;
	}

	set mergeTile(value) {
		this.#mergeTile = value;
		if (value == null) return;
		this.#mergeTile.x = this.#x;
		this.#mergeTile.y = this.#y;
	}

	canAccept(tile) {
		return (
			this.tile == null ||
			(this.mergeTile == null && this.tile.value === tile.value)
		);
	}

	mergeTiles(score) {
		if (this.tile == null || this.mergeTile == null) return score;
		this.tile.value = this.tile.value + this.mergeTile.value;
		const newScore = Number.parseInt(score) + Number.parseInt(this.#tile.value);
		document.getElementById('score').innerHTML = `Score: ${newScore}`;

		this.mergeTile.remove();
		this.mergeTile = null;
		return score;
	}
}

function createCellElements(gridElement) {
	const cells = new Array(GRID_SIZE);
	for (let i = 0; i < GRID_SIZE; i++) {
		cells[i] = new Array(GRID_SIZE);
	}
	for (let i = 0; i < GRID_SIZE; i++) {
		for (let j = 0; j < GRID_SIZE; j++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			cells[i][j] = cell;
			gridElement.append(cell);
		}
	}
	return cells;
}
