import React, { useState, useEffect, useRef } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { uploadImage, checkFileType, checkFileSize, compressImage } from '../services/uploadService'
import { message } from 'antd'

interface RichTextEditorProps {
    value?: string
    onChange?: (html: string) => void
    placeholder?: string
    height?: number
    readOnly?: boolean
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value = '',
    onChange,
    placeholder = '请输入内容...',
    height = 400,
    readOnly = false
}) => {
    // 编辑器实例，必须用 useRef
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const [html, setHtml] = useState(value)

    // 同步外部传入的value
    useEffect(() => {
        setHtml(value)
    }, [value])

    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: [
            'group-video',
            'fullScreen'
        ]
    }

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder,
        readOnly,
        autoFocus: false,
        MENU_CONF: {
            uploadImage: {
                // 自定义上传图片
                async customUpload(file: File, insertFn: any) {
                    try {
                        // 检查文件类型
                        if (!checkFileType(file)) {
                            message.error('只支持 JPG、PNG、GIF、WebP 格式的图片')
                            return
                        }

                        // 检查文件大小
                        if (!checkFileSize(file)) {
                            message.error('图片大小不能超过 5MB')
                            return
                        }

                        // 压缩图片
                        const compressedFile = await compressImage(file)

                        // 上传到服务器
                        const result = await uploadImage(compressedFile)

                        if (result.success) {
                            insertFn(result.data.url, file.name, result.data.url)
                            message.success('图片上传成功')
                        } else {
                            message.error(result.message || '图片上传失败')
                        }
                    } catch (error: any) {
                        console.error('图片上传失败:', error)
                        message.error(error.message || '图片上传失败')

                        // 如果上传失败，使用本地预览作为备选方案
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            const url = e.target?.result as string
                            insertFn(url, file.name, url)
                        }
                        reader.readAsDataURL(file)
                    }
                },
                // 限制图片大小
                maxFileSize: 5 * 1024 * 1024, // 5MB
                // 限制图片类型
                allowedFileTypes: ['image/*']
            }
        }
    }

    // 组件销毁时销毁编辑器
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    // 处理编辑器内容变化
    const handleChange = (editor: IDomEditor) => {
        const newHtml = editor.getHtml()
        setHtml(newHtml)
        onChange?.(newHtml)
    }

    return (
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
            <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{
                    borderBottom: '1px solid #d9d9d9',
                    backgroundColor: '#fafafa'
                }}
            />
            <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={handleChange}
                mode="default"
                style={{
                    height: height - 40,
                    backgroundColor: '#fff'
                }}
            />
        </div>
    )
}

export default RichTextEditor 