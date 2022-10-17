import { Radio, Col } from 'antd';
import React, { useState } from 'react';
import useOrderOption from '../../Hooks/useOrderOption';

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

const OrderOptions = () => {
  const {orderOption, setOrderOption} = useOrderOption();
  
  const selectOrderOption = ({ target: { value } }) => {
    setOrderOption(value);
  };
  
  return (
    <>
      <Col>Order By</Col>
      <Col offset={2}><Radio.Group options={options} onChange={selectOrderOption} value={orderOption} optionType="button" /></Col>
    </>
  );
};
export default OrderOptions;
