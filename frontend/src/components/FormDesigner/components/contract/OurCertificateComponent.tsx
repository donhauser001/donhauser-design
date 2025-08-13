import React, { useState, useEffect } from 'react';
import { Card, Space, Image, Modal, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { getOrganizationEnterprises, Enterprise } from '../../../../api/enterprises';

interface OurCertificateComponentProps {
    component: FormComponent;
}

const OurCertificateComponent: React.FC<OurCertificateComponentProps> = ({ component }) => {
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

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

    // 图片预览
    const handlePreview = (imageUrl: string, title: string) => {
        setPreviewImage(imageUrl);
        setPreviewTitle(title);
        setPreviewVisible(true);
    };

    // 渲染证照图片
    const renderCertificateImage = (title: string, imageUrl?: string) => {
        // 模拟企业证照图片（实际应该从企业数据中获取）
        const mockImageUrl = imageUrl || `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`;
        
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    marginBottom: '8px',
                    color: '#262626'
                }}>
                    {title}
                </div>
                <div style={{ position: 'relative' }}>
                    <Image 
                        src={mockImageUrl}
                        width={200}
                        height={120}
                        style={{ 
                            objectFit: 'cover', 
                            borderRadius: '6px',
                            border: '1px solid #d9d9d9'
                        }}
                        preview={false}
                    />
                    <Button 
                        icon={<EyeOutlined />} 
                        size="small"
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderColor: 'transparent',
                            color: 'white'
                        }}
                        onClick={() => handlePreview(mockImageUrl, title)}
                    >
                        预览
                    </Button>
                </div>
            </div>
        );
    };

    // 获取企业营业执照信息
    const getBusinessLicenseInfo = () => {
        if (selectedEnterprise) {
            return {
                number: selectedEnterprise.businessLicense || component.manualBusinessLicense || '统一社会信用代码：91XXXXXXXXXXXXXXXXX',
                image: selectedEnterprise.businessLicenseImage
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
                number: selectedEnterprise.bankPermit || component.manualBankPermit || '开户许可证核准号：J1XXXXXXXXXXXXXXXX',
                image: selectedEnterprise.bankPermitImage
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
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* 营业执照 */}
                    {component.showBusinessLicense !== false && (
                        <div>
                            {renderCertificateImage('营业执照', getBusinessLicenseInfo().image)}
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#8c8c8c', 
                                textAlign: 'center',
                                marginTop: '4px'
                            }}>
                                {getBusinessLicenseInfo().number}
                            </div>
                        </div>
                    )}

                    {/* 开户许可证 */}
                    {component.showBankPermit === true && (
                        <div>
                            {renderCertificateImage('开户许可证', getBankPermitInfo().image)}
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#8c8c8c', 
                                textAlign: 'center',
                                marginTop: '4px'
                            }}>
                                {getBankPermitInfo().number}
                            </div>
                        </div>
                    )}

                    {/* 如果没有选择企业，显示提示 */}
                    {!selectedEnterprise && (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#8c8c8c',
                            fontSize: '14px'
                        }}>
                            请在属性面板中选择企业以显示证照信息
                        </div>
                    )}
                </Space>
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

            {/* 图片预览模态框 */}
            <Modal
                open={previewVisible}
                title={`${previewTitle} - 预览`}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
                width={600}
            >
                <img 
                    alt={previewTitle} 
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} 
                    src={previewImage} 
                />
            </Modal>
        </div>
    );
};

export default OurCertificateComponent;