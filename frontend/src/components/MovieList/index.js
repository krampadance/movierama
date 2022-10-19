import { List } from 'antd';
import React from 'react';
import MovieItem from './MovieItem';

function MovieList({ data }) {
  return (
    <List
      itemLayout="vertical"
      dataSource={data}
      renderItem={(item) => <MovieItem item={item} />}
    />
  );
}

export default MovieList;
