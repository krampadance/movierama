import { Divider, Skeleton, Button, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import MovieList from '../../components/MovieList';
import LoginButton from '../../components/LoginButton';
import { getMovies, getUserMovies, getUserData } from '../../services/apiCalls';
import SignUpButton from '../../components/SignUpButton';
import { showError } from '../../utils';
import {
  setUserId,
  setUserName,
  setUserHates,
  setUserLikes,
  clearState,
  setMovies
} from '../../redux/actions';
import OrderOptions from '../OrderOptions.js';

const limit = process.env.REACT_APP_QUERY_LIMIT || 2;


function Dashboard({ selectedUser, user, setUserId, setUserName, setUserHates, setUserLikes, clearState, setMovies }) {
  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderDirection, setOrderDirection] = useState('desc');
  const [orderOption, setOrderOption] = useState('none');
  const navigate = useNavigate();

  const initData = async () => {
    setData([]);
    setLoading(true);
    setSkip(0);
    try {
      const res = selectedUser ? await getUserMovies(selectedUser, 0, limit, orderOption, orderDirection) : await getMovies(0, limit, orderOption, orderDirection);
      const movies = res.data;
      setData(movies);
      console.log(1, data);
      const moviesObject = user.movies;
      movies.map((m) => {
        moviesObject[m.id] = {
          likesCount: m.likes_count,
          hatesCount: m.hates_count
        };
      });
      setMovies(moviesObject);
      setLoaded(false);
      setLoading(false);
    } catch (e) {
      showError('Error loading movie data', e.response.data.detail || e);
    }
  };

  // useEffect(() => {
  //   ....

  // }, [skip, isLoading, sortoption])

  const loadMore = async (skipApi) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const res = selectedUser ? await getUserMovies(selectedUser, skipApi, limit, orderOption, orderDirection) : await getMovies(skipApi, limit, orderOption, orderDirection);
      const movies = res.data;
      if (movies.length !== 0) {
        setSkip(skipApi + limit);
      }
      if (movies.length < limit) {
        setLoaded(true);
      }
      setData(data.concat(movies));
      const moviesObject = user.movies;
      const newObj = {};
      movies.map(
        (m) =>
          (newObj[m.id] = {
            likesCount: m.likes_count,
            hatesCount: m.hates_count
          })
      );
      setMovies({ ...moviesObject, ...newObj });
      setLoading(false);
    } catch (e) {
      showError('Error loading movie data', e.response.data.detail || e);
    }
  };

  useEffect(() => {
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
      <Row>
        <Col span={8} className="title">
          Movierama
        </Col>
        {user.accessToken === undefined && (
          <Col span={8} offset={7}>
            <LoginButton />
            <SignUpButton />
          </Col>
        )}
        {user.accessToken !== undefined && (
          <Col span={8} offset={10}>
            <div>
              Welcome <Link to={`users/${user.userId}`}>{user.userName}</Link> |
              <Button
                onClick={() => {
                  clearState();
                  initData();
                }}>
                Logout
              </Button>
            </div>
          </Col>
        )}
      </Row>
      <OrderOptions 
        orderOption={orderOption}
        setOrderOption={setOrderOption}
        orderDirection={orderDirection}
        setOrderDirection={setOrderDirection}
      ></OrderOptions>

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
        <Col span={12}>
          {user.accessToken !== undefined && (
            <Button type="primary" onClick={() => navigate('/users/addMovie')}>
              Add Movie
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state
});

export default connect(mapStateToProps, {
  setUserId,
  setUserName,
  setUserLikes,
  setUserHates,
  clearState,
  setMovies
})(Dashboard);
