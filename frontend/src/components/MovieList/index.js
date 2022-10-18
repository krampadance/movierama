import { List } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import React from 'react';
import IconText from '../../components/IconText';
import { timeAgo } from '../../utils';
import { Link } from 'react-router-dom'


const getDescription = (id, firstName, lastName, created) => {
    return (
        <>
        Posted from <Link to={`/users/${id}`}>{firstName} {lastName}</Link> {timeAgo(created)}
        </>
    )
}

const MovieList = ({ data }) => {
    console.log(data)
    return (
        <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item) => {
              return (
                <List.Item
                    style={{margin: "10%"}}
                    key={item.id}
                    actions={[
                        <IconText 
                            icon={LikeOutlined}
                            text={item.likes_count}
                            ownerId={item.owner.id}
                            movieId={item.id}
                            key="list-vertical-like-o"
                        />,
                        <IconText 
                            icon={DislikeOutlined}
                            text={item.hates_count}
                            ownerId={item.owner.id}
                            movieId={item.id}
                            key="list-vertical-like-o"
                        />,
                    ]}
                >
                <List.Item.Meta
                  title={item.title}
                  description={getDescription(item.owner.id, item.owner.first_name, item.owner.last_name, item.created_at)}
                />
                <div>{item.description}</div>
              </List.Item>
          )}}
        />
    );
  };
  
  export default MovieList;
  