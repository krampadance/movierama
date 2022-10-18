import { Space } from 'antd';
import React from 'react';
import { connect } from 'react-redux'
import { LikeOutlined } from '@ant-design/icons';
import { addLike, addHate } from '../../services/apiCalls';


const IconText = ({ icon, text, movieId, ownerId, userLikes, userHates, userId, accessToken }) => {
  if (ownerId === userId || userId === undefined) {
    return (
      <Space>
      {React.createElement(icon)}
      {text}
    </Space>
    )
  }

  const votes = icon === LikeOutlined ? userLikes : userHates;
  const color =  votes.includes(movieId) ? "blue" : "black"
  
  return (
    <Space>
      {React.createElement(icon, { 
        style: {
          color: color
      },
        onClick: () => {
          if (icon === LikeOutlined) {
            return addLike(movieId, accessToken)
          } 
          return addHate(movieId, accessToken)
        }})}
      {text}
    </Space>
  );
}

const mapStateToProps = state => {
  return { 
    userLikes: state.userLikes,
    userHates: state.userHates,
    userId: state.userId,
    accessToken: state.accessToken
  };
}

const mapDispatchToProps = {
  // ... normally is an object full of action creators
}

export default connect(mapStateToProps)(IconText);