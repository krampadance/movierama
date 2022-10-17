import { Divider, Skeleton, Button, Row, Col, Radio} from 'antd';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Main.css';
import MovieList from '../../components/MovieList';
import useToken from '../../Hooks/useToken';
import LoginButton from '../../components/LoginButton';
import { getMovies, getUserData } from '../../services/apiCalls';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignUpButton from '../../components/SignUpButton';
import { showError } from '../../utils';
import { connect } from 'react-redux'
import { setUserId, setUserName, setUserHates, setUserLikes, clearState } from '../../redux/actions';


const options = [
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
  ];

const Main = ({ user, setUserId, setUserName, setUserHates, setUserLikes, clearState }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const { token, setToken } = useToken();
    const [orderDirection, setOrderDirection] = useState("desc")
    const [orderOption, setOrderOption] = useState("likes_count");
    const navigate = useNavigate();

    const limit = 2;
    
    const selectOrderOption = ({ target: { value } }) => {
        setData([])
        setSkip(0)
        loadMoreData()
        setOrderOption(value);
      };

    const loadUserData = async () => {
        if (token === undefined) {
            return;
        }
        try {
            const res = await getUserData(token)
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
        const res = await getMovies(skip, limit, orderOption, 'desc')
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

    // useEffect(() => {
    //     console.log('reload')
    //     setData([])
    //     setSkip(0)
    //     setLoaded(false)
    //     // loadMoreData()
    //   }, [orderOption]);
    


    return (
     <>
      <Row> 
        <Col span={8} className='title'>Movierama</Col>
        {token === undefined && <Col span={8} offset={7}><LoginButton></LoginButton><SignUpButton></SignUpButton></Col>}
        {
          token !== undefined && (
            <Col span={8} offset={10}>
              <div>Welcome <Link to={`users/${user.userId}`}>{user.userName}</Link> | 
              <a onClick={() => {
                setToken({access_token: undefined})
                clearState()
              }}>Logout</a></div>
            </Col>
          )
        }
      </Row>
      <Row>
      <Col>Order By</Col>
      <Col offset={2}><Radio.Group options={options} onChange={selectOrderOption} value={orderOption} optionType="button" /></Col>
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
        {token !== undefined && <Button type='primary' onClick={() => navigate("/users/addMovie")}>Add Movie</Button>}
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

  export default connect(mapStateToProps, { setUserId, setUserName, setUserLikes, setUserHates, clearState })(Main);
  