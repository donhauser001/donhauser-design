import React from 'react';
import { Form, Switch } from 'antd';
import { FormComponent } from '../../../types/formDesigner';

interface ProjectComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const ProjectComponents: React.FC<ProjectComponentsProps> = ({ component, onPropertyChange }) => {
    // 项目名称组件特有属性
    const renderProjectNameProperties = () => (
        <>
            <Form.Item label="来自项目表">
                <Switch
                    checked={component.fromProjectTable || false}
                    onChange={(checked) => onPropertyChange('fromProjectTable', checked)}
                />
            </Form.Item>

            {component.fromProjectTable && (
                <>
                    <Form.Item label="显示客户信息">
                        <Switch
                            checked={component.showClient || false}
                            onChange={(checked) => onPropertyChange('showClient', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示项目状态">
                        <Switch
                            checked={component.showStatus || false}
                            onChange={(checked) => onPropertyChange('showStatus', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人信息">
                        <Switch
                            checked={component.showContact || false}
                            onChange={(checked) => onPropertyChange('showContact', checked)}
                        />
                    </Form.Item>
                </>
            )}
            {component.fromProjectTable && (
                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            已启用项目表模式
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/projects 获取真实项目数据<br />
                            • 搜索功能：支持按项目名称和客户名称实时搜索<br />
                            • 信息显示：可选择显示客户信息、项目状态、联系人信息<br />
                            • 隐私保护：可关闭客户和联系人信息显示，避免信息泄露<br />
                            • 动态加载：最多显示1000个项目，支持服务器端搜索<br />
                            • 图标支持：基础属性中设置的图标仍然会显示在下拉框左侧<br />
                            • 在表单预览或实际使用时，用户可以从项目列表中选择已有项目
                        </div>
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 客户组件特有属性
    const renderClientProperties = () => (
        <>
            <Form.Item label="来自客户表">
                <Switch
                    checked={component.fromClientTable || false}
                    onChange={(checked) => onPropertyChange('fromClientTable', checked)}
                />
            </Form.Item>

            {component.fromClientTable && (
                <>
                    <Form.Item label="显示客户分类">
                        <Switch
                            checked={component.showClientCategory || false}
                            onChange={(checked) => onPropertyChange('showClientCategory', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示客户评级">
                        <Switch
                            checked={component.showClientRating || false}
                            onChange={(checked) => onPropertyChange('showClientRating', checked)}
                        />
                    </Form.Item>
                </>
            )}
            {component.fromClientTable && (
                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            已启用客户表模式
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/clients 获取真实客户数据<br />
                            • 搜索功能：支持按客户名称实时搜索<br />
                            • 信息显示：可选择显示客户分类、评级<br />
                            • 状态处理：停用客户显示"禁用"标签并冻结选项，活跃客户不显示状态<br />
                            • 隐私保护：可选择性显示敏感信息<br />
                            • 动态加载：支持服务器端搜索<br />
                            • 图标支持：基础属性中设置的图标仍然会显示在下拉框左侧<br />
                            • 在表单预览或实际使用时，用户可以从客户列表中选择已有客户
                        </div>
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 联系人组件特有属性
    const renderContactProperties = () => (
        <>
            <Form.Item label="来自联系人表">
                <Switch
                    checked={component.fromContactTable || false}
                    onChange={(checked) => onPropertyChange('fromContactTable', checked)}
                />
            </Form.Item>

            {component.fromContactTable && (
                <>
                    <Form.Item label="显示联系人电话">
                        <Switch
                            checked={component.showContactPhone || false}
                            onChange={(checked) => onPropertyChange('showContactPhone', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人邮箱">
                        <Switch
                            checked={component.showContactEmail || false}
                            onChange={(checked) => onPropertyChange('showContactEmail', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人公司">
                        <Switch
                            checked={component.showContactCompany || false}
                            onChange={(checked) => onPropertyChange('showContactCompany', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="显示联系人职位">
                        <Switch
                            checked={component.showContactPosition || false}
                            onChange={(checked) => onPropertyChange('showContactPosition', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="公司过滤">
                        <Switch
                            checked={component.enableCompanyFilter || false}
                            onChange={(checked) => onPropertyChange('enableCompanyFilter', checked)}
                        />
                    </Form.Item>

                    <Form.Item label="允许多选">
                        <Switch
                            checked={component.allowMultipleContacts || false}
                            onChange={(checked) => onPropertyChange('allowMultipleContacts', checked)}
                        />
                    </Form.Item>
                </>
            )}
            {component.fromContactTable && (
                <Form.Item>
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: 'rgb(248, 249, 250)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'rgb(102, 102, 102)'
                    }}>
                        <div style={{ fontWeight: 500, marginBottom: '6px' }}>
                            已启用联系人表模式
                        </div>
                        <div style={{ lineHeight: '1.6' }}>
                            • 数据来源：从 /api/users 获取客户角色的真实联系人数据<br />
                            • 搜索功能：支持按姓名、公司、电话实时搜索<br />
                            • 信息显示：可选择显示电话、邮箱、公司、职位<br />
                            • 公司过滤：可根据画布中客户组件的选择自动过滤相关联系人<br />
                            • 状态处理：停用联系人显示"禁用"标签并冻结选项，活跃联系人不显示状态<br />
                            • 隐私保护：可选择性显示敏感信息<br />
                            • 动态加载：支持服务器端搜索<br />
                            • 图标支持：基础属性中设置的图标仍然会显示在下拉框左侧<br />
                            • 在表单预览或实际使用时，用户可以从联系人列表中选择已有联系人
                        </div>
                    </div>
                </Form.Item>
            )}
        </>
    );

    // 根据组件类型渲染不同的属性
    const renderComponentProperties = () => {
        switch (component.type) {
            case 'projectName':
                return renderProjectNameProperties();
            case 'client':
                return renderClientProperties();
            case 'contact':
                return renderContactProperties();
            case 'quotation':
            case 'order':
            case 'instruction':
            case 'taskList':
                return (
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        该组件暂无特殊属性设置
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {renderComponentProperties()}
        </>
    );
};

export default ProjectComponents;
