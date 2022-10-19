import { Divider, Skeleton, Button, Row, Col, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import MovieList from '../../components/MovieList';
import Header from '../Header';
import { getMovies, getUserMovies, getUserData } from '../../services/apiCalls';
import { showError } from '../../utils';
import {
  setUserId,
  setUserName,
  setUserHates,
  setUserLikes,
  setMovieVotes,
  clearMovieVotes,
  clearUser
} from '../../redux/actions';
import OrderOptions from '../OrderOptions.js';

const limit = process.env.REACT_APP_QUERY_LIMIT || 2;

function Dashboard({
  selectedUser,
  user,
  votes,
  setUserId,
  setUserName,
  setUserHates,
  setUserLikes,
  clearUser,
  setMovieVotes,
  clearMovieVotes
}) {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderDirection, setOrderDirection] = useState('desc');
  const [orderOption, setOrderOption] = useState('none');
  const navigate = useNavigate();

  const clearState = () => {
    clearUser();
    clearMovieVotes();
  };

  const initData = async () => {
    setData([]);
    setLoading(true);
    setSkip(0);
    try {
      const res = selectedUser
        ? await getUserMovies(selectedUser, 0, limit, orderOption, orderDirection)
        : await getMovies(0, limit, orderOption, orderDirection);
      const movies = res.data;
      setData(movies);
      // Set the movie votes on the store so that we can update the frontend when
      // a user likes/dislikes a movie
      const moviesVotesObject = votes.movies;
      movies.map((m) => {
        moviesVotesObject[m.id] = {
          likesCount: m.likes_count,
          hatesCount: m.hates_count
        };
      });
      setMovieVotes(moviesVotesObject);
      setLoaded(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      showError('Error loading movie data', e.response.data.detail || e);
    }
  };

  const loadMore = async (skipApi) => {
    // Loads more data for the infinite scroller
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      // Select correct api call based on whether we are in main page or a user's page
      const res = selectedUser
        ? await getUserMovies(selectedUser, skipApi, limit, orderOption, orderDirection)
        : await getMovies(skipApi, limit, orderOption, orderDirection);
      const movies = res.data;
      if (movies.length !== 0) {
        setSkip(skipApi + limit);
      }
      if (movies.length < limit) {
        setLoaded(true);
      }
      setData(data.concat(movies));
      // Set the movie votes on the store so that we can update the frontend when
      // a user likes/dislikes a movie
      const moviesObject = votes.movies;
      const newObj = {};
      movies.map(
        (m) =>
          (newObj[m.id] = {
            likesCount: m.likes_count,
            hatesCount: m.hates_count
          })
      );
      setMovieVotes({ ...moviesObject, ...newObj });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      showError('Error loading movie data', e.response.data.detail || e);
    }
  };

  useEffect(() => {
    // When logging in we collect the user data and set it in the store
    const loadUserData = async () => {
      if (user.accessToken === undefined) {
        return;
      }
      try {
        const res = await getUserData(user.accessToken);
        setUserId(res.data.id);
        setUserName(`${res.data.first_name} ${res.data.last_name}`);
        setUserHates(res.data.hated_movies);
        setUserLikes(res.data.liked_movies);
      } catch (e) {
        showError('Error loading user data', e.response.data.detail || e);
      }
    };

    loadUserData();
    // We collect the initial data for the infinite scroller component
    initData();
    setSkip(limit);
  }, []);

  useEffect(() => {
    initData();
    setSkip(limit);
  }, [orderOption]);

  useEffect(() => {
    initData();
    setSkip(limit);
  }, [orderDirection]);

  return (
    <>
      <Header user={user} clearState={clearState} initData={initData}></Header>
      <Space>
        <OrderOptions
          orderOption={orderOption}
          setOrderOption={setOrderOption}
          orderDirection={orderDirection}
          setOrderDirection={setOrderDirection}></OrderOptions>
        ,
        <Col span={12}>
          {user.accessToken !== undefined && (
            <Button type="primary" onClick={() => navigate('/users/addMovie')}>
              Add Movie
            </Button>
          )}
        </Col>
      </Space>

      <Row>
        <Col
          id="scrollableDiv"
          span={12}
          style={{
            height: 400,
            width: '100%',
            overflow: 'auto',
            padding: '0 16px'
          }}>
          <InfiniteScroll
            dataLength={data.length}
            next={() => loadMore(skip)}
            hasMore={!loaded}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>Loaded whole list</Divider>}
            scrollableTarget="scrollableDiv">
            <MovieList data={data} key={new Date().getTime()} />
          </InfiniteScroll>
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  votes: state.votes
});

export default connect(mapStateToProps, {
  setUserId,
  setUserName,
  setUserLikes,
  setUserHates,
  clearUser,
  setMovieVotes,
  clearMovieVotes
})(Dashboard);
