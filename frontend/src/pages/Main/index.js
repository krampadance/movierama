import { Divider, Skeleton, Button, Row, Col, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import './Main.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from '../../components/MovieList';
import LoginButton from '../../components/LoginButton';
import { getMovies, getUserData } from '../../services/apiCalls';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignUpButton from '../../components/SignUpButton';
import { showError } from '../../utils';
import { connect } from 'react-redux'
import { setUserId, setUserName, setUserHates, setUserLikes, clearState, setMovies } from '../../redux/actions';


const orderOptionsList = [
    {
      label: 'Likes',
      value: 'likes_count',
    },
    {
      label: 'Hates',
      value: 'hates_count',
    },
    {
      label: 'Date',
      value: 'created_at',
    },
    {
      label: 'None',
      value: 'none',
    },
  ];


const Main = ({ user, setUserId, setUserName, setUserHates, setUserLikes, clearState, setMovies }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [orderDirection, setOrderDirection] = useState("desc")
    const [orderOption, setOrderOption] = useState('none');
    const [limit, setLimit] = useState(process.env.REACT_APP_QUERY_LIMIT || 2)
    const navigate = useNavigate();

    useEffect(() => {
      loadUserData();
      initData();
      setSkip(limit)
    }, []);

    useEffect(() => {
      initData()
      setSkip(limit)
    }, [orderOption]);

    useEffect(() => {
      initData()
      setSkip(limit)
    }, [orderDirection]);


    const loadUserData = async () => {
      if (user.accessToken === undefined) {
          return;
      }
      try {
          const res = await getUserData(user.accessToken)
          setUserId(res.data.id)
          setUserName(`${res.data.first_name} ${res.data.last_name}`)
          setUserHates(res.data.hated_movies)
          setUserLikes(res.data.liked_movies)
      } catch (e){
        showError("Error loading user data", e.response.data.detail || e)
      }
   }
  
    const initData = async () => {
      setLoading(true)
      setData([])
      setSkip(0)
      try {
        const res = await getMovies(0, limit, orderOption, orderDirection)
        const movies = res.data;
        setData(movies)
        let moviesObject = user.movies
        movies.map((m) => { moviesObject[m.id] = { likesCount: m.likes_count, hatesCount: m.hates_count } })
        setMovies(moviesObject)
        setLoading(false)
        setLoaded(false)
      } catch (e) {
        setLoading(false)
        showError("Error loading movie data", e.response.data.detail || e)
      }
    }

    const loadMore = async () => {     
      setLoading(true)
      try {
        const res = await getMovies(skip, limit, orderOption, orderDirection)
        const movies = res.data;
        if (movies.length !== 0) {
          setSkip(skip + limit)
        }
        if (movies.length < limit) {
          setLoaded(true)
        }
        setData(data.concat(movies))
        let moviesObject = user.movies
        movies.map((m) => { moviesObject[m.id] = { likesCount: m.likes_count, hatesCount: m.hates_count } })
        setMovies(moviesObject)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        showError("Error loading movie data", e.response.data.detail || e)
      }
    }

    return (
     <>
      <Row> 
        <Col span={8} className='title'>Movierama</Col>
        {user.accessToken === undefined && <Col span={8} offset={7}><LoginButton></LoginButton><SignUpButton></SignUpButton></Col>}
        {
          user.accessToken !== undefined && (
            <Col span={8} offset={10}>
              <div>Welcome <Link to={`users/${user.userId}`}>{user.userName}</Link> | 
              <a onClick={() => {
                clearState()
                initData()
              }}>Logout</a></div>
            </Col>
          )
        }
      </Row>
      <Row>
      <Col>Order By</Col>
      <Col offset={2}>
        <Radio.Group 
          options={orderOptionsList} 
          onChange={({ target: { value } }) => {
            setOrderOption(value)
          }}
          value={orderOption} optionType="button" />

        <Radio.Group
          onChange={({ target: { value } }) => {
            setOrderDirection(value)
          }}
          value={orderDirection}>
              <Radio value={'asc'}>Ascending</Radio>
              <Radio value={'desc'}>Descending</Radio>
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
            padding: '0 16px',
          }}
        >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMore}
          hasMore={!loaded}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>Loaded whole list</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <MovieList data={data}/>
        </InfiniteScroll>
      </Col>
      <Col span={12}>
        {user.accessToken !== undefined && <Button type='primary' onClick={() => navigate("/users/addMovie")}>Add Movie</Button>}
        </Col>
      </Row>
      </>
    );
  };

  const mapStateToProps = state => {
    return { 
      user: state,
    };
  }

  export default connect(mapStateToProps, { setUserId, setUserName, setUserLikes, setUserHates, clearState, setMovies })(Main);
  