import React, {useState} from 'react';
import {Layout, Typography, Button, message} from 'antd';
import {FolderOpenOutlined} from '@ant-design/icons';
import FileList from './FileList';
import RenameForm from './RenameForm';
import PreviewList from './PreviewList';

const {Header, Content, Footer} = Layout;
const {Title} = Typography;

const App = () => {
    const [currentDirectory, setCurrentDirectory] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewResults, setPreviewResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSelectDirectory = async () => {
        try {
            const paths = await window.electron.selectDirectory();
            if (paths && paths.length > 0) {
                const dirPath = paths[0];
                setCurrentDirectory(dirPath);
                setLoading(true);

                const fileList = await window.electron.getFiles(dirPath);
                if (fileList.error) {
                    message.error(`读取文件夹失败: ${fileList.error}`);
                } else {
                    // 过滤掉文件夹，只显示文件
                    const onlyFiles = fileList.filter(
                        file => !file.isDirectory
                    );
                    setFiles(onlyFiles);
                    setSelectedFiles([]);
                    setPreviewResults([]);
                }
            }
        } catch (error) {
            message.error(`选择文件夹失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = selectedRowKeys => {
        setSelectedFiles(selectedRowKeys);
        setPreviewResults([]);
    };

    const handlePreview = (searchValue, replaceValue, useRegex) => {
        if (!selectedFiles.length) {
            message.warning('请先选择要重命名的文件');
            return;
        }

        const results = [];

        selectedFiles.forEach(fileKey => {
            const file = files.find(f => f.path === fileKey);
            if (file) {
                let newName = file.name;

                if (useRegex) {
                    try {
                        const regex = new RegExp(searchValue, 'g');
                        newName = file.name.replace(regex, replaceValue);
                    } catch (error) {
                        message.error(`正则表达式错误: ${error.message}`);
                        return;
                    }
                } else {
                    newName = file.name.split(searchValue).join(replaceValue);
                }

                results.push({
                    oldPath: file.path,
                    oldName: file.name,
                    newName: newName,
                    changed: newName !== file.name,
                });
            }
        });

        setPreviewResults(results);
    };

    const handleRename = async () => {
        if (!previewResults.length) {
            message.warning('请先预览重命名结果');
            return;
        }

        const changedFiles = previewResults.filter(file => file.changed);

        if (!changedFiles.length) {
            message.info('没有文件需要重命名');
            return;
        }

        try {
            setLoading(true);
            const results = await window.electron.renameFiles(changedFiles);

            const successCount = results.filter(r => r.success).length;
            const failCount = results.length - successCount;

            if (failCount === 0) {
                message.success(`成功重命名 ${successCount} 个文件`);
            } else {
                message.warning(
                    `${successCount} 个文件重命名成功，${failCount} 个文件失败`
                );
            }

            // 重新加载文件列表
            const fileList = await window.electron.getFiles(currentDirectory);
            const onlyFiles = fileList.filter(file => !file.isDirectory);
            setFiles(onlyFiles);
            setSelectedFiles([]);
            setPreviewResults([]);
        } catch (error) {
            message.error(`重命名失败: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="app-container">
            <Header className="header">
                <Title level={3} style={{color: 'white', margin: 0}}>
                    NB-Rename
                </Title>
            </Header>
            <Content className="content">
                <Button
                    type="primary"
                    icon={<FolderOpenOutlined />}
                    onClick={handleSelectDirectory}
                    loading={loading}
                    style={{marginBottom: 16}}
                >
                    选择文件夹
                </Button>

                {currentDirectory && (
                    <Typography.Text style={{marginLeft: 16}}>
                        当前文件夹: {currentDirectory}
                    </Typography.Text>
                )}

                {files.length > 0 && (
                    <>
                        <RenameForm
                            onPreview={handlePreview}
                            loading={loading}
                        />

                        <FileList
                            files={files}
                            loading={loading}
                            selectedRowKeys={selectedFiles}
                            onSelectChange={handleFileSelect}
                        />

                        {previewResults.length > 0 && (
                            <>
                                <PreviewList previewResults={previewResults} />

                                <div className="file-actions">
                                    <Button
                                        type="primary"
                                        onClick={handleRename}
                                        loading={loading}
                                        disabled={
                                            !previewResults.some(
                                                file => file.changed
                                            )
                                        }
                                    >
                                        应用重命名
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </Content>
            <Footer className="footer">
                NB-Rename ©{new Date().getFullYear()} -
                跨平台批量文件重命名工具
            </Footer>
        </Layout>
    );
};

export default App;
