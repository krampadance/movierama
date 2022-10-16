import { List } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import React from 'react';
import IconText from '../../components/IconText';

const MovieList = (props) => {
    return (
        <List
        dataSource={props.data}
        renderItem={(item) => (
            <List.Item 
                key={item.id}
                actions={[
                    <IconText icon={LikeOutlined} text={item.likes_count} key="list-vertical-like-o" />,
                    <IconText icon={DislikeOutlined} text={item.hates_count} key="list-vertical-hate" />,
                ]}
            >
            <List.Item.Meta
                title={item.title}
                description={item.description}
            />
            <div>Content</div>
            </List.Item>
        )}
        />
    );
  };
  export default MovieList;
  