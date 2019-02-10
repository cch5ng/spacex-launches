import { getPrettyTime, sortByDate, mergeSort, merge } from './helpers';

describe('helpers', () => {

	describe('merge function', () => {
		it('should sort correctly', () => {
			const ar1 = [1, 3];
			const ar2 = [5, 7];
			const arMerged = [1, 3, 5, 7];

			expect(merge(ar2, ar1)).toEqual(arMerged);
		});

		it('should sort correctly2', () => {
			const ar3 = [1, 3, 6, 10];
			const ar4 = [5, 7];
			const arMerged2 = [1, 3, 5, 6, 7, 10];

			expect(merge(ar3, ar4)).toEqual(arMerged2);
		});

		it('should sort correctly3', () => {
			const ar5 = [100];
			const ar6 = [8, 50, 75];
			const arMerged3 = [8, 50, 75, 100];

			expect(merge(ar5, ar6)).toEqual(arMerged3);
		});
	});

	describe('mergeSort function', () => {
		it('should sort correctly', () => {
			const arUnsorted = [8, 4, 2, 9, 100, 1];
			const arSorted = [1, 2, 4, 8, 9, 100];

			expect(mergeSort(arUnsorted)).toEqual(arSorted);
		});

		it('should sort correctly', () => {
			const arUnsorted1 = [1000, 500, 200, 0];
			const arSorted1 = [0, 200, 500, 1000];

			expect(mergeSort(arUnsorted1)).toEqual(arSorted1);
		});

	});

});