import React from 'react';
import { Card, Tabs, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Project } from '../types';

interface AdditionalInfoCardProps {
    project: Project;
    onRemarkEdit: () => void;
}

const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({
    project,
    onRemarkEdit
}) => {
    const hasRequirements = project.clientRequirements;
    const hasRemark = project.remark;

    // 如果有客户嘱托或备注，显示内容
    if (hasRequirements || hasRemark) {
        return (
            <Card title="附加信息" style={{ marginBottom: 16 }}>
                <Tabs
                    size="small"
                    items={[
                        ...(hasRequirements ? [{
                            key: 'requirements',
                            label: '客户嘱托',
                            children: <p>{project.clientRequirements}</p>
                        }] : []),
                        ...(hasRemark ? [{
                            key: 'remark',
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>备注</span>
                                    <EditOutlined
                                        style={{
                                            fontSize: '12px',
                                            color: '#1890ff',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemarkEdit();
                                        }}
                                    />
                                </div>
                            ),
                            children: (
                                <div style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: '1.6'
                                }}>
                                    {project.remark}
                                </div>
                            )
                        }] : [])
                    ]}
                />
            </Card>
        );
    }

    // 如果没有备注但有客户嘱托，或者都没有，显示添加备注的卡片
    return (
        <Card title="附加信息" style={{ marginBottom: 16 }}>
            <Tabs
                size="small"
                items={[
                    ...(hasRequirements ? [{
                        key: 'requirements',
                        label: '客户嘱托',
                        children: <p>{project.clientRequirements}</p>
                    }] : []),
                    {
                        key: 'remark',
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>备注</span>
                                <EditOutlined
                                    style={{
                                        fontSize: '12px',
                                        color: '#1890ff',
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemarkEdit();
                                    }}
                                />
                            </div>
                        ),
                        children: (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                color: '#8c8c8c'
                            }}>
                                <Button
                                    type="dashed"
                                    icon={<EditOutlined />}
                                    onClick={onRemarkEdit}
                                >
                                    添加备注
                                </Button>
                            </div>
                        )
                    }
                ]}
            />
        </Card>
    );
};

export default AdditionalInfoCard; 