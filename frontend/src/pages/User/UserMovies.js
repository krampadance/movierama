import { Divider, Skeleton, Row, Col} from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MovieList from '../../components/MovieList';
import useToken from '../../Hooks/useToken';
import LoginButton from '../../components/LoginButton';
import { getUserMovies } from '../../services/apiCalls';
import { useParams } from 'react-router-dom'
import { getUserData } from '../../services/apiCalls';
import { Link } from 'react-router-dom';

const UserMovies = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const { token, setToken } = useToken();
    const [username, setUsername] = useState();
    const [loggedInUserId, setLoggedInUserId] = useState();
    const limit = 5;

    let { userId } = useParams();

    const loadUserData = () => {
      if (token === undefined) {
          return;
      }
      getUserData(token)
      .then(res => {
          setLoggedInUserId(res.data.id)
          setUsername(`${res.data.first_name} ${res.data.last_name}`)
      })
      .catch((e) => {
          console.log(e)
      })
    }

    const loadMoreData = () => {
      if (loading) {
        return;
      }
      setLoading(true);
      getUserMovies(userId, skip, limit)
      .then(res => {
          const movies = res.data
          if (movies.length !== 0) {
            setSkip(skip + limit)
          } 
          if (movies.length < limit) {
            setLoaded(true)
          }
          setData([...data, ...movies])
          setLoading(false)
      })
      .catch(() => {
          setLoading(false)
      })
    };
  
    useEffect(() => {
      loadUserData()
      loadMoreData();
    }, []);
    

    return (
     <>
      <Row> 
        <Col span={8} className='title'>Movierama</Col>
        {token === undefined && <Col span={8} offset={8}><LoginButton></LoginButton></Col>}
        {token !== undefined && <Col span={8} offset={10}><div>Welcome <Link to={`/users/${loggedInUserId}`}>{username}</Link></div></Col>}
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
  export default UserMovies;
  