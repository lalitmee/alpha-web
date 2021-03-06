import { push } from 'connected-react-router';

import { addPosts } from '../post/actions';
import { addTag as addArticleTag } from '../post/create/CreateArticle/actions';

const baseName = '@competitions';

export const actionTypes = {
  getAll: {
    init: `${baseName}/get_all/init`,
    done: `${baseName}/get_all/done`,
    error: `${baseName}/get_all/error`,
  },
  getPosts: {
    init: `${baseName}/get_posts/init`,
    done: `${baseName}/get_posts/done`,
    error: `${baseName}/get_posts/error`,
  },
  getWinners: {
    init: `${baseName}/get_winners/init`,
    done: `${baseName}/get_winners/done`,
    error: `${baseName}/get_winners/error`,
  },
};

export const getAllCompetitions = () => (dispatch, getState, { haprampAPI }) => {
  dispatch({ type: actionTypes.getAll.init });
  return haprampAPI.v2.competitions.getAll()
    .then(results => dispatch({ type: actionTypes.getAll.done, results }))
    .catch(reason => dispatch({ type: actionTypes.getAll.error, reason }));
};

export const getPostsForCompetition = competitionId => (dispatch, getState, { haprampAPI }) => {
  dispatch({ type: actionTypes.getPosts.init, competitionId });
  return haprampAPI.v2.competitions.getCompetitionPosts(competitionId)
    .then((results) => {
      dispatch(addPosts(results));
      return dispatch({
        type: actionTypes.getPosts.done,
        competitionId,
        results: results.map(post => `${post.author}/${post.permlink}`),
      });
    })
    .catch(reason => dispatch({ type: actionTypes.getPosts.error, reason, competitionId }));
};

export const getCompetitionWinners = competitionId => (dispatch, getState, { haprampAPI }) => {
  dispatch({ type: actionTypes.getWinners.init, competitionId });
  return haprampAPI.v2.competitions.getCompetitionWinners(competitionId)
    .then((results) => {
      dispatch(addPosts(results));
      return dispatch({
        type: actionTypes.getWinners.done,
        competitionId,
        results: results.map(post => `${post.author}/${post.permlink}`),
      });
    })
    .catch((reason) => {
      console.error('[Get Competition Winners]', reason);
      return dispatch({ type: actionTypes.getWinners.error, competitionId, reason });
    });
};

export const participateInCompetition = tag => (dispatch) => {
  dispatch(addArticleTag(tag));
  return dispatch(push('/create/article'));
};
