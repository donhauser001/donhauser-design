import React, { useState } from 'react'
import { Card, Button, Space, message } from 'antd'
import RichTextEditor from './RichTextEditor'
import SimpleRichTextEditor from './SimpleRichTextEditor'

const RichTextEditorTest: React.FC = () => {
    const [content, setContent] = useState('<p>这是初始内容</p>')

    const handleChange = (html: string) => {
        setContent(html)
        console.log('内容变化:', html)
    }

    const handleGetContent = () => {
        message.info(`当前内容长度: ${content.length}`)
        console.log('当前内容:', content)
    }

    const handleClear = () => {
        setContent('')
        message.success('内容已清空')
    }

    return (
        <div style={{ padding: 24 }}>
            <Card title="富文本编辑器测试" style={{ marginBottom: 16 }}>
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={handleGetContent}>获取内容</Button>
                    <Button onClick={handleClear}>清空内容</Button>
                </Space>
                
                <SimpleRichTextEditor
                    value={content}
                    onChange={handleChange}
                    placeholder="请输入测试内容..."
                    height={400}
                />
            </Card>

            <Card title="HTML 预览" style={{ marginBottom: 16 }}>
                <div 
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{ 
                        border: '1px solid #d9d9d9', 
                        padding: 16, 
                        minHeight: 100,
                        backgroundColor: '#fafafa'
                    }}
                />
            </Card>

            <Card title="原始 HTML">
                <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: 16, 
                    borderRadius: 4,
                    overflow: 'auto',
                    maxHeight: 200
                }}>
                    {content}
                </pre>
            </Card>
        </div>
    )
}

export default RichTextEditorTest 