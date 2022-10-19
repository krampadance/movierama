import { Radio, Col, Row, Space } from 'antd';
import React from 'react';

const orderOptionsList = [
  {
    label: 'Likes',
    value: 'likes_count'
  },
  {
    label: 'Hates',
    value: 'hates_count'
  },
  {
    label: 'Date',
    value: 'created_at'
  },
  {
    label: 'None',
    value: 'none'
  }
];

function OrderOptions({ orderOption, setOrderOption, orderDirection, setOrderDirection }) {
  return (
    <div className="orderOptions">
      <Row>
        <Col>
          <Space>
            Order By:
            <Radio.Group
              options={orderOptionsList}
              onChange={({ target: { value } }) => {
                setOrderOption(value);
              }}
              value={orderOption}
              optionType="button"
            />
            <Radio.Group
              onChange={({ target: { value } }) => {
                setOrderDirection(value);
              }}
              value={orderDirection}>
              <Radio value="asc">Ascending</Radio>
              <Radio value="desc">Descending</Radio>
            </Radio.Group>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
export default OrderOptions;
