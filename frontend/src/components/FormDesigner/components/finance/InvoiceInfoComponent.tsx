import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { getActiveEnterprises, Enterprise } from '../../../../api/enterprises';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface InvoiceInfoComponentProps {
    component: FormComponent;
}

const InvoiceInfoComponent: React.FC<InvoiceInfoComponentProps> = ({ component }) => {
    const { theme } = useFormDesignerStore();
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
    const [loading, setLoading] = useState(false);

    // 根据组件属性中选择的企业ID获取企业信息
    useEffect(() => {
        const loadSelectedEnterprise = async () => {
            if (!component.selectedEnterpriseId) {
                setSelectedEnterprise(null);
                return;
            }

            try {
                setLoading(true);
                const response = await getActiveEnterprises();

                if (response.success && response.data) {
                    // 根据实际的数据结构获取企业列表
                    const enterprises = Array.isArray(response.data) ? response.data : (response.data.enterprises || []);
                    const enterprise = enterprises.find((e: any) => e.id === component.selectedEnterpriseId);
                    setSelectedEnterprise(enterprise || null);
                }
            } catch (error) {
                console.error('获取企业信息失败:', error);
                setSelectedEnterprise(null);
            } finally {
                setLoading(false);
            }
        };

        loadSelectedEnterprise();
    }, [component.selectedEnterpriseId]);

    // 如果没有选择企业，显示提示
    if (!component.selectedEnterpriseId) {
        return (
            <div style={getDescriptionContainerStyle(theme)}>
                {renderTopDescription({ component, theme })}

                <div style={getComponentContentStyle(theme)}>
                    <Alert
                        message="请在属性面板中选择开票企业"
                        description="开票信息将自动从企业设置模块获取"
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                </div>

                {renderBottomDescription({ component, theme })}
                {renderRightDescription({ component, theme })}
            </div>
        );
    }

    // 如果正在加载，显示加载状态
    if (loading) {
        return (
            <div style={getDescriptionContainerStyle(theme)}>
                {renderTopDescription({ component, theme })}

                <div style={getComponentContentStyle(theme)}>
                    <Card
                        size="small"
                        title="开票信息"
                        loading={true}
                        style={component.style}
                    >
                        加载中...
                    </Card>
                </div>

                {renderBottomDescription({ component, theme })}
                {renderRightDescription({ component, theme })}
            </div>
        );
    }

    // 如果没有找到企业信息，显示错误提示
    if (!selectedEnterprise) {
        return (
            <div style={getDescriptionContainerStyle(theme)}>
                {renderTopDescription({ component, theme })}

                <div style={getComponentContentStyle(theme)}>
                    <Alert
                        message="未找到选择的企业信息"
                        description="请检查企业是否存在或重新选择"
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        style={{
                            fontSize: '12px'
                        }}
                    />
                </div>

                {renderBottomDescription({ component, theme })}
                {renderRightDescription({ component, theme })}
            </div>
        );
    }

    // 获取标题显示内容
    const getCardTitle = () => {
        const { titleDisplay = 'show', customTitle = '开票信息' } = component;

        if (titleDisplay === 'hide') {
            return undefined; // 不显示标题
        } else if (titleDisplay === 'custom') {
            return customTitle || '开票信息'; // 显示自定义标题
        } else {
            return '开票信息'; // 显示默认标题
        }
    };

    // 显示企业开票信息
    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <Card
                    size="small"
                    title={getCardTitle()}
                    style={{ ...component.style }}
                >
                    {selectedEnterprise.invoiceInfo ? (
                        <div style={{
                            whiteSpace: 'pre-line',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            padding: '8px 0'
                        }}>
                            {selectedEnterprise.invoiceInfo}
                        </div>
                    ) : (
                        <div style={{
                            color: '#999',
                            fontSize: '12px',
                            textAlign: 'center',
                            padding: '20px 0'
                        }}>
                            该企业暂未配置开票信息
                        </div>
                    )}
                </Card>
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default InvoiceInfoComponent; 