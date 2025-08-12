import React, { useState, useEffect } from 'react';
import { Input, Select, Spin } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { projectService, ProjectItem } from '../../services/projectService';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

const { Option } = Select;

interface ProjectNameComponentProps {
    component: FormComponent;
}

const ProjectNameComponent: React.FC<ProjectNameComponentProps> = ({ component }) => {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // 使用store管理组件值
    const { setComponentValue, getComponentValue, components, updateComponent } = useFormDesignerStore();

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    // 获取项目状态的显示样式
    const getStatusTag = (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
            'consulting': { text: '咨询中', color: '#1890ff' },
            'in-progress': { text: '进行中', color: '#52c41a' },
            'partial-delivery': { text: '部分交付', color: '#fa8c16' },
            'completed': { text: '已完成', color: '#52c41a' },
            'on-hold': { text: '暂停', color: '#faad14' },
            'cancelled': { text: '已取消', color: '#f5222d' }
        };
        return statusMap[status] || { text: status, color: '#d9d9d9' };
    };

    // 加载项目数据
    const loadProjects = async () => {
        if (!component.fromProjectTable) return;

        setLoading(true);
        try {
            const projectData = await projectService.getAllProjects();
            setProjects(projectData);
        } catch (error) {
            console.error('加载项目数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 搜索项目
    const handleSearch = async (value: string) => {
        if (!value.trim()) {
            loadProjects();
            return;
        }

        setSearchLoading(true);
        try {
            const searchResults = await projectService.searchProjects(value);
            setProjects(searchResults);
        } catch (error) {
            console.error('搜索项目失败:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    // 当组件切换到项目表模式时加载数据
    useEffect(() => {
        if (component.fromProjectTable) {
            loadProjects();
        }
    }, [component.fromProjectTable]);

    // 自动检测：当画布上只有项目名称和订单组件时，自动开启"来自项目表"
    useEffect(() => {
        const hasQuotationComponent = components.some(comp => comp.type === 'quotation');
        const hasOrderComponent = components.some(comp => comp.type === 'order');

        // 如果画布上有订单组件但没有报价单组件，且当前还没开启"来自项目表"
        if (hasOrderComponent && !hasQuotationComponent && !component.fromProjectTable) {
            updateComponent(component.id, { fromProjectTable: true });
        }
    }, [components, component.fromProjectTable, component.id, updateComponent]);

    // 渲染输入框模式
    const renderInputMode = () => {
        const { textAlign, ...restStyle } = component.style || {};
        return (
            <Input
                placeholder={component.placeholder}
                value={component.defaultValue || ''}
                prefix={getPrefix()}
                style={restStyle}
                readOnly={true}
            />
        );
    };

    // 获取当前选中的项目
    const selectedProject = getComponentValue(component.id);

    // 渲染下拉框模式
    const renderSelectMode = () => {
        const { textAlign, ...restStyle } = component.style || {};
        const selectComponent = (
            <Select
                showSearch
                placeholder={component.placeholder || '请选择项目'}
                value={selectedProject?._id || undefined}
                style={{ width: '100%', ...restStyle }}
                styles={{
                    popup: { root: { minWidth: '300px' } }
                }}
                loading={loading || searchLoading}
                onSearch={handleSearch}
                onChange={(value) => {
                    // 找到选中的项目对象
                    const selectedProjectObj = projects.find(p => p._id === value);
                    if (selectedProjectObj) {
                        setComponentValue(component.id, selectedProjectObj);
                    }
                }}
                onSelect={() => {
                    // 选择完成后，清空搜索词，恢复显示所有项目
                    handleSearch('');
                }}
                filterOption={false} // 禁用本地过滤，使用服务器端搜索
                notFoundContent={
                    loading || searchLoading ? (
                        <div style={{ textAlign: 'center', padding: '12px' }}>
                            <Spin size="small" />
                            <div style={{ marginTop: '8px', color: '#999', fontSize: '12px' }}>
                                加载中...
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
                            暂无项目数据
                        </div>
                    )
                }
                popupRender={(menu) => (
                    <div>
                        {menu}
                        {projects.length > 0 && (
                            <div style={{
                                padding: '8px 12px',
                                fontSize: '12px',
                                color: '#999',
                                borderTop: '1px solid #f0f0f0',
                                backgroundColor: '#fafafa'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>共 {projects.length} 个项目</span>
                                    <span>支持搜索项目名称和客户名称</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            >
                {projects.map(project => {
                    const status = getStatusTag(project.progressStatus);
                    return (
                        <Option key={project._id} value={project._id}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                {/* 左侧：项目名称 */}
                                <div style={{
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    flex: 1,
                                    textAlign: 'left',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginRight: '12px'
                                }}>
                                    {project.projectName}
                                </div>

                                {/* 右侧：动态显示信息 */}
                                {(component.showClient || component.showStatus || component.showContact) && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        flexShrink: 0,
                                        fontSize: '11px'
                                    }}>
                                        {component.showClient && (
                                            <span style={{
                                                color: '#666',
                                                fontSize: '12px'
                                            }}>
                                                {project.clientName}
                                            </span>
                                        )}

                                        {component.showContact && project.contactNames && (
                                            <span style={{
                                                color: '#999',
                                                fontSize: '11px'
                                            }}>
                                                ({(() => {
                                                    // 安全处理contactNames字段
                                                    try {
                                                        if (typeof project.contactNames === 'string' && project.contactNames.trim()) {
                                                            return project.contactNames.trim();
                                                        } else if (Array.isArray(project.contactNames) && project.contactNames.length > 0) {
                                                            const contacts = project.contactNames.slice(0, 2).join('/');
                                                            return contacts + (project.contactNames.length > 2 ? '...' : '');
                                                        }
                                                    } catch (error) {
                                                        console.warn('处理联系人信息时出错:', error);
                                                    }
                                                    return '';
                                                })()})
                                            </span>
                                        )}

                                        {component.showStatus && (
                                            <span
                                                style={{
                                                    color: status.color,
                                                    backgroundColor: `${status.color}20`,
                                                    padding: '1px 6px',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    fontWeight: 500
                                                }}
                                            >
                                                {status.text}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Option>
                    );
                })}
            </Select>
        );

        // 如果有图标，则包装在带图标的容器中
        if (component.icon) {
            const containerClass = `project-select-with-icon-${component.id}`;
            return (
                <div className={containerClass} style={{ position: 'relative', width: '100%' }}>
                    <style>
                        {`
                        .${containerClass} .ant-select .ant-select-selector {
                            padding-left: 32px !important;
                        }
                        .${containerClass} .ant-select .ant-select-selection-search-input {
                            padding-left: 32px !important;
                        }
                        .${containerClass} .ant-select .ant-select-selection-item {
                            padding-left: 0 !important;
                        }
                        .${containerClass} .ant-select .ant-select-selection-placeholder {
                            padding-left: 0 !important;
                        }
                        `}
                    </style>
                    <div style={{
                        position: 'absolute',
                        left: '11px',
                        top: '50%',
                        transform: 'translateY(calc(-50% + 2px))',
                        zIndex: 10,
                        pointerEvents: 'none',
                        color: '#8c8c8c'
                    }}>
                        {getPrefix()}
                    </div>
                    {selectComponent}
                </div>
            );
        }

        return selectComponent;
    };

    return (
        <div style={{ width: '100%' }}>
            {component.fromProjectTable ? renderSelectMode() : renderInputMode()}
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    {component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ProjectNameComponent; 