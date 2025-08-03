import React, { useState } from 'react'
import {
    Card,
    Tree,
    Input,
    Space,
    Button,
    Tag,
    Typography,
    Row,
    Col,
    Collapse,
    Tooltip,
    Badge
} from 'antd'
import { 
    SearchOutlined, 
    PlusOutlined,
    InfoCircleOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    UserOutlined,
    ShopOutlined
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

const { Search } = Input
const { Text } = Typography
const { Panel } = Collapse

interface DynamicVariableSelectorProps {
    selected: string[]
    onChange: (variables: string[]) => void
    elementType: string
}

// 变量数据结构
const VARIABLE_CATEGORIES = {
    company: {
        label: '公司信息',
        icon: <ShopOutlined />,
        description: '企业基本信息和联系方式',
        variables: {
            'company.name': { label: '公司名称', example: '北京设计有限公司' },
            'company.address': { label: '公司地址', example: '北京市朝阳区xxx路123号' },
            'company.phone': { label: '联系电话', example: '010-12345678' },
            'company.email': { label: '邮箱地址', example: 'contact@company.com' },
            'company.website': { label: '官方网站', example: 'www.company.com' },
            'company.legal_representative': { label: '法定代表人', example: '张三' },
            'company.registration_number': { label: '注册号码', example: '123456789012345678' },
            'company.representative': { label: '签约代表', example: '李四' }
        }
    },
    client: {
        label: '客户信息',
        icon: <UserOutlined />,
        description: '客户企业和联系人信息',
        variables: {
            'client.company': { label: '客户公司', example: '客户科技有限公司' },
            'client.representative': { label: '客户代表', example: '王五' },
            'client.contact_person': { label: '联系人', example: '赵六' },
            'client.phone': { label: '联系电话', example: '13800138000' },
            'client.email': { label: '邮箱地址', example: 'client@client.com' },
            'client.address': { label: '客户地址', example: '上海市浦东新区xxx街456号' }
        }
    },
    contract: {
        label: '合同信息',
        icon: <FileTextOutlined />,
        description: '合同基本信息和元数据',
        variables: {
            'contract.title': { label: '合同标题', example: '设计服务合同' },
            'contract.number': { label: '合同编号', example: 'HT-2025-001' },
            'contract.date': { label: '签署日期', example: '2025年1月18日' },
            'contract.start_date': { label: '开始日期', example: '2025年1月20日' },
            'contract.end_date': { label: '结束日期', example: '2025年3月20日' },
            'contract.duration': { label: '合同期限', example: '60天' },
            'contract.type': { label: '合同类型', example: '设计服务合同' }
        }
    },
    project: {
        label: '项目信息',
        icon: <DatabaseOutlined />,
        description: '项目详细信息和进度',
        variables: {
            'project.name': { label: '项目名称', example: '企业官网设计项目' },
            'project.description': { label: '项目描述', example: '为客户设计企业官方网站' },
            'project.amount': { label: '项目金额', example: '¥58,000' },
            'project.duration': { label: '项目周期', example: '45天' },
            'project.start_date': { label: '开始时间', example: '2025年1月20日' },
            'project.delivery_date': { label: '交付时间', example: '2025年3月5日' },
            'project.manager': { label: '项目经理', example: '张项目' },
            'project.status': { label: '项目状态', example: '进行中' }
        }
    },
    order: {
        label: '订单信息',
        icon: <FileTextOutlined />,
        description: '订单详情和服务项目',
        variables: {
            'order.orderNo': { label: '订单号', example: 'ORD-2025-001' },
            'order.totalAmount': { label: '订单总额', example: '¥58,000' },
            'order.totalAmountRMB': { label: '总额大写', example: '伍万捌仟元整' },
            'order.createTime': { label: '创建时间', example: '2025年1月18日' },
            'order.status': { label: '订单状态', example: '正常' },
            'order.items': { label: '服务项目', example: '[服务项目列表]', isArray: true },
            'order.items.serviceName': { label: '服务名称', example: '网站设计' },
            'order.items.quantity': { label: '服务数量', example: '1' },
            'order.items.unitPrice': { label: '单价', example: '¥15,000' },
            'order.items.amount': { label: '小计金额', example: '¥15,000' }
        }
    },
    quotation: {
        label: '报价单信息',
        icon: <FileTextOutlined />,
        description: '报价单详情和价格信息',
        variables: {
            'quotation.name': { label: '报价单名称', example: '标准设计服务报价' },
            'quotation.number': { label: '报价单号', example: 'QUO-2025-001' },
            'quotation.totalAmount': { label: '报价总额', example: '¥60,000' },
            'quotation.validUntil': { label: '有效期至', example: '2025年2月18日' },
            'quotation.items': { label: '报价项目', example: '[报价项目列表]', isArray: true },
            'quotation.items.serviceName': { label: '服务名称', example: '品牌设计' },
            'quotation.items.description': { label: '服务描述', example: 'LOGO设计及VI系统' },
            'quotation.items.price': { label: '报价', example: '¥20,000' }
        }
    },
    document: {
        label: '文档信息',
        icon: <FileTextOutlined />,
        description: '文档元数据和页面信息',
        variables: {
            'document.title': { label: '文档标题', example: '设计服务合同' },
            'document.date': { label: '文档日期', example: '2025年1月18日' },
            'document.version': { label: '文档版本', example: 'v1.0' },
            'page.number': { label: '当前页码', example: '1' },
            'page.total': { label: '总页数', example: '5' },
            'page.header': { label: '页眉内容', example: '设计服务合同' },
            'page.footer': { label: '页脚内容', example: '第1页 共5页' }
        }
    }
}

const DynamicVariableSelector: React.FC<DynamicVariableSelectorProps> = ({
    selected,
    onChange,
    elementType
}) => {
    const [searchText, setSearchText] = useState('')
    const [expandedKeys, setExpandedKeys] = useState<string[]>(['company', 'client', 'contract'])

    // 根据元素类型推荐变量分类
    const getRecommendedCategories = () => {
        const recommendations: Record<string, string[]> = {
            header: ['company', 'document'],
            footer: ['company', 'document'],
            letterhead: ['company', 'contract', 'client'],
            signature: ['company', 'client'],
            clause: ['contract', 'project'],
            table: ['project', 'order', 'quotation'],
            dynamic_data: ['order', 'quotation'],
            form_field: ['client', 'project']
        }
        return recommendations[elementType] || []
    }

    const recommendedCategories = getRecommendedCategories()

    // 搜索过滤
    const filterVariables = () => {
        if (!searchText) return VARIABLE_CATEGORIES

        const filtered: any = {}
        Object.entries(VARIABLE_CATEGORIES).forEach(([categoryKey, category]) => {
            const matchedVariables: any = {}
            Object.entries(category.variables).forEach(([varKey, variable]) => {
                if (
                    varKey.toLowerCase().includes(searchText.toLowerCase()) ||
                    variable.label.toLowerCase().includes(searchText.toLowerCase()) ||
                    variable.example.toLowerCase().includes(searchText.toLowerCase())
                ) {
                    matchedVariables[varKey] = variable
                }
            })
            if (Object.keys(matchedVariables).length > 0) {
                filtered[categoryKey] = {
                    ...category,
                    variables: matchedVariables
                }
            }
        })
        return filtered
    }

    const filteredCategories = filterVariables()

    const handleVariableToggle = (variable: string) => {
        if (selected.includes(variable)) {
            onChange(selected.filter(v => v !== variable))
        } else {
            onChange([...selected, variable])
        }
    }

    const handleCategorySelectAll = (categoryKey: string, variables: Record<string, any>) => {
        const categoryVariables = Object.keys(variables)
        const allSelected = categoryVariables.every(v => selected.includes(v))
        
        if (allSelected) {
            // 取消选择该分类的所有变量
            onChange(selected.filter(v => !categoryVariables.includes(v)))
        } else {
            // 选择该分类的所有变量
            const newSelected = [...selected]
            categoryVariables.forEach(v => {
                if (!newSelected.includes(v)) {
                    newSelected.push(v)
                }
            })
            onChange(newSelected)
        }
    }

    const renderVariableCard = (varKey: string, variable: any, categoryKey: string) => {
        const isSelected = selected.includes(varKey)
        const isRecommended = recommendedCategories.includes(categoryKey)
        
        return (
            <Card
                key={varKey}
                size="small"
                hoverable
                style={{
                    marginBottom: 8,
                    border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    backgroundColor: isSelected ? '#f0f8ff' : '#fff',
                    cursor: 'pointer'
                }}
                onClick={() => handleVariableToggle(varKey)}
            >
                <Row justify="space-between" align="middle">
                    <Col flex="auto">
                        <Space>
                            <Text strong style={{ color: isSelected ? '#1890ff' : '#000' }}>
                                {variable.label}
                            </Text>
                            {isRecommended && (
                                <Tag color="gold" size="small">推荐</Tag>
                            )}
                            {variable.isArray && (
                                <Tag color="blue" size="small">数组</Tag>
                            )}
                        </Space>
                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                变量：{varKey}
                            </Text>
                        </div>
                        <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                示例：{variable.example}
                            </Text>
                        </div>
                    </Col>
                    <Col>
                        {isSelected && (
                            <Button type="primary" size="small" shape="circle">
                                ✓
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card>
        )
    }

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                    <Search
                        placeholder="搜索变量名称或描述"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </Col>
                <Col span={12}>
                    <Space>
                        <Text type="secondary">
                            已选择: <Badge count={selected.length} color="blue" />
                        </Text>
                        <Button 
                            size="small" 
                            onClick={() => onChange([])}
                            disabled={selected.length === 0}
                        >
                            清空选择
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Collapse
                activeKey={expandedKeys}
                onChange={setExpandedKeys}
                size="small"
            >
                {Object.entries(filteredCategories).map(([categoryKey, category]) => {
                    const categoryVariables = Object.keys(category.variables)
                    const selectedCount = categoryVariables.filter(v => selected.includes(v)).length
                    const isRecommended = recommendedCategories.includes(categoryKey)
                    
                    return (
                        <Panel
                            key={categoryKey}
                            header={
                                <Space>
                                    {category.icon}
                                    <Text strong>{category.label}</Text>
                                    {isRecommended && <Tag color="gold" size="small">推荐</Tag>}
                                    <Badge 
                                        count={`${selectedCount}/${categoryVariables.length}`} 
                                        color={selectedCount > 0 ? 'blue' : 'default'}
                                    />
                                </Space>
                            }
                            extra={
                                <Space onClick={e => e.stopPropagation()}>
                                    <Tooltip title={category.description}>
                                        <InfoCircleOutlined style={{ color: '#999' }} />
                                    </Tooltip>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleCategorySelectAll(categoryKey, category.variables)
                                        }}
                                    >
                                        {selectedCount === categoryVariables.length ? '取消全选' : '全选'}
                                    </Button>
                                </Space>
                            }
                        >
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {Object.entries(category.variables).map(([varKey, variable]) =>
                                    renderVariableCard(varKey, variable, categoryKey)
                                )}
                            </div>
                        </Panel>
                    )
                })}
            </Collapse>

            {Object.keys(filteredCategories).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">没有找到匹配的变量</Text>
                </div>
            )}
        </div>
    )
}

export default DynamicVariableSelector