import React, { useState, useEffect } from 'react';
import { Card, Space } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getOrganizationEnterprises, Enterprise } from '../../../../api/enterprises';

interface OurCertificateComponentProps {
    component: FormComponent;
}

const OurCertificateComponent: React.FC<OurCertificateComponentProps> = ({ component }) => {
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);

    // 获取企业数据
    useEffect(() => {
        const fetchEnterprises = async () => {
            try {
                const response = await getOrganizationEnterprises();
                if (response.success) {
                    setEnterprises(response.data);
                    // 如果有选中的企业，更新企业数据
                    if (component.selectedEnterprise) {
                        const enterprise = response.data.find((e: Enterprise) => 
                            e.enterpriseName === component.selectedEnterprise
                        );
                        setSelectedEnterprise(enterprise || null);
                    }
                }
            } catch (error) {
                console.error('获取企业列表失败:', error);
            }
        };
        fetchEnterprises();
    }, [component.selectedEnterprise]);




    // 获取企业营业执照信息
    const getBusinessLicenseInfo = () => {
        if (selectedEnterprise) {
            return {
                number: selectedEnterprise.businessLicense || component.manualBusinessLicense || '统一社会信用代码：91XXXXXXXXXXXXXXXXX',
                image: undefined // 暂时不显示图片，等待企业数据中添加图片字段
            };
        }
        return {
            number: component.manualBusinessLicense || '统一社会信用代码：91XXXXXXXXXXXXXXXXX',
            image: undefined
        };
    };

    // 获取开户许可证信息
    const getBankPermitInfo = () => {
        if (selectedEnterprise) {
            return {
                number: component.manualBankPermit || '开户许可证核准号：J1XXXXXXXXXXXXXXXX',
                image: undefined // 暂时不显示图片，等待企业数据中添加图片字段
            };
        }
        return {
            number: component.manualBankPermit || '开户许可证核准号：J1XXXXXXXXXXXXXXXX',
            image: undefined
        };
    };

    return (
        <div style={{ width: '100%' }}>
            <Card 
                title={
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>
                        {selectedEnterprise ? `${selectedEnterprise.enterpriseName}证照` : '企业证照'}
                    </span>
                }
                size="small" 
                style={{ 
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    ...component.style 
                }}
            >
                {selectedEnterprise ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: 500, 
                            color: '#262626',
                            marginBottom: '16px'
                        }}>
                            {selectedEnterprise.enterpriseName}证照
                        </div>
                        
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* 营业执照 */}
                            {component.showBusinessLicense !== false && (
                                <div>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        fontWeight: 500, 
                                        marginBottom: '8px',
                                        color: '#262626'
                                    }}>
                                        营业执照
                                    </div>
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: '#8c8c8c', 
                                        textAlign: 'center',
                                        padding: '8px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '4px'
                                    }}>
                                        {getBusinessLicenseInfo().number}
                                    </div>
                                </div>
                            )}

                            {/* 开户许可证 */}
                            {component.showBankPermit === true && (
                                <div>
                                    <div style={{ 
                                        fontSize: '14px', 
                                        fontWeight: 500, 
                                        marginBottom: '8px',
                                        color: '#262626'
                                    }}>
                                        开户许可证
                                    </div>
                                    <div style={{ 
                                        fontSize: '12px', 
                                        color: '#8c8c8c', 
                                        textAlign: 'center',
                                        padding: '8px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '4px'
                                    }}>
                                        {getBankPermitInfo().number}
                                    </div>
                                </div>
                            )}
                        </Space>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#8c8c8c',
                        fontSize: '14px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
                        <div>请在属性面板中选择企业</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            选择后将显示企业证照信息
                        </div>
                    </div>
                )}
            </Card>

            {/* 字段说明 */}
            {component.fieldDescription && (
                <div style={{ 
                    fontSize: '12px', 
                    color: '#8c8c8c', 
                    marginTop: '8px', 
                    lineHeight: '1.4' 
                }}>
                    {component.fieldDescription}
                </div>
            )}


        </div>
    );
};

export default OurCertificateComponent;