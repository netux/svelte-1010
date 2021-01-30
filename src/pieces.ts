import { Array2D } from './array2d';


export type PieceData = {
	color: string,
	format: Array2D<boolean>
};


const T = true;
const F = false;

export const Pieces: PieceData[] = [
	{
		color: '#99DD55',
		format: Array2D.from([
			[T, T],
			[T, T]
		])
	},
	{
		color: '#DB6355',
		format: Array2D.from([
			[T],
			[T],
			[T],
			[T],
			[T]
		])
	},
	{
		color: '#DB6355',
		format: Array2D.from([
			[T, T, T, T, T]
		])
	},
	{
		color: '#E76A82',
		format: Array2D.from([
			[T, T, T, T]
		])
	},
	{
		color: '#E76A82',
		format: Array2D.from([
			[T],
			[T],
			[T],
			[T]
		])
	},
	{
		color: '#EF9548',
		format: Array2D.from([
			[T, T, T]
		])
	},
	{
		color: '#EF9548',
		format: Array2D.from([
			[T],
			[T],
			[T]
		])
	},
	{
		color: '#FFC73D',
		format: Array2D.from([
			[T, T]
		])
	},
	{
		color: '#FFC73D',
		format: Array2D.from([
			[T],
			[T]
		])
	},
	{
		color: '#7889C3',
		format: Array2D.from([
			[T]
		])
	},
	{
		color: '#4CD5AE',
		format: Array2D.from([
			[T, T, T],
			[T, T, T],
			[T, T, T]
		])
	},
	{
		color: '#4CD5AE',
		format: Array2D.from([
			[T, T, T],
			[T, F, F],
			[T, F, F]
		])
	},
	{
		color: '#4CD5AE',
		format: Array2D.from([
			[T, T, T],
			[F, F, T],
			[F, F, T]
		])
	},
	{
		color: '#4CD5AE',
		format: Array2D.from([
			[T, F, F],
			[T, F, F],
			[T, T, T]
		])
	},
	{
		color: '#4CD5AE',
		format: Array2D.from([
			[F, F, T],
			[F, F, T],
			[T, T, T]
		])
	}
];
