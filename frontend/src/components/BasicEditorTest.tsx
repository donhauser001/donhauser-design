import React, { useState, useEffect } from 'react'
import { Card, Button, Space, message } from 'antd'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

const BasicEditorTest: React.FC = () => {
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const [html, setHtml] = useState('<p>hello</p>')

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...'
    }

    // 组件销毁时销毁编辑器
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    const handleGetContent = () => {
        if (editor == null) return
        const content = editor.getHtml()
        message.info(`内容: ${content}`)
        console.log('编辑器内容:', content)
    }

    const handleSetContent = () => {
        if (editor == null) return
        editor.setHtml('<p>这是设置的新内容</p>')
        message.success('内容已设置')
    }

    return (
        <div style={{ padding: 24 }}>
            <Card title="基础富文本编辑器测试" style={{ marginBottom: 16 }}>
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={handleGetContent}>获取内容</Button>
                    <Button onClick={handleSetContent}>设置内容</Button>
                </Space>
                
                <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                    <Toolbar
                        editor={editor}
                        defaultConfig={toolbarConfig}
                        mode="default"
                        style={{ borderBottom: '1px solid #ccc' }}
                    />
                    <Editor
                        defaultConfig={editorConfig}
                        value={html}
                        onCreated={setEditor}
                        onChange={editor => setHtml(editor.getHtml())}
                        mode="default"
                        style={{ height: 300 }}
                    />
                </div>
            </Card>

            <Card title="HTML 预览">
                <div 
                    dangerouslySetInnerHTML={{ __html: html }}
                    style={{ 
                        border: '1px solid #d9d9d9', 
                        padding: 16, 
                        minHeight: 100,
                        backgroundColor: '#fafafa'
                    }}
                />
            </Card>
        </div>
    )
}

export default BasicEditorTest 