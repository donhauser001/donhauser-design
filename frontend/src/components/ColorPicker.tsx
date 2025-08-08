import React, { useState } from 'react'
import { Popover, Button, Input, Space, Row, Col } from 'antd'
import { BgColorsOutlined } from '@ant-design/icons'

interface ColorPickerProps {
    value?: string
    onChange?: (color: string) => void
    placeholder?: string
}

// 常用颜色列表
const commonColors = [
    // 主色调
    '#1890ff', // 蓝色
    '#52c41a', // 绿色
    '#faad14', // 橙色
    '#f5222d', // 红色
    '#722ed1', // 紫色
    '#13c2c2', // 青色
    '#eb2f96', // 粉色
    '#fa8c16', // 橙色
    '#a0d911', // 青绿色
    '#2f54eb', // 深蓝色
    '#fa541c', // 红橙色
    '#fadb14', // 黄色
    
    // 扩展颜色
    '#9254de', // 淡紫色
    '#36cfc9', // 青绿色
    '#ff4d4f', // 红色
    '#ff7a45', // 橙红色
    '#ffa940', // 橙色
    '#bae637', // 青绿色
    '#73d13d', // 绿色
    '#40a9ff', // 蓝色
    '#597ef7', // 蓝色
    '#ff85c0', // 粉色
    '#f759ab', // 粉色
    '#ffec3d', // 黄色
    '#d3f261', // 青绿色
    '#b7eb8f', // 绿色
    '#87e8de', // 青色
    '#91d5ff', // 蓝色
    '#adc6ff', // 蓝色
    '#d3adf7', // 紫色
    '#ffadd6', // 粉色
    '#fff1b8', // 黄色
    '#d9f7be', // 绿色
    '#b5f5ec', // 青色
]

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, placeholder = '请选择颜色' }) => {
    const [customColor, setCustomColor] = useState(value || '')

    const handleColorSelect = (color: string) => {
        setCustomColor(color)
        onChange?.(color)
    }

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        const color = '#' + inputValue
        setCustomColor(color)
        if (inputValue.match(/^[0-9A-Fa-f]{6}$/)) {
            onChange?.(color)
        }
    }

        const colorPickerContent = (
        <div style={{ width: 320, padding: 12 }}>
            {/* 常用颜色 */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 500, color: '#333' }}>常用颜色</div>
                <Row gutter={[6, 6]}>
                    {commonColors.map((color, index) => (
                        <Col key={index}>
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    backgroundColor: color,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                    border: value === color ? '3px solid #1890ff' : '1px solid #d9d9d9',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: value === color ? '0 2px 8px rgba(24, 144, 255, 0.3)' : 'none'
                                }}
                                onClick={() => handleColorSelect(color)}
                                title={color}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)'
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                    e.currentTarget.style.boxShadow = value === color ? '0 2px 8px rgba(24, 144, 255, 0.3)' : 'none'
                                }}
                            >
                                {value === color && (
                                    <div style={{ 
                                        width: 6, 
                                        height: 6, 
                                        backgroundColor: 'white', 
                                        borderRadius: '50%',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                    }} />
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>

                        {/* 自定义颜色 */}
            <div>
                <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500, color: '#333' }}>自定义颜色</div>
                <Space>
                    <Input
                        placeholder="1890ff"
                        value={customColor.replace('#', '')}
                        onChange={handleCustomColorChange}
                        style={{ width: 100 }}
                        prefix="#"
                        maxLength={6}
                    />
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            backgroundColor: customColor || '#f0f0f0',
                            borderRadius: 4,
                            border: '1px solid #d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {!customColor && (
                            <div style={{ 
                                width: 6, 
                                height: 6, 
                                backgroundColor: '#ccc', 
                                borderRadius: '50%' 
                            }} />
                        )}
                    </div>
                </Space>
            </div>
        </div>
    )

    return (
                <Popover
            content={colorPickerContent}
            title="选择颜色"
            trigger="click"
            placement="bottomLeft"
        >
            <Button
                style={{
                    width: '100%',
                    textAlign: 'left',
                    borderColor: '#d9d9d9',
                    backgroundColor: value ? value : '#fff',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                icon={<BgColorsOutlined />}
            >
                <span style={{ 
                    color: value ? (value === '#ffffff' || value === '#fadb14' || value === '#fff1b8' || value === '#d9f7be' || value === '#b5f5ec' ? '#000' : '#fff') : '#666',
                    textShadow: value ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                    flex: 1,
                    textAlign: 'left'
                }}>
                    {value || placeholder}
                </span>
                {value && (
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            backgroundColor: value,
                            borderRadius: 2,
                            border: '1px solid #d9d9d9',
                            marginLeft: 8
                        }}
                    />
                )}
            </Button>
        </Popover>
    )
}

export default ColorPicker 