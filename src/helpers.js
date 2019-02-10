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
