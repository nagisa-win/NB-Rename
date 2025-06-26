import React from 'react';
import {Table, Typography, Tag} from 'antd';
import {SwapRightOutlined} from '@ant-design/icons';

const {Text} = Typography;

const PreviewList = ({previewResults}) => {
    const columns = [
        {
            title: '原文件名',
            dataIndex: 'oldName',
            key: 'oldName',
            render: text => <Text>{text}</Text>,
        },
        {
            title: '',
            key: 'arrow',
            width: 50,
            render: () => <SwapRightOutlined style={{fontSize: '16px'}} />,
        },
        {
            title: '新文件名',
            dataIndex: 'newName',
            key: 'newName',
            render: (text, record) => (
                <Text style={{color: record.changed ? '#52c41a' : '#999'}}>
                    {text}
                    {!record.changed && (
                        <Tag color="warning" style={{marginLeft: 8}}>
                            无变化
                        </Tag>
                    )}
                </Text>
            ),
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (_, record) =>
                record.changed ? (
                    <Tag color="success">将重命名</Tag>
                ) : (
                    <Tag color="default">不变</Tag>
                ),
        },
    ];

    return (
        <div className="preview-list">
            <Typography.Title level={4}>重命名预览</Typography.Title>
            <Table
                columns={columns}
                dataSource={previewResults}
                rowKey="oldPath"
                pagination={previewResults.length > 50 ? {pageSize: 50} : false}
                size="middle"
                bordered
            />
        </div>
    );
};

export default PreviewList;
