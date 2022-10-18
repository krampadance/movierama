import { List, Space, Button } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { timeAgo } from '../../utils';
import { addMovieLike, addMovieHate } from '../../services/apiCalls';
import {
  setUserHates,
  setUserLikes,
  addHate,
  addLike,
  removeHate,
  removeLike
} from '../../redux/actions';

const getDescription = (id, firstName, lastName, created) => (
  <>
    Posted from{' '}
    <Link to={`/users/${id}`}>
      {firstName} 
{' '}
{lastName}
    </Link>{' '}
    {timeAgo(created)}
  </>
);

function MovieItem({
  item,
  ownerId,
  userLikes,
  userHates,
  userId,
  accessToken,
  setUserHates,
  setUserLikes,
  addHate,
  addLike,
  removeHate,
  removeLike,
  movieCounts
}) {
  const [likeIconColor, setLikeIconColor] = useState();
  const [dislikeIconColor, setDislikeIconColor] = useState();

  const voteLike = (movieId) => {
    console.log('like vote');
    let index = userLikes.indexOf(movieId);
    if (index > -1) {
      // Remove liked movie
      setLikeIconColor('black');
      removeLike(movieId);
      userLikes.splice(index, 1);
    } else {
      // Add liked movie to userLikes
      userLikes.push(movieId);
      addLike(movieId);
      setLikeIconColor('blue');
      // Check if it was hated and then remove
      index = userHates.indexOf(movieId);
      if (index > -1) {
        userHates.splice(index, 1);
        setDislikeIconColor('black');
        setUserHates(userHates);
        removeHate(movieId);
      }
    }
    setUserLikes(userLikes);
    return addMovieLike(movieId, accessToken);
  };

  const voteHate = (movieId) => {
    console.log('hate vote');
    let index = userHates.indexOf(movieId);
    if (index > -1) {
      // Remove hated movie
      setDislikeIconColor('black');
      removeHate(movieId);
      userHates.splice(index, 1);
    } else {
      // Add hated movie to userLikes
      userHates.push(movieId);
      addHate(movieId);
      setDislikeIconColor('blue');
      // Check if it was liked and then remove
      index = userLikes.indexOf(movieId);
      if (index > -1) {
        userLikes.splice(index, 1);
        setLikeIconColor('black');
        setUserLikes(userLikes);
        removeLike(movieId);
      }
    }
    setUserHates(userHates);
    return addMovieHate(movieId, accessToken);
  };

  useEffect(() => {
    setLikeIconColor(userLikes.includes(item.id) ? 'blue' : 'black');
    setDislikeIconColor(userHates.includes(item.id) ? 'blue' : 'black');
  }, [userId]);

  return (
    <List.Item
      style={{ margin: '10%' }}
      key={item.id}
      actions={[
        <Space>
          <Button
            type="primary"
            ghost
            icon={<LikeOutlined />}
            style={{
              color: likeIconColor,
              border: '0px'
            }}
            onClick={() => voteLike(item.id)}
            disabled={!userId || userId === item.owner.id}
          />
          {movieCounts[item.id]?.likesCount}
        </Space>,
        <Space>
          <Button
            type="primary"
            ghost
            icon={<DislikeOutlined />}
            style={{
              color: dislikeIconColor,
              border: '0px'
            }}
            onClick={() => voteHate(item.id)}
            disabled={!userId || userId === item.owner.id}
          />
          {movieCounts[item.id]?.hatesCount}
        </Space>
      ]}>
      <List.Item.Meta
        title={item.title}
        description={getDescription(
          item.owner.id,
          item.owner.first_name,
          item.owner.last_name,
          item.created_at
        )}
      />
      <div>{item.description}</div>
    </List.Item>
  );
}

const mapStateToProps = (state) => ({
  userLikes: state.userLikes,
  userHates: state.userHates,
  userId: state.userId,
  accessToken: state.accessToken,
  movieCounts: state.movies
});

export default connect(mapStateToProps, {
  setUserHates,
  setUserLikes,
  addLike,
  addHate,
  removeLike,
  removeHate
})(MovieItem);
