import { Space } from 'antd';
import React from 'react';
import { connect } from 'react-redux'
import { LikeOutlined } from '@ant-design/icons';
import { addLike, addHate } from '../../services/apiCalls';
import useToken from '../../Hooks/useToken';



const IconText = ({ icon, text, movieId, ownerId, userLikes, userHates, userId }) => {

  const { token } = useToken();
  // Token is not changing quickly after logout
  if (ownerId === userId || token === undefined) {
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
            return addLike(movieId, token)
          } 
          return addHate(movieId, token)
        }})}
      {text}
    </Space>
  );
}

const mapStateToProps = state => {
  return { 
    userLikes: state.userLikes,
    userHates: state.userHates,
    userId: state.userId
  };
}

const mapDispatchToProps = {
  // ... normally is an object full of action creators
}

export default connect(mapStateToProps)(IconText);