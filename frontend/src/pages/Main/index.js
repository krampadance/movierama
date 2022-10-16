import { Divider, Skeleton, Button, Row, Col} from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import './Main.css';
import MovieList from '../../components/MovieList';
import useToken from '../../services/useToken';
import LoginButton from '../../components/LoginButton';
import { getMovies } from '../../services/apiCalls';

const Main = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const { token, setToken, getToken } = useToken();

    const limit = 5;
    
    const loadMoreData = () => {
      if (loading) {
        return;
      }
      setLoading(true);
      
      getMovies(skip, limit)
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
      loadMoreData();
    }, []);
    

    return (
     <>
      <Row> 
        <Col span={8} className='title'>Movierama</Col>
        {getToken() !== 0 && <Col span={8} offset={8}><LoginButton></LoginButton></Col>}
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
        {token !== undefined && <Button type='primary'>Add Movie</Button>}
        </Col>
      </Row>
      </>
    );
  };
  export default Main;
  