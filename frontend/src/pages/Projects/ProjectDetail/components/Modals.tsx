import React from 'react';
import { Modal, Select, Input } from 'antd';
import { Task, Enterprise, User } from '../types';

const { TextArea } = Input;

// 分配设计师模态窗
interface AssignDesignersModalProps {
    visible: boolean;
    task: Task | null;
    availableUsers: User[];
    selectedMainDesigners: string[];
    selectedAssistantDesigners: string[];
    loading: boolean;
    onOk: () => void;
    onCancel: () => void;
    onMainDesignersChange: (value: string[]) => void;
    onAssistantDesignersChange: (value: string[]) => void;
}

export const AssignDesignersModal: React.FC<AssignDesignersModalProps> = ({
    visible,
    task,
    availableUsers,
    selectedMainDesigners,
    selectedAssistantDesigners,
    loading,
    onOk,
    onCancel,
    onMainDesignersChange,
    onAssistantDesignersChange
}) => (
    <Modal
        title={`分配设计师 - ${task?.taskName}`}
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        width={500}
    >
        <div style={{ marginBottom: 16 }}>
            <p>请选择要分配给此任务的设计师：</p>
        </div>
        <div style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 8, fontWeight: 'bold' }}>主创设计师：</p>
            <Select
                mode="multiple"
                placeholder="请选择主创设计师"
                value={selectedMainDesigners}
                onChange={onMainDesignersChange}
                style={{ width: '100%', marginBottom: 16 }}
                optionFilterProp="children"
                showSearch
            >
                {availableUsers.map(user => (
                    <Select.Option key={user._id} value={user._id}>
                        {user.realName || user.username}
                    </Select.Option>
                ))}
            </Select>
        </div>
        <div>
            <p style={{ marginBottom: 8, fontWeight: 'bold' }}>助理设计师：</p>
            <Select
                mode="multiple"
                placeholder="请选择助理设计师"
                value={selectedAssistantDesigners}
                onChange={onAssistantDesignersChange}
                style={{ width: '100%' }}
                optionFilterProp="children"
                showSearch
            >
                {availableUsers.map(user => (
                    <Select.Option key={user._id} value={user._id}>
                        {user.realName || user.username}
                    </Select.Option>
                ))}
            </Select>
        </div>
    </Modal>
);

// 联系人编辑模态窗
interface ContactEditModalProps {
    visible: boolean;
    clientName: string;
    availableContacts: User[];
    selectedContacts: string[];
    loading: boolean;
    onOk: () => void;
    onCancel: () => void;
    onContactsChange: (value: string[]) => void;
}

export const ContactEditModal: React.FC<ContactEditModalProps> = ({
    visible,
    clientName,
    availableContacts,
    selectedContacts,
    loading,
    onOk,
    onCancel,
    onContactsChange
}) => (
    <Modal
        title={`编辑项目联系人 - ${clientName}`}
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        width={500}
    >
        <div style={{ marginBottom: 16 }}>
            <p>请选择要关联到此项目的联系人：</p>
        </div>
        <Select
            mode="multiple"
            placeholder="请选择联系人"
            value={selectedContacts}
            onChange={onContactsChange}
            style={{ width: '100%' }}
            optionFilterProp="children"
            showSearch
            loading={loading}
        >
            {availableContacts.map(contact => (
                <Select.Option key={contact._id} value={contact._id}>
                    {contact.realName} {contact.position && `(${contact.position})`} {contact.phone && `- ${contact.phone}`}
                </Select.Option>
            ))}
        </Select>
    </Modal>
);

// 备注编辑模态窗
interface RemarkEditModalProps {
    visible: boolean;
    value: string;
    loading: boolean;
    onOk: () => void;
    onCancel: () => void;
    onValueChange: (value: string) => void;
}

export const RemarkEditModal: React.FC<RemarkEditModalProps> = ({
    visible,
    value,
    loading,
    onOk,
    onCancel,
    onValueChange
}) => (
    <Modal
        title="编辑项目备注"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        width={600}
    >
        <div style={{ marginBottom: 16 }}>
            <p>请输入项目备注信息：</p>
        </div>
        <div style={{ marginBottom: 24 }}>
            <TextArea
                placeholder="请输入备注内容..."
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                rows={6}
                style={{ width: '100%' }}
                maxLength={1000}
                showCount
            />
        </div>
    </Modal>
);

// 承接团队编辑模态窗
interface TeamEditModalProps {
    visible: boolean;
    availableEnterprises: Enterprise[];
    selectedTeam: string;
    loading: boolean;
    onOk: () => void;
    onCancel: () => void;
    onTeamChange: (value: string) => void;
}

export const TeamEditModal: React.FC<TeamEditModalProps> = ({
    visible,
    availableEnterprises,
    selectedTeam,
    loading,
    onOk,
    onCancel,
    onTeamChange
}) => (
    <Modal
        title="编辑项目承接团队"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        width={500}
    >
        <div style={{ marginBottom: 16 }}>
            <p>请选择项目的承接团队：</p>
        </div>
        <Select
            placeholder="请选择承接团队"
            value={selectedTeam}
            onChange={onTeamChange}
            style={{ width: '100%' }}
            optionFilterProp="children"
            showSearch
            loading={loading}
        >
            {availableEnterprises.map(enterprise => (
                <Select.Option key={enterprise._id} value={enterprise._id}>
                    {enterprise.enterpriseName}
                </Select.Option>
            ))}
        </Select>
    </Modal>
);

// 项目名称编辑模态窗
interface ProjectNameEditModalProps {
    visible: boolean;
    value: string;
    loading: boolean;
    onOk: () => void;
    onCancel: () => void;
    onValueChange: (value: string) => void;
}

export const ProjectNameEditModal: React.FC<ProjectNameEditModalProps> = ({
    visible,
    value,
    loading,
    onOk,
    onCancel,
    onValueChange
}) => (
    <Modal
        title="编辑项目名称"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        width={500}
    >
        <div style={{ marginBottom: 16 }}>
            <p>请输入新的项目名称：</p>
        </div>
        <Input
            placeholder="请输入项目名称..."
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            style={{ width: '100%' }}
            maxLength={100}
            showCount
        />
    </Modal>
); 