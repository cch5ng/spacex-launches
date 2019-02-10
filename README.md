## Introduction

[SpaceX just launched a new GraphQL API](https://medium.com/open-graphql/launching-spacex-graphql-api-b3d7029086e0), and we thought it would be exciting to use that API to visualize all of their launches on a single page.

We built this out and it works OK, but it has a few issues and could use some love. That's where you come in! In no particular order...

 - ✨ There's another GraphQL API with comments on each launch. It would be great to add a button that fetches and displays these comments, [something like this](https://i.imgur.com/rBkl87E.png). [See below](https://github.com/thoughtindustries/spacex-launches#comments-api) for more info on the comments API.
 - 🐛 The launches aren't in order! For example, #7 (2010-12-08) appears after #6 (2010-06-04), where did we go wrong?
 - 💄 It'd be nice if it looked [more like this](https://i.imgur.com/VB2c48X.png), with alternating left/right timeline items, and maybe some color variation in the background of the rocket/bomb icon. To see the live version of that screenshot, [navigate here](https://themes.getbootstrap.com/preview/?theme_id=1696&show_new=) and click Pages > Timeline v2. All of the classes in this framework can be used.
 - 🐛 If you open up the developer console, you'll see the error `"Warning: Each child in a list should have a unique "key" prop."` but [we're specifying a key](https://github.com/thoughtindustries/spacex-launches/blob/3402ee684b71d129f74bbd8fb2e2bf41ea991cd4/src/App.js#L80)! What gives?
 - ✨ The SpaceX GraphQL API, [which you can play with here](https://api.spacex.land/graphql/), has a "video_link" (under "links") which could be used to embed a video of the launch. That would be awesome!

## Candidate Notes

 - ✨ There's another GraphQL API with comments on each launch. It would be great to add a button that fetches and displays these comments, [something like this](https://i.imgur.com/rBkl87E.png). [See below](https://github.com/thoughtindustries/spacex-launches#comments-api) for more info on the comments API. I did not implement the orange dot/ball in the suggested styling. Maybe this could be done using flexbox, creating a separate div for the dot (defined via css) and then shifting that ball's horizontal position to overlap with the next div's left border.

> For the comments addition, I decided to add one Comment button per launch. This seemed a little more efficient in terms of delivering the feature. But I did some research and if it is more user friendly to load all comments (for all launches) at once, this resource looked interesting: 
https://blog.apollographql.com/graphql-schema-stitching-8af23354ac37 

 - ✨ The SpaceX GraphQL API, [which you can play with here](https://api.spacex.land/graphql/), has a "video_link" (under "links") which could be used to embed a video of the launch. That would be awesome!

 > Same as with comments (above), at first I tried to load the embedded videos at initial app render but this was taking too much time because of all of the resource downloads. So I decided to go with a single Video button per launch, to reduce the overhead. But maybe other lazy loading approaches could be considered. The concept came from this resource: https://webdesign.tutsplus.com/tutorials/how-to-lazy-load-embedded-youtube-videos--cms-26743

 - 🐛 The launches aren't in order! For example, #7 (2010-12-08) appears after #6 (2010-06-04), where did we go wrong?

 > It seems like GraphQL does not return query results in a specific order and on initial searches I didn't see a simple resolution (there might be 3rd party libraries). I chose to implement a sorting function to reorder the retrieved launches list by date. Due to time constraints, I only used mergeSort but for a more flexible sorting function (for smaller list searching like 45 items), an added condition to check for short lists should default to insertion sort.


## Your Task

While we don't use React ourselves (we're an Ember shop), this exercise is designed to mimic what you would be doing at Thought Industries fulltime: pick up some new technologies and improve upon an existing platform... just on a much smaller scale, and with more rockets. 🚀

We're hoping you will have time to pick one or more tasks off the list above and resolve them. We respect your home time and there's no need to accomplish everything on the list above, we're just looking to get a feel for your work, applied in a neutral space.

You can fork this repository and commit your changes there, then open up a pull request and send us the link.

We plan to review up until ~Feb 12th, but let us know if you need more time.

## Installation

You should be able to checkout this project and run `yarn` (if you have it!) or `npm install` to install the dependencies. You will need node v6+ to run this application. From there, simply run `yarn start` or `npm start` and then open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Comments API

We've built a custom GraphQL API containing comments on each launch (_except the early ones_), pulled from the Reddit API. The API Endpoint is [https://pb3c6uzk5zhrzbcuhssogcpq74.appsync-api.us-east-1.amazonaws.com/graphql](https://pb3c6uzk5zhrzbcuhssogcpq74.appsync-api.us-east-1.amazonaws.com/graphql).

We're hoping the comments will look [something like this](https://i.imgur.com/rBkl87E.png).

The schema for the SpaceX Comments GraphQL API is available [here](https://github.com/thoughtindustries/spacex-launches/blob/9cfcea596993aafccbeb12bec7e2d134b447a7ca/spacex-comments.graphql).

You'll need to authenticate with this API by specifying an API Key in the header as `x-api-key`, for example:

```bash
curl 'https://pb3c6uzk5zhrzbcuhssogcpq74.appsync-api.us-east-1.amazonaws.com/graphql' -H 'x-api-key: APIKEYHERE' -H 'Content-Type: application/json' --data-binary '{"query":"{\n  launchCommentsByFlightNumber(flightNumber: 12) {\n    items {\n      id\n      author\n      body\n      date\n    }\n  }\n}"}'
```

We're using [graphql-request](https://github.com/prisma/graphql-request) which can probably help you out here.

The current key is: `da2-tadwcysgfbgzrjsfmuf7t4huui`. It expires Tue, 12 Feb 2019 01:00:00 GMT.

## Available Scripts

In the project directory, you can run:

### `npm start` / `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test` / `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Learn More

This project was bootstrapped with `create-react-app`, so you can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/). Be sure to check out [hooks](https://reactjs.org/docs/hooks-intro.html).

Don't hesitate to ask any questions!
