# NB-Rename

一个跨平台的批量文件重命名工具，类似于Windows的PowerToys中的Power Rename功能。

## 功能特点

- 跨平台支持：可在Windows、macOS和Linux上运行
- 批量重命名文件
- 支持正则表达式
- 实时预览重命名结果
- 简洁直观的用户界面

## 技术栈

- Electron：跨平台桌面应用框架
- React：用户界面库
- Ant Design：UI组件库

## 开发

### 环境要求

- Node.js 20.0.0 或更高版本
- pnpm 8.0.0 或更高版本

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm run build
```

### 构建应用

构建所有平台：

```bash
pnpm run package
```

仅构建macOS版本：

```bash
pnpm run package:mac
```

仅构建Windows版本：

```bash
pnpm run package:win
```

仅构建Linux版本：

```bash
pnpm run package:linux
```

## 使用方法

1. 点击"选择文件夹"按钮，选择包含要重命名文件的文件夹
2. 在文件列表中选择要重命名的文件
3. 在"查找内容"字段中输入要查找的文本
4. 在"替换为"字段中输入替换后的文本
5. 如果需要使用正则表达式，勾选"使用正则表达式"选项
6. 点击"预览重命名结果"按钮查看预览
7. 确认无误后，点击"应用重命名"按钮执行重命名操作

## 许可证

MIT