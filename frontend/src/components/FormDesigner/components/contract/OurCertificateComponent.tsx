import React, { useState, useEffect } from 'react';
import { Card, Space, Image } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getOrganizationEnterprises, Enterprise } from '../../../../api/enterprises';
import { getLinearIcon } from '../../utils/iconUtils';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface OurCertificateComponentProps {
    component: FormComponent;
}

const OurCertificateComponent: React.FC<OurCertificateComponentProps> = ({ component }) => {
    const { theme } = useFormDesignerStore();
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

    // 获取图片URL
    const getImageUrl = (filename: string) => {
        return `/uploads/enterprises/${filename}`;
    };

    // 获取企业营业执照信息
    const getBusinessLicenseInfo = () => {
        if (selectedEnterprise) {
            const businessLicense = selectedEnterprise.businessLicense;
            return {
                number: selectedEnterprise.creditCode || '统一社会信用代码：91XXXXXXXXXXXXXXXXX',
                image: businessLicense ? getImageUrl(businessLicense) : undefined,
                hasImage: !!businessLicense
            };
        }
        return {
            number: component.manualBusinessLicense || '统一社会信用代码：91XXXXXXXXXXXXXXXXX',
            image: undefined,
            hasImage: false
        };
    };

    // 获取开户许可证信息
    const getBankPermitInfo = () => {
        if (selectedEnterprise) {
            const bankPermit = selectedEnterprise.bankPermit;
            const bankPermitNumber = selectedEnterprise.bankPermitNumber;
            return {
                number: component.manualBankPermit || bankPermitNumber || '开户许可证核准号：J1XXXXXXXXXXXXXXXX',
                image: bankPermit ? getImageUrl(bankPermit) : undefined,
                hasImage: !!bankPermit
            };
        }
        return {
            number: component.manualBankPermit || '开户许可证核准号：J1XXXXXXXXXXXXXXXX',
            image: undefined,
            hasImage: false
        };
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <Card
                    size="small"
                    style={{
                        border: '1px solid #d9d9d9',
                        borderRadius: '8px',
                        ...component.style
                    }}
                >
                    {selectedEnterprise ? (
                        <div style={{ padding: '20px' }}>
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
                                            {selectedEnterprise.enterpriseName}营业执照
                                        </div>

                                        {/* 营业执照图片 */}
                                        {getBusinessLicenseInfo().hasImage ? (
                                            <div style={{
                                                width: '100%',
                                                marginBottom: '8px'
                                            }}>
                                                <Image
                                                    src={getBusinessLicenseInfo().image}
                                                    width="100%"
                                                    style={{
                                                        borderRadius: '6px',
                                                        border: '1px solid #d9d9d9',
                                                        width: '100%',
                                                        height: 'auto'
                                                    }}
                                                    preview={false}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                marginBottom: '8px'
                                            }}>
                                                <div style={{
                                                    width: '100%',
                                                    height: '120px',
                                                    borderRadius: '6px',
                                                    border: '2px dashed #d9d9d9',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#fafafa',
                                                    color: '#8c8c8c',
                                                    fontSize: '12px'
                                                }}>
                                                    <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                                                        <div style={{ width: '16px', height: '16px', color: '#8c8c8c' }}>
                                                            {getLinearIcon('certificate')}
                                                        </div>
                                                    </div>
                                                    <div>营业执照</div>
                                                    <div style={{ fontSize: '10px', marginTop: '4px' }}>
                                                        暂无图片
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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
                                            {selectedEnterprise.enterpriseName}开户许可证
                                        </div>

                                        {/* 开户许可证图片 */}
                                        {getBankPermitInfo().hasImage ? (
                                            <div style={{
                                                width: '100%',
                                                marginBottom: '8px'
                                            }}>
                                                <Image
                                                    src={getBankPermitInfo().image}
                                                    width="100%"
                                                    style={{
                                                        borderRadius: '6px',
                                                        border: '1px solid #d9d9d9',
                                                        width: '100%',
                                                        height: 'auto'
                                                    }}
                                                    preview={false}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                marginBottom: '8px'
                                            }}>
                                                <div style={{
                                                    width: '100%',
                                                    height: '120px',
                                                    borderRadius: '6px',
                                                    border: '2px dashed #d9d9d9',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#fafafa',
                                                    color: '#8c8c8c',
                                                    fontSize: '12px'
                                                }}>
                                                    <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                                                        <div style={{ width: '16px', height: '16px', color: '#8c8c8c' }}>
                                                            {getLinearIcon('certificate')}
                                                        </div>
                                                    </div>
                                                    <div>开户许可证</div>
                                                    <div style={{ fontSize: '10px', marginTop: '4px' }}>
                                                        暂无图片
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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
                            <div style={{ fontSize: '24px', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                <div style={{ width: '24px', height: '24px', color: '#8c8c8c' }}>
                                    {getLinearIcon('certificate')}
                                </div>
                            </div>
                            <div>请在属性面板中选择企业</div>
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                                选择后将显示企业证照信息
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default OurCertificateComponent;