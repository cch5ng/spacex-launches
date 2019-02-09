import React from 'react';
import './App.css';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';
import { getPrettyTime } from './helpers';

const launchesQuery = `{
  launches {
    id
    launch_success
    mission_name
    launch_date_utc
    launch_site {
      site_name
    }
    rocket {
      rocket_name
    }
    details
  }
}`;

const client = new GraphQLClient('https://api.spacex.land/graphql/');

function useGraphQL(query) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    client.request(query).then(
      data => {
        setState({ data, loading: false });
      },
      err => {
        console.error(err);
      }
    );
  }, [query]);

  return state;
}

function Header() {
  return (
    <div className="page-head">
      <h2 className="page-head-title text-center">Space X Launches</h2>
    </div>
  );
}

function Loading() {
  return (
    <div className="progress">
      <div
        className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: '100%' }}
        aria-valuenow="100"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        Loading
      </div>
    </div>
  );
}

function Launches({ launches }) {
  const launchesByDate = launches.reduce((list, launch) => {
    const date = launch.launch_date_utc.slice(0, 4);
    list[date] = list[date] || [];
    list[date].push(launch);
    return list;
  }, {});

  return (
    <ul data-testid="launches" className="timeline timeline-variant">
      {Object.keys(launchesByDate).map(launchDate => (
        <span key={launchDate}>
          <li className="timeline-month">{launchDate}</li>
          {launchesByDate[launchDate].map(launch => (
            <Launch key={launch.flight_number} launch={launch} />
          ))}
        </span>
      ))}
    </ul>
  );
}

function Launch({ launch }) {
  const [comments, setComments] = useState([]);

  const launchIcon = launch.launch_success ? (
    <i className="icon mdi mdi-rocket" />
  ) : (
    <i className="icon mdi mdi-bomb" />
  );


  function getComments(launchId, fn) {
    console.log('launchId', launchId);
    commentsRetrieve(launchId).catch(error => console.error(error));
    //comments(launchId).catch(error => console.error(error))
  }

  async function commentsRetrieve(launchId) {
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
    setComments(commentsForLaunch);
  }

  return (
    <li className="timeline-item timeline-item-detailed right">
      <div className="timeline-content timeline-type file">
        <div className="timeline-icon">{launchIcon}</div>

        <div className="timeline-header">
          <span className="timeline-autor">
            #{launch.id}: {launch.mission_name}
          </span>{' '}
          <p className="timeline-activity">
            {launch.rocket.rocket_name} &mdash; {launch.launch_site.site_name}
            <button className="btn-comments" onClick={() => getComments(launch.id)}>
              Comments
            </button>

          </p>
          <span className="timeline-time">{launch.launch_date_utc.slice(0, 10)}</span>
        </div>
        <div className="timeline-summary">
          <p>{launch.details}</p>

          <div className="comments">
            {comments.length > 0 && (
              <h4>Comments</h4>
            )}

            {comments.map(comment => <Comment comment={comment} />
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function Comment({ comment }) {
  let htmlToRender = createMarkup(comment.body);
  let commentTime = getPrettyCommentTime(comment.date);

  function createMarkup(htmlStr) {
    return {__html: htmlStr};
  }

  function getPrettyCommentTime(date) {
    let dateObj = new Date(date);
    let utcHours = dateObj.getUTCHours();
    let utcMinutes = dateObj.getUTCMinutes();
    console.log('utcHours', utcHours);


    return `${getPrettyTime(utcHours)}:${getPrettyTime(utcMinutes)}`;
  }

  return (
    <div key={comment.id} className="comment">
      <p><span className="comment-author">{comment.author}</span> <span className="comment-time">{commentTime}</span></p>
      <div dangerouslySetInnerHTML={htmlToRender} />
    </div>
  )
}

export default function App() {
  const { data, loading } = useGraphQL(launchesQuery);

  return (
    <div>
      <Header />
      {loading ? <Loading /> : <Launches launches={data.launches} />}
    </div>
  );
}
