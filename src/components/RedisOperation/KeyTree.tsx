import { IconSearch, IconTerminal } from '@douyinfe/semi-icons';
import { Col, Input, List, Row } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import "./KeyTree.css";

const KeyTree = () => {

    const data = [
        '围城',
        '平凡的世界（全三册）',
        '三体（全集）',
        '雪中悍刀行（全集）',
        '撒哈拉的故事',
        '明朝那些事',
        '一禅小和尚',
        '沙丘',
        '被讨厌的勇气',
        '罪与罚',
    ];

    const [list, setList] = useState(data);

    const onSearch = (string) => {
        let newList;
        if (string) {
            newList = data.filter(item => item.includes(string));
        } else {
            newList = data;
        }
        setList(newList);
    };
    
    return (
        <div style={{height: '100%'}}>
        <div style={{ display: 'flex', height: '100%', borderLeft: 'none', flexWrap: 'wrap', border: '1px solid var(--semi-color-border)' }}>
            <List
                dataSource={list}
                split={false}
                header={<Input onCompositionEnd={(v) => onSearch(v.target.value)} onChange={(v) => !v ? onSearch() : null} placeholder='搜索' prefix={<IconSearch />} />}
                size='small'
                style={{ flexBasis: '100%', flexShrink: 0, borderBottom: '1px solid var(--semi-color-border)' }}
                renderItem={item =>
                    <List.Item className='list-item'>{item}</List.Item>
                }
            />
            </div>
        </div>
        // <div className="keyLeft">
        //     <Row className="keyLeftTop">
        //         <Col span={20}>
        //             <Input placeholder="请输入redis key" />
        //         </Col>
        //         <Col span={4}>
        //             <IconTerminal />
        //         </Col>

        //     </Row>
        // </div>
    )
}

export default KeyTree;