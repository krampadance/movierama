/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import { Divider, Skeleton, Button, Row, Col, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import './Main.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import MovieList from '../../components/MovieList';
import LoginButton from '../../components/LoginButton';
import { getMovies, getUserData } from '../../services/apiCalls';
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

const limit = process.env.REACT_APP_QUERY_LIMIT || 2;
const orderOptionsList = [
  {
    label: 'Likes',
    value: 'likes_count'
  },
  {
    label: 'Hates',
    value: 'hates_count'
  },
  {
    label: 'Date',
    value: 'created_at'
  },
  {
    label: 'None',
    value: 'none'
  }
];

function Main({ user, setUserId, setUserName, setUserHates, setUserLikes, clearState, setMovies }) {
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
      const res = await getMovies(0, limit, orderOption, orderDirection);
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
      const res = await getMovies(skipApi, limit, orderOption, orderDirection);
      const movies = res.data;
      // console.log(1, movies);
      if (movies.length !== 0) {
        setSkip(skipApi + limit);
      }
      if (movies.length < limit) {
        setLoaded(true);
      }
      console.log(data, movies);
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
      const newObject = movies
        .map((m) => ({
          likesCount: m.likes_count,
          hatesCount: m.hates_count,
          id: m.id
        }))
        .reduce((a, i) => ({ ...a, [i.id]: i }), {});

      setMovies({ ...moviesObject, ...newObj });
      setLoading(false);
    } catch (e) {
      showError('Error loading movie data', e.response.data.detail || e);
    }
  };
  // console.log(user);

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
                }}
              >
                Logout
              </Button>
            </div>
          </Col>
        )}
      </Row>
      <Row>
        <Col>Order By</Col>
        <Col offset={2}>
          <Radio.Group
            options={orderOptionsList}
            onChange={({ target: { value } }) => {
              setOrderOption(value);
            }}
            value={orderOption}
            optionType="button"
          />

          <Radio.Group
            onChange={({ target: { value } }) => {
              setOrderDirection(value);
            }}
            value={orderDirection}
          >
            <Radio value="asc">Ascending</Radio>
            <Radio value="desc">Descending</Radio>
          </Radio.Group>
        </Col>
      </Row>

      <Row>
        <Col
          id="scrollableDiv"
          span={12}
          style={{
            height: 400,
            width: '100%',
            overflow: 'auto',
            padding: '0 16px'
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={() => loadMore(skip)}
            hasMore={!loaded}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>Loaded whole list</Divider>}
            scrollableTarget="scrollableDiv"
          >
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
})(Main);
