import React from 'react';
import { Typography, Table, Tag, Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

// 基础占位符定义
export const BASE_PLACEHOLDERS = [
    // 基本信息
    { key: '{form_title}', label: '表单标题', category: '基本信息' },
    { key: '{form_description}', label: '表单描述', category: '基本信息' },
    { key: '{submission_id}', label: '提交ID', category: '基本信息' },
    { key: '{submission_date}', label: '提交日期', category: '基本信息' },
    { key: '{submission_time}', label: '提交时间', category: '基本信息' },

    // 提交者信息
    { key: '{submitter_ip}', label: '提交者IP', category: '提交者信息' },
    { key: '{submitter_email}', label: '提交者邮箱', category: '提交者信息' },
    { key: '{submitter_name}', label: '提交者姓名', category: '提交者信息' },
    { key: '{submitter_username}', label: '提交者用户名', category: '提交者信息' },
    { key: '{submitter_company}', label: '提交者单位', category: '提交者信息' },
    { key: '{submitter_enterprise}', label: '提交者企业', category: '提交者信息' },
    { key: '{submitter_department}', label: '提交者部门', category: '提交者信息' },
    { key: '{submitter_position}', label: '提交者职位', category: '提交者信息' },
    { key: '{submitter_phone}', label: '提交者电话', category: '提交者信息' },
    { key: '{submitter_role}', label: '提交者角色', category: '提交者信息' },

    // 系统信息
    { key: '{admin_email}', label: '管理员邮箱', category: '系统信息' },
    { key: '{site_title}', label: '网站标题', category: '系统信息' },
    { key: '{site_url}', label: '网站地址', category: '系统信息' }
];

interface PlaceholderSelectorProps {
    components?: any[];
    onPlaceholderInsert: (placeholder: string) => void;
    height?: number;
    style?: React.CSSProperties;
    matchRichTextEditor?: boolean; // 是否匹配富文本编辑器的内容区域高度
}

const PlaceholderSelector: React.FC<PlaceholderSelectorProps> = ({
    components = [],
    onPlaceholderInsert,
    height = 400,
    style = {},
    matchRichTextEditor = false
}) => {
    // 如果传入了style.height，使用它；否则使用height属性或自适应
    const actualHeight = style.height || (matchRichTextEditor ? height - 40 : height);
    // 将标签名称转换为简洁的占位符格式
    const labelToPlaceholder = (label: string): string => {
        // 移除特殊字符，保留中文、英文、数字
        return label
            .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')  // 只保留中文、英文、数字
            .toLowerCase();  // 转换为小写
    };

    // 从表单组件生成字段占位符
    const getFieldPlaceholders = () => {
        if (!components || components.length === 0) return [];

        const usedPlaceholders = new Set<string>(); // 防止重复的占位符

        const fieldPlaceholders = components
            .filter((component: any) => {
                // 过滤掉不需要生成占位符的组件类型
                const excludeTypes = ['divider', 'html', 'steps', 'group', 'columnContainer'];
                return !excludeTypes.includes(component.type);
            })
            .map((component: any) => {
                // 优先使用组件的标签，然后是占位符，最后是类型默认值
                let label = component.label || component.placeholder;
                if (!label) {
                    const typeLabels: Record<string, string> = {
                        'input': '输入框',
                        'textarea': '多行文本',
                        'number': '数字',
                        'select': '下拉选择',
                        'radio': '单选',
                        'checkbox': '复选框',
                        'date': '日期',
                        'upload': '文件上传',
                        'slider': '滑块',
                        'client': '客户',
                        'contact': '联系人',
                        'project': '项目',
                        'quotation': '报价',
                        'amount': '金额',
                        'amountInWords': '金额大写',
                        'contractName': '合同名称',
                        'contractParty': '合同方',
                        'signature': '签名',
                        'article': '文章'
                    };
                    label = typeLabels[component.type] || `${component.type}字段`;
                }

                // 生成基于标签的占位符
                let placeholder = labelToPlaceholder(label);

                // 如果占位符已存在，添加数字后缀
                let finalPlaceholder = placeholder;
                let counter = 1;
                while (usedPlaceholders.has(finalPlaceholder)) {
                    finalPlaceholder = `${placeholder}${counter}`;
                    counter++;
                }
                usedPlaceholders.add(finalPlaceholder);

                return {
                    key: `{${finalPlaceholder}}`,
                    label: label,
                    category: '表单字段',
                    originalId: component.id  // 保留原始ID用于映射
                };
            });

        return fieldPlaceholders;
    };

    const allPlaceholders = [...BASE_PLACEHOLDERS, ...getFieldPlaceholders()];

    // 按类别分组占位符
    const groupedPlaceholders = allPlaceholders.reduce((groups, placeholder) => {
        const category = placeholder.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(placeholder);
        return groups;
    }, {} as Record<string, typeof allPlaceholders>);

    // 生成下载文档内容
    const generatePlaceholderDocument = () => {
        const currentDate = new Date().toLocaleDateString('zh-CN');
        let content = `表单占位符参考文档\n`;
        content += `生成时间：${currentDate}\n`;
        content += `===========================================\n\n`;

        content += `使用说明：\n`;
        content += `1. 占位符格式为 {占位符名称}\n`;
        content += `2. 在邮件模板中直接使用这些占位符\n`;
        content += `3. 系统会在发送邮件时自动替换为实际值\n\n`;

        Object.entries(groupedPlaceholders).forEach(([category, placeholders]) => {
            content += `${category}\n`;
            content += `${'-'.repeat(category.length * 2)}\n`;

            placeholders.forEach(placeholder => {
                content += `${placeholder.label.padEnd(20)} : ${placeholder.key}\n`;
            });
            content += `\n`;
        });

        content += `\n示例模板：\n`;
        content += `===========================================\n`;
        content += `亲爱的 {submitter_name}，\n\n`;
        content += `感谢您提交表单"{form_title}"。\n\n`;
        content += `提交信息：\n`;
        content += `- 提交编号：{submission_id}\n`;
        content += `- 提交时间：{submission_date} {submission_time}\n`;

        // 如果有表单字段，添加示例
        const fieldPlaceholders = getFieldPlaceholders();
        if (fieldPlaceholders.length > 0) {
            content += `\n表单内容：\n`;
            fieldPlaceholders.slice(0, 3).forEach(placeholder => {
                content += `- ${placeholder.label}：${placeholder.key}\n`;
            });
            if (fieldPlaceholders.length > 3) {
                content += `- ...\n`;
            }
        }

        content += `\n我们会尽快处理您的请求。\n\n`;
        content += `谢谢！\n`;
        content += `{site_title}\n`;

        return content;
    };

    // 下载占位符文档
    const handleDownloadPlaceholders = () => {
        const content = generatePlaceholderDocument();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `表单占位符参考-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Text strong>可用占位符</Text>
                    <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                        点击插入
                    </Text>
                </div>
                <Button
                    type="text"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadPlaceholders}
                    style={{ fontSize: '12px', padding: '0 4px' }}
                    title="下载占位符参考文档"
                >
                    下载
                </Button>
            </div>
            <div style={{
                height: actualHeight,
                overflowY: 'auto',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                backgroundColor: '#fafafa',
                ...style
            }}>
                {Object.entries(groupedPlaceholders).map(([category, placeholders]) => (
                    <div key={category} style={{ marginBottom: '16px' }}>
                        <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#e6f7ff',
                            borderBottom: '1px solid #d9d9d9',
                            marginBottom: '0'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>
                                {category}
                            </Text>
                        </div>
                        <Table
                            size="small"
                            pagination={false}
                            showHeader={false}
                            dataSource={placeholders.map(placeholder => ({
                                key: placeholder.key,
                                label: placeholder.label,
                                placeholder: placeholder.key
                            }))}
                            columns={[
                                {
                                    title: '组件名称',
                                    dataIndex: 'label',
                                    width: '45%',
                                    render: (text) => (
                                        <Text style={{ fontSize: '12px' }}>{text}</Text>
                                    )
                                },
                                {
                                    title: '占位符',
                                    dataIndex: 'placeholder',
                                    width: '35%',
                                    render: (text) => (
                                        <Tag
                                            style={{
                                                fontSize: '10px',
                                                margin: 0,
                                                fontFamily: 'monospace'
                                            }}
                                            color="geekblue"
                                        >
                                            {text}
                                        </Tag>
                                    )
                                },
                                {
                                    title: '操作',
                                    width: '20%',
                                    render: (_, record) => (
                                        <Button
                                            type="link"
                                            size="small"
                                            style={{
                                                padding: '0',
                                                fontSize: '12px',
                                                height: 'auto'
                                            }}
                                            onClick={() => onPlaceholderInsert(record.placeholder)}
                                        >
                                            插入
                                        </Button>
                                    )
                                }
                            ]}
                            style={{
                                backgroundColor: '#fff'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaceholderSelector;
