export class Array2D<T> extends Array<Array<T>> {
	readonly width: number;
	readonly height: number;

	constructor(width: number, height: number) {
		super(height);

		this.width = width;
		this.height = height;

		for (let y = 0; y < this.length; y++) {
			this[y] = Array(width);
		}
	}

	forEach2D(callbackfn: (
		value: T, x: number, y: number, array: T[]) => void,
		thisArg?: any,
		start?: [x: number, y: number],
		end?: [x: number, y: number]
	): void {
		const [startX, startY] = start ?? [0, 0];
		const [endX, endY] = end ?? [this.width, this.height];

		for (let y = Math.max(0, startY); y < Math.min(endY, this.height); y++) {
			for (let x = Math.max(0, startX); x < Math.min(endX, this.width); x++) {
				callbackfn.call(thisArg, this[y][x], x, y, this);
			}
		}
	}

	map2D<U>(callbackfn: (value: T, x: number, y: number, array: Array2D<T>) => U, thisArg?: any): Array2D<U> {
		const result = new Array2D<U>(this.width, this.height);
		result.forEach2D((_, x, y, array) => {
			array[y][x] = callbackfn.call(thisArg, this[y][x], x, y, array);
		});
		return result;
	}

	fill2D(value: T, start?: [x: number, y: number], end?: [x: number, y: number]): this {
		this.forEach2D((_, x, y, array) => {
			array[y][x] = value;
		}, this, start, end);
		return this;
	}

	// every2D<S extends T>(predicate: (value: T, x: number, y: number, array: Array2D<T>) => value is S, thisArg?: any): this is Array2D<S>;
	every2D(predicate: (value: T, x: number, y: number, array: Array2D<T>) => boolean, thisArg?: any): boolean {
		for (const [x, y, value] of this.entries2D()) {
			if (!predicate.call(thisArg, value, x, y, this)) {
				return false;
			}
		}
		return true;
	}

	some2D(predicate: (value: T, x: number, y: number, array: Array2D<T>) => boolean, thisArg?: any): boolean {
		for (const [x, y, value] of this.entries2D()) {
			if (predicate.call(thisArg, value, x, y, this)) {
				return true;
			}
		}
		return false;
	}

	*values2D(): IterableIterator<T> {
		for (let [_x, _y, value] of this.entries2D()) {
			yield value;
		}
	}

	*entries2D(): IterableIterator<[x: number, y: number, value: T]> {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				yield [x, y, this[y][x]];
			}
		}
	}

	static from<T>(from: T[][] | Array2D<T>): Array2D<T> {
		if (from.length === 0 || !Array.isArray(from[0])) {
			throw new Error('`from` array must have at least one object');
		}

		const width = from[0].length;
		const height = from.length;

		const result = new Array2D<T>(width, height);//.map2D((_, x, y) => from[y][x]);
		for (let y = 0; y < height; y++) {
			const fromRow = from[y];
			if (fromRow.length !== width) {
				throw new Error(`row at index ${y} has size ${fromRow.length}, not ${width}`);
			}

			for (let x = 0; x < width; x++) {
				result[y][x] = fromRow[x];
			}
		}
		return result;
	}
}
