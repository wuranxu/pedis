import { Col, Pagination, Row } from '@douyinfe/semi-ui';
import LeftTree from '../components/Connection';
import PedisHeader from '../components/Header';
import { Lang } from '../type.d.ts/Lang';




function App(lang: Lang) {
  return (
    <Row>
      <PedisHeader {...lang} />
      <Col span={8}>
        <LeftTree />
      </Col>
      <Col span={16}>
        <Pagination total={100} showTotal showSizeChanger style={{ margin: 20 }} />
      </Col>
    </Row>
  )
}

export default App
