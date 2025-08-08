import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { message } from 'antd'
import { uploadImage } from '../services/uploadService'

interface EnhancedRichTextEditorProps {
    value?: string
    onChange?: (html: string) => void
    placeholder?: string
    height?: number
}

const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
    value = '',
    onChange,
    placeholder = '请输入内容...',
    height = 400
}) => {
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const [html, setHtml] = useState(value)

    // 同步外部传入的value
    useEffect(() => {
        setHtml(value)
    }, [value])

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

    // 工具栏配置 - 确保包含所有需要的功能
    const toolbarConfig: Partial<IToolbarConfig> = {
        excludeKeys: [
            'group-video',
            'fullScreen'
        ]
    }

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder,
        autoFocus: false,
        MENU_CONF: {
            uploadImage: {
                // 自定义上传图片
                async customUpload(file: File, insertFn: any) {
                    try {
                        // 检查文件类型
                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
                        if (!allowedTypes.includes(file.type)) {
                            message.error('只支持 JPG、PNG、GIF、WebP 格式的图片')
                            return
                        }

                        // 检查文件大小 (5MB)
                        if (file.size > 5 * 1024 * 1024) {
                            message.error('图片大小不能超过 5MB')
                            return
                        }

                        // 压缩图片（如果需要）
                        let processedFile = file
                        if (file.size > 1 * 1024 * 1024) { // 大于1MB的图片进行压缩
                            try {
                                processedFile = await compressImage(file)
                            } catch (error) {
                                console.warn('图片压缩失败，使用原图:', error)
                            }
                        }

                        // 上传到服务器
                        try {
                            const result = await uploadImage(processedFile)
                            if (result.success) {
                                insertFn(result.data.url, file.name, result.data.url)
                                message.success('图片上传成功')
                            } else {
                                message.error(result.message || '图片上传失败')
                            }
                        } catch (uploadError) {
                            console.error('服务器上传失败，使用本地预览:', uploadError)
                            // 如果服务器上传失败，使用本地预览作为备选方案
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const url = e.target?.result as string
                                insertFn(url, file.name, url)
                                message.success('图片插入成功（本地预览）')
                            }
                            reader.readAsDataURL(processedFile)
                        }
                    } catch (error: any) {
                        console.error('图片上传失败:', error)
                        message.error('图片上传失败')
                    }
                },
                // 限制图片大小
                maxFileSize: 5 * 1024 * 1024, // 5MB
                // 限制图片类型
                allowedFileTypes: ['image/*']
            },
            insertTable: {
                // 表格配置
                maxRow: 10,
                maxCol: 10
            },
            codeBlock: {
                // 代码块配置
                languages: [
                    { text: 'HTML', value: 'html' },
                    { text: 'CSS', value: 'css' },
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'TypeScript', value: 'typescript' },
                    { text: 'Python', value: 'python' },
                    { text: 'Java', value: 'java' },
                    { text: 'C++', value: 'cpp' },
                    { text: 'C#', value: 'csharp' },
                    { text: 'PHP', value: 'php' },
                    { text: 'SQL', value: 'sql' },
                    { text: 'JSON', value: 'json' },
                    { text: 'XML', value: 'xml' },
                    { text: 'Markdown', value: 'markdown' }
                ]
            }
        }
    }

    // 图片压缩函数
    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                // 计算新的尺寸
                let { width, height } = img
                const maxWidth = 1200
                const maxHeight = 1200

                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }

                if (height > maxHeight) {
                    width = (width * maxHeight) / height
                    height = maxHeight
                }

                canvas.width = width
                canvas.height = height

                // 绘制图片
                ctx?.drawImage(img, 0, 0, width, height)

                // 转换为blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now()
                            })
                            resolve(compressedFile)
                        } else {
                            reject(new Error('图片压缩失败'))
                        }
                    },
                    file.type,
                    0.8 // 压缩质量
                )
            }

            img.onerror = () => {
                reject(new Error('图片加载失败'))
            }

            img.src = URL.createObjectURL(file)
        })
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

export default EnhancedRichTextEditor 