import { IconMapPin } from '@douyinfe/semi-icons';
import { Col, Row, Tree } from '@douyinfe/semi-ui';
import { useState } from 'react';
import LeftTree from '../components/Connection';
import PedisHeader from '../components/Header';

function App() {
  return (
    <Row>
      <PedisHeader />
      <Col span={8}>
        <LeftTree />
      </Col>
      <Col span={16}>
      </Col>
    </Row>
  )
}

export default App
