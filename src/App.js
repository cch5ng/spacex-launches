import React from 'react';
import './App.css';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';
import { getPrettyTime, commentsRetrieve, sortByDate, mergeSort,
  merge } from './helpers';

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
    links {
      video_link
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
  const launchsSortedByDate = sortByDate(launches);
  const launchesByDate = launchsSortedByDate.reduce((list, launch) => {
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
  const [showVideo, setShowVideo] = useState(false);
  const commentBtnTestId = `comment-btn-${launch.id}`;
  const videoBtnTestId = `video-btn-${launch.id}`;
  const videoFrameTestId = `video-frame-${launch.id}`;

  const launchIcon = launch.launch_success ? (
    <i className="icon mdi mdi-rocket" />
  ) : (
    <i className="icon mdi mdi-bomb" />
  );

  let videoUrlReformat = launch && launch.links && launch.links.video_link ? launch.links.video_link.replace('watch?v=', 'embed/') : '';

  function getComments(launchId, fn) {
    let commentsDisplay = commentsRetrieve(launchId)
      .then(commentsDisplay => {
        setComments(commentsDisplay);
      })
      .catch(error => console.error(error));
  }

  return (
    <li className="timeline-item timeline-item-detailed right" data-testid={launch.id}>
      <div className="timeline-content timeline-type file">
        <div className="timeline-icon">{launchIcon}</div>

        <div className="timeline-header">
          <span className="timeline-autor">
            #{launch.id}: {launch.mission_name}
          </span>{' '}
          <p className="timeline-activity">
            {launch.rocket.rocket_name} &mdash; {launch.launch_site.site_name}
            <button className="btn-comments" onClick={() => getComments(launch.id)} data-testid={commentBtnTestId}>
              Comments
            </button>
            <button className="btn-show-video" onClick={() => setShowVideo(!showVideo)} data-testid={videoBtnTestId}>
              Video
            </button>

          </p>
          <span className="timeline-time">{launch.launch_date_utc.slice(0, 10)}</span>
        </div>
        <div className="timeline-summary">
          <p>{launch.details}</p>

          {showVideo && videoUrlReformat && (
            <iframe width="560" height="315" src={videoUrlReformat} frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen data-testid={videoFrameTestId} />
          )}

          <div className="comments">
            {comments.length > 0 && (
              <h4>Comments</h4>
            )}

            {comments.map(comment => <Comment key={comment.id} comment={comment} />
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

    return `${getPrettyTime(utcHours)}:${getPrettyTime(utcMinutes)}`;
  }

  return (
    <div className="comment" data-testid={comment.id}>
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
