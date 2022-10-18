import { Divider, Skeleton, Row, Col} from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from '../../components/MovieList';
import LoginButton from '../../components/LoginButton';
import SignUpButton from '../../components/SignUpButton';
import { getUserMovies } from '../../services/apiCalls';
import { useParams } from 'react-router-dom'
import { getUserData } from '../../services/apiCalls';
import { Link } from 'react-router-dom';
import { showError } from '../../utils';
import { connect } from 'react-redux'
import { setUserId, setUserName, setUserHates, setUserLikes, clearState } from '../../redux/actions';

const UserMovies = ({ user, setUserId, setUserName, setUserHates, setUserLikes, clearState }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [orderOption, setOrderOption] = useState("likes_count")
    const limit = 5;

    let { id } = useParams();

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

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await getUserMovies(id, skip, limit, orderOption, 'desc')
      const movies = res.data;
      if (movies.length !== 0) {
        setSkip(skip + limit)
      } 
      if (movies.length < limit) {
        setLoaded(true)
      }
      setData([...data, ...movies])
      setLoading(false)
    } catch (e) {
      setLoading(false)
      showError("Error loading movie data", e.response.data.detail || e)
    }
  };

  useEffect(() => {
    loadUserData();
    loadMoreData();
  }, []);
    

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
              }}>Logout</a></div>
            </Col>
          )
        }
      </Row>
      
      <Row>
        <Col id="scrollableDiv" style={{
            height: '400px',
            width: '60%',
            overflow: 'auto',
            padding: '8px 24px',
          }}>
            <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={loaded == false}
          loader={
            <Skeleton
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>End of list</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <MovieList data={data}/>
        </InfiniteScroll>
        </Col>
        <Col>
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

  export default connect(mapStateToProps, { setUserId, setUserName, setUserLikes, setUserHates, clearState })(UserMovies);