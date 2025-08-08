import React from 'react';
import { Card, Descriptions, Tooltip } from 'antd';
import { EditOutlined, ProjectOutlined, CustomerServiceOutlined, TeamOutlined, CalendarOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Project } from '../types';

interface BasicInfoCardProps {
    project: Project;
    onProjectNameEdit: () => void;
    onContactEdit: () => void;
    onTeamEdit: () => void;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
    project,
    onProjectNameEdit,
    onContactEdit,
    onTeamEdit
}) => {
    return (
        <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
                <Descriptions.Item label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ProjectOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                        <span>项目名称</span>
                    </div>
                }>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                            if (editIcon) {
                                editIcon.style.opacity = '1';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                            if (editIcon) {
                                editIcon.style.opacity = '0';
                            }
                        }}
                    >
                        <span>{project.projectName}</span>
                        <div
                            className="edit-icon"
                            style={{
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                cursor: 'pointer',
                                color: '#1890ff',
                                fontSize: '14px'
                            }}
                            onClick={onProjectNameEdit}
                        >
                            <EditOutlined />
                        </div>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CustomerServiceOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                        <span>客户名称</span>
                    </div>
                }>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{project.clientName}</span>
                        {project.contactNames && project.contactNames.length > 0 && (
                            <span
                                style={{
                                    color: '#666',
                                    position: 'relative',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                                onMouseEnter={(e) => {
                                    const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                    if (editIcon) {
                                        editIcon.style.opacity = '1';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                                    if (editIcon) {
                                        editIcon.style.opacity = '0';
                                    }
                                }}
                            >
                                - {(() => {
                                    // 处理可能的数据格式：单个字符串或数组
                                    let names: string[] = [];
                                    let phones: string[] = [];

                                    if (Array.isArray(project.contactNames)) {
                                        // 如果是数组，检查第一个元素是否包含逗号
                                        if (project.contactNames.length > 0 && project.contactNames[0].includes(',')) {
                                            names = project.contactNames[0].split(',').map(n => n.trim());
                                        } else {
                                            names = project.contactNames;
                                        }
                                    }

                                    if (Array.isArray(project.contactPhones)) {
                                        // 如果是数组，检查第一个元素是否包含逗号
                                        if (project.contactPhones.length > 0 && project.contactPhones[0].includes(',')) {
                                            phones = project.contactPhones[0].split(',').map(p => p.trim());
                                        } else {
                                            phones = project.contactPhones;
                                        }
                                    }

                                    return names.map((name, index) => {
                                        const phone = phones[index];
                                        return (
                                            <span key={index}>
                                                {phone ? (
                                                    <Tooltip title={`电话：${phone}`} placement="top">
                                                        <span style={{ cursor: 'pointer' }}>
                                                            {name}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span>{name}</span>
                                                )}
                                                {index < names.length - 1 && '，'}
                                            </span>
                                        );
                                    });
                                })()}
                                <div
                                    className="edit-icon"
                                    style={{
                                        opacity: 0,
                                        transition: 'opacity 0.2s',
                                        cursor: 'pointer',
                                        color: '#1890ff',
                                        fontSize: '14px',
                                        marginLeft: '4px'
                                    }}
                                    onClick={onContactEdit}
                                >
                                    <EditOutlined />
                                </div>
                            </span>
                        )}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TeamOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                        <span>承接团队</span>
                    </div>
                }>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                            if (editIcon) {
                                editIcon.style.opacity = '1';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const editIcon = e.currentTarget.querySelector('.edit-icon') as HTMLElement;
                            if (editIcon) {
                                editIcon.style.opacity = '0';
                            }
                        }}
                    >
                        <span>{project.undertakingTeamName || project.undertakingTeam}</span>
                        <div
                            className="edit-icon"
                            style={{
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                cursor: 'pointer',
                                color: '#1890ff',
                                fontSize: '14px'
                            }}
                            onClick={onTeamEdit}
                        >
                            <EditOutlined />
                        </div>
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                        <span>创建时间</span>
                    </div>
                }>
                    {new Date(project.createdAt).toLocaleString('zh-CN')}
                </Descriptions.Item>
                <Descriptions.Item label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UserOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                        <span>设计主创</span>
                    </div>
                }>
                    {(project.mainDesignerNames || project.mainDesigners).join('，')}
                </Descriptions.Item>
                <Descriptions.Item label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UserSwitchOutlined style={{ fontSize: '14px', color: 'inherit' }} />
                        <span>设计助理</span>
                    </div>
                }>
                    {(project.assistantDesignerNames || project.assistantDesigners).join('，')}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default BasicInfoCard; 