import { IconHelpCircle, IconLoading, IconPlus } from '@douyinfe/semi-icons';
import { IllustrationIdle, IllustrationIdleDark, IllustrationNoResult, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import { Button, Empty, Row, Spin } from '@douyinfe/semi-ui';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import intl from "react-intl-universal";
import SplitPane from 'react-split-pane';
import LeftTree from '../components/Connection';
import ConnectionModal from '../components/Connection/ConnectionModal';
import PedisHeader from '../components/Header';
import ConfigService from '../service/config';
import { Lang } from '../type.d.ts/Lang';
import tree from '../utils/tree';
import "./App.css";




function App({ lang, setLang, dispatch, connection }: Lang) {

  const [currentTab, setCurrentTab] = useState<string | null>(null);
  // const [record, setRecord] = useState<Map<string, any>>(new Map<string, any>());
  // const [visible, setVisible] = useState<boolean>(false);
  const { treeData, treeLoading } = connection;


  const onLoadConfig = async () => {
    const data = await ConfigService.readConfig()
    const treeData = tree.render(data, dispatch);
    dispatch({
      type: 'connection/save',
      payload: { treeData }
    })
  }

  useEffect(() => {
    onLoadConfig()
  }, [])

  // @ts-ignore
  return (
    <Row>
      <ConnectionModal lang={lang} />
      <PedisHeader lang={lang} setLang={setLang} />
      {/*
        // @ts-ignore */}
      <SplitPane className="pedis-split" split="vertical" minSize={200} defaultSize={300} maxSize={600}>
        <div className="leftTree">
          <Spin size="small" tip={intl.get("common.loading")} spinning={treeLoading} indicator={<IconLoading />}>
            {treeData.length > 0 ? <LeftTree treeData={treeData} /> : <div className="emptyTree">
              <Empty
                style={{ marginTop: '-24%' }}
                image={<IllustrationNoResult style={{ width: 120, height: 120 }} />}
                darkModeImage={<IllustrationNoResultDark style={{ width: 120, height: 120 }} />}
                title={intl.get("empty.no_connection_config")} description={intl.get("empty.no_connection_config.desc")}>
                <div style={{ textAlign: 'center' }}>
                  <Button onClick={() => {
                    setMode("create")
                    dispatch({
                      type: 'connection/save',
                      payload: { visible: true, currentConnection: { port: 6379 } }
                    })
                  }} type="secondary" icon={<IconPlus />} theme='light'>{intl.get("menu.create_conn")}</Button>
                </div>
              </Empty>
            </div>
            }
          </Spin>
        </div>
        {
          currentTab === null ? <div className='emptyTree'>
            <Empty
              style={{ marginTop: '-15%' }}
              image={<IllustrationIdle style={{ width: 180, height: 230 }} />}
              darkModeImage={<IllustrationIdleDark style={{ width: 180, height: 230 }} />}
              title={intl.get("empty.no_connection")}
              description={intl.get("empty.no_connection_desc")}
            >
              <div style={{ display: "flex" }}>
                <Button style={{ padding: '0 24px', marginRight: 12 }} type="primary" icon={<IconHelpCircle />}>
                  {intl.get("empty.see_document")}
                </Button>
                <Button style={{ padding: '0 24px' }} theme="solid" type="primary" icon={<IconPlus />} onClick={() => {
                  dispatch({
                    type: 'connection/save',
                    payload: { visible: true, currentConnection: { port: 6379 }, mode: "create" }
                  })
                }}>
                  {intl.get("empty.new_connection")}
                </Button>
              </div>
            </Empty>
          </div> : <div>

          </div>
        }
      </SplitPane>
    </Row>
  )
}

export default connect(({ connection }) => ({ connection }))(App)
