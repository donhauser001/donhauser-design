import { List, Row, Col, Card } from 'antd'
import { FileTextOutlined, DollarOutlined } from '@ant-design/icons'
import { Project as ApiProject } from '../../../api/projects'
import { FileManagement } from './FileManagement'

interface TabConfigsProps {
    project: ApiProject | null
    projectFiles: any[]
    clientFiles: any[]
    onProjectFilesChange: (fileList: any[]) => Promise<void>
}

export const createMainTabsItems = (project: ApiProject | null) => [
    {
        key: 'requirements',
        label: '客户嘱托',
        children: <div>{project?.clientRequirements}</div>
    },
    {
        key: 'proposals',
        label: '项目提案',
        children: (
            <List
                size="small"
                dataSource={project?.relatedProposals}
                renderItem={(item) => (
                    <List.Item>
                        <FileTextOutlined style={{ marginRight: 8 }} />
                        {item}
                    </List.Item>
                )}
            />
        )
    },
    {
        key: 'related',
        label: '关联信息',
        children: (
            <Row gutter={16}>
                <Col span={12}>
                    <Card size="small" title="合同信息" style={{ marginBottom: 16 }}>
                        <List
                            size="small"
                            dataSource={project?.relatedContracts}
                            renderItem={(item) => (
                                <List.Item>
                                    <FileTextOutlined style={{ marginRight: 8 }} />
                                    {item}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="订单信息" style={{ marginBottom: 16 }}>
                        <List
                            size="small"
                            dataSource={project?.relatedOrders}
                            renderItem={(item) => (
                                <List.Item>
                                    <DollarOutlined style={{ marginRight: 8 }} />
                                    {item}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="结算单信息" style={{ marginBottom: 16 }}>
                        <List
                            size="small"
                            dataSource={project?.relatedSettlements}
                            renderItem={(item) => (
                                <List.Item>
                                    <DollarOutlined style={{ marginRight: 8 }} />
                                    {item}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small" title="发票信息" style={{ marginBottom: 16 }}>
                        <List
                            size="small"
                            dataSource={project?.relatedInvoices}
                            renderItem={(item) => (
                                <List.Item>
                                    <FileTextOutlined style={{ marginRight: 8 }} />
                                    {item}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        )
    }
]

export const createFileTabsItems = ({
    project,
    projectFiles,
    clientFiles,
    onProjectFilesChange
}: TabConfigsProps) => [
        {
            key: 'projectFiles',
            label: '项目文件',
            children: (
                <FileManagement
                    projectFiles={projectFiles}
                    clientFiles={[]}
                    projectId={project?._id}
                    onProjectFilesChange={onProjectFilesChange}
                />
            )
        },
        {
            key: 'clientFiles',
            label: '客户文件',
            children: (
                <FileManagement
                    projectFiles={[]}
                    clientFiles={clientFiles}
                    projectId={project?._id}
                    onProjectFilesChange={() => { }}
                />
            )
        }
    ] 