import { List } from 'antd';
import React from 'react';
import MovieItem from './MovieItem';


const MovieList = ({ data }) => {
    return (
        <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item) => { return (<MovieItem item={item}></MovieItem>) }
        }
        />
    );
  };

  export default MovieList;
  