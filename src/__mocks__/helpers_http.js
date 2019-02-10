
const comments = [
	{	author: "who",
		body: "<div class='md'><p>Hello World</p> </div>",
		date: "2018-03-03T05:22:41.000Z",
		id: "comment-01"
	},
	{	author: "dunne",
		body: "<div class='md'><p>wunnerful</p> </div>",
		date: "2018-03-03T07:20:41.000Z",
		id: "comment-02"
	}
];

export async function commentsRetrieve(launchId) {
	return new Promise((resolve, reject) => {
		if (!launchId) {reject({error: 'No comments were found'})}

		resolve(comments);
	})
}
