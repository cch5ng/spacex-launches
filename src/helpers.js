import { GraphQLClient } from 'graphql-request';

export function getPrettyTime(timeInt) {
	if (timeInt / 10 >= 1) {
		return timeInt.toString();
	}
	return `0${timeInt.toString()}`;
}

export async function commentsRetrieve(launchId) {
  const endpoint = 'https://pb3c6uzk5zhrzbcuhssogcpq74.appsync-api.us-east-1.amazonaws.com/graphql'

  const graphQLClient2 = new GraphQLClient(endpoint, {
    headers: {
      'x-api-key': 'da2-tadwcysgfbgzrjsfmuf7t4huui',
      'Content-Type': 'application/json',
    },
  })

  const query = /* GraphQL */
    `{
      launchCommentsByFlightNumber(flightNumber: ${launchId}) {
        items {
          id
          author
          body
          date
        }
      }
    }`

  const data = await graphQLClient2.request(query)
  const commentsForLaunch = data.launchCommentsByFlightNumber.items;
  return commentsForLaunch;
}

export function merge(left, right) {
	let mergedAr = [];
	while (left.length && right.length) {
		if (left[0] <= right[0]) {
			mergedAr.push(left.shift())
		} else {
			mergedAr.push(right.shift())
		}
	}

	if (left.length) {
		mergedAr = mergedAr.concat(left)
	}
	if (right.length) {
		mergedAr = mergedAr.concat(right)
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

