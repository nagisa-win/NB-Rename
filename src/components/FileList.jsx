import React from 'react';
import {Table, Typography} from 'antd';
import {FileOutlined} from '@ant-design/icons';

const {Text} = Typography;

const FileList = ({files, loading, selectedRowKeys, onSelectChange}) => {
    const columns = [
        {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
            render: text => (
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <FileOutlined style={{marginRight: 8}} />
                    <Text>{text}</Text>
                </div>
            ),
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            width: 150,
            render: size => {
                const kb = size / 1024;
                const mb = kb / 1024;

                if (mb >= 1) {
                    return `${mb.toFixed(2)} MB`;
                }
                return `${kb.toFixed(2)} KB`;
            },
        },
        {
            title: '修改日期',
            dataIndex: 'lastModified',
            key: 'lastModified',
            width: 200,
            render: date => new Date(date).toLocaleString(),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="file-list">
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={files}
                rowKey="path"
                loading={loading}
                pagination={files.length > 50 ? {pageSize: 50} : false}
                size="middle"
                bordered
            />
        </div>
    );
};

export default FileList;
