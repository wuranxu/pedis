import { IconHelpCircle, IconPlus } from '@douyinfe/semi-icons';
import { IllustrationIdle, IllustrationIdleDark } from '@douyinfe/semi-illustrations';
import { Button, Empty, Row } from '@douyinfe/semi-ui';
import { useState } from 'react';
import intl from "react-intl-universal";
import SplitPane from 'react-split-pane';
import LeftTree from '../components/Connection';
import ConnectionModal from '../components/Connection/ConnectionModal';
import PedisHeader from '../components/Header';
import { Lang } from '../type.d.ts/Lang';
import "./App.css";




function App(lang: Lang) {

  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [mode, setMode] = useState<string>('create');
  const [record, setRecord] = useState<Map<string, any>>(new Map<string, any>());
  const [visible, setVisible] = useState<boolean>(false);

  // @ts-ignore
  return (
    <Row>
      <ConnectionModal mode={mode} onClose={() => { setVisible(false) }} record={record} visible={visible} />
      <PedisHeader {...lang} />
        {/*
        // @ts-ignore */}
      <SplitPane className="pedis-split" split="vertical" minSize={200} defaultSize={260} maxSize={600}>
        <div style={{ height: '100%' }}>
          <LeftTree />
        </div>
        {
          currentTab === null ? <div style={{ height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Empty
              style={{ marginTop: -24 }}
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
                  setVisible(true)
                  setMode("create")
                  setRecord(new Map<string, any>);
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

export default App
