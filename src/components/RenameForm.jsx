import React, {useState} from 'react';
import {Form, Input, Button, Checkbox, Card, Tooltip} from 'antd';
import {SearchOutlined, QuestionCircleOutlined} from '@ant-design/icons';

const RenameForm = ({onPreview, loading}) => {
    const [form] = Form.useForm();
    const [useRegex, setUseRegex] = useState(false);

    const handlePreview = () => {
        const values = form.getFieldsValue();
        onPreview(values.searchValue, values.replaceValue, useRegex);
    };

    return (
        <Card className="rename-form">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    searchValue: '',
                    replaceValue: '',
                }}
            >
                <Form.Item
                    label={
                        <span>
                            查找内容
                            {useRegex && (
                                <Tooltip title="使用正则表达式语法，例如 \d+ 匹配一个或多个数字">
                                    <QuestionCircleOutlined
                                        style={{marginLeft: 8}}
                                    />
                                </Tooltip>
                            )}
                        </span>
                    }
                    name="searchValue"
                    rules={[{required: true, message: '请输入要查找的内容'}]}
                >
                    <Input
                        placeholder={
                            useRegex ? '输入正则表达式' : '输入要查找的文本'
                        }
                    />
                </Form.Item>

                <Form.Item label="替换为" name="replaceValue">
                    <Input placeholder="输入替换后的文本" />
                </Form.Item>

                <Form.Item>
                    <Checkbox
                        checked={useRegex}
                        onChange={e => setUseRegex(e.target.checked)}
                    >
                        使用正则表达式
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handlePreview}
                        loading={loading}
                    >
                        预览重命名结果
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default RenameForm;
