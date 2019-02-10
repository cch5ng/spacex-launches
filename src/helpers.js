
export function getPrettyTime(timeInt) {
	if (timeInt / 10 >= 1) {
		return timeInt.toString();
	}
	return `0${timeInt.toString()}`;
}

export function merge(left, right) {
	let mergedAr = [];
	while (left.length && right.length) {
		if (left[0] <= right[0]) {
			mergedAr.push(left.shift());
		} else {
			mergedAr.push(right.shift());
		}
	}

	if (left.length) {
		mergedAr = mergedAr.concat(left);
	}
	if (right.length) {
		mergedAr = mergedAr.concat(right);
	}
	return mergedAr
}

export function mergeSort(arr) {
	if (arr.length === 1) {
		return arr;
	}

	// simple case is [1, 2]
	let mid = Math.floor(arr.length / 2);
	let left = arr.slice(0, mid);
	let right = arr.slice(mid);
	return merge(mergeSort(left), mergeSort(right));
}

export function sortByDate(objAr) {
	let launchKeyedDateStr = {};
	let dateKeyedDateMs = {};
	let sortedDateMsAr = [];
	let objArSortedByDate = [];

	// build launchKeyedDateStr & dateKeyedDateMs
	objAr.forEach(obj => {
		let dateStr = obj.launch_date_utc;
		launchKeyedDateStr[dateStr] = obj;

		let dateObj = new Date(dateStr);
		let dateMs = Date.UTC(dateObj.getUTCFullYear(),
			dateObj.getUTCMonth(),
			dateObj.getUTCDate(),
			dateObj.getUTCHours(),
			dateObj.getUTCMinutes(),
			dateObj.getUTCSeconds()
		);

		dateKeyedDateMs[dateMs] = dateStr;
	});

	sortedDateMsAr = mergeSort(Object.keys(dateKeyedDateMs));
	objArSortedByDate = sortedDateMsAr.map((dateMs2, idx) => {
		let dateStr2 = dateKeyedDateMs[dateMs2];
	
		return launchKeyedDateStr[dateStr2];
	});

	return objArSortedByDate;
}

