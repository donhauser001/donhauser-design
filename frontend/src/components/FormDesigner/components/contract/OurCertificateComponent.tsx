import React, { useState, useEffect } from 'react';
import { Card, Space, Input, Select, Button, Upload, Image, Modal } from 'antd';
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { getOrganizationEnterprises, Enterprise } from '../../../../api/enterprises';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface OurCertificateComponentProps {
    component: FormComponent;
}

const OurCertificateComponent: React.FC<OurCertificateComponentProps> = ({ component }) => {
    const { updateComponent } = useFormDesignerStore();
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

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

    // 处理企业选择
    const handleEnterpriseSelect = (enterpriseName: string) => {
        const enterprise = enterprises.find(e => e.enterpriseName === enterpriseName);
        setSelectedEnterprise(enterprise || null);
        updateComponent(component.id, { 
            selectedEnterprise: enterpriseName,
            // 清除手动编辑的证照信息，重新使用企业数据
            manualBusinessLicense: undefined,
            manualOrganizationCode: undefined,
            manualTaxRegistration: undefined,
            manualBankPermit: undefined
        });
    };

    // 处理手动编辑
    const handleManualEdit = (field: string, value: string) => {
        updateComponent(component.id, {
            [`manual${field}`]: value
        });
    };

    // 获取字段值（优先使用手动编辑值，否则使用企业数据）
    const getFieldValue = (field: string, enterpriseField?: string) => {
        const manualValue = (component as any)[`manual${field}`];
        if (manualValue !== undefined) return manualValue;
        if (selectedEnterprise && enterpriseField) {
            return (selectedEnterprise as any)[enterpriseField] || '';
        }
        return '';
    };

    // 处理证照图片上传
    const handleImageUpload = (field: string, imageUrl: string) => {
        updateComponent(component.id, {
            [`${field}Image`]: imageUrl
        });
    };

    // 处理证照图片删除
    const handleImageDelete = (field: string) => {
        updateComponent(component.id, {
            [`${field}Image`]: ''
        });
    };

    // 图片预览
    const handlePreview = (imageUrl: string) => {
        setPreviewImage(imageUrl);
        setPreviewVisible(true);
    };

    const renderCertificateField = (
        title: string, 
        field: string, 
        enterpriseField?: string,
        placeholder?: string
    ) => {
        const imageUrl = (component as any)[`${field}Image`];
        const isAutoFilled = selectedEnterprise && enterpriseField && 
            (component as any)[`manual${field}`] === undefined;

        return (
            <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: 500 
                }}>
                    {title}
                    {selectedEnterprise && (
                        <span style={{ 
                            color: '#1890ff', 
                            fontSize: '12px', 
                            marginLeft: '8px' 
                        }}>
                            (我方企业)
                        </span>
                    )}
                </label>
                
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {/* 证照号码输入框 */}
                    <Input
                        placeholder={placeholder || `请输入${title}`}
                        value={getFieldValue(field, enterpriseField)}
                        onChange={(e) => handleManualEdit(field, e.target.value)}
                        style={{
                            backgroundColor: isAutoFilled ? '#f6ffed' : undefined,
                            borderColor: isAutoFilled ? '#b7eb8f' : undefined
                        }}
                    />
                    
                    {/* 证照图片上传 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={(info) => {
                                // 这里应该调用实际的上传API
                                // 暂时模拟上传成功
                                if (info.file) {
                                    const mockUrl = `https://via.placeholder.com/200x150?text=${title}`;
                                    handleImageUpload(field, mockUrl);
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />} size="small">
                                上传{title}扫描件
                            </Button>
                        </Upload>
                        
                        {imageUrl && (
                            <>
                                <Button 
                                    icon={<EyeOutlined />} 
                                    size="small"
                                    onClick={() => handlePreview(imageUrl)}
                                >
                                    预览
                                </Button>
                                <Button 
                                    icon={<DeleteOutlined />} 
                                    size="small"
                                    danger
                                    onClick={() => handleImageDelete(field)}
                                >
                                    删除
                                </Button>
                            </>
                        )}
                    </div>
                    
                    {/* 显示缩略图 */}
                    {imageUrl && (
                        <Image 
                            src={imageUrl}
                            width={100}
                            height={60}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                            preview={false}
                        />
                    )}
                </Space>
            </div>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            <Card 
                title="我方证照信息" 
                size="small" 
                style={{ ...component.style }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {/* 企业选择 */}
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontSize: '14px', 
                            fontWeight: 500 
                        }}>
                            选择企业 {component.required && <span style={{ color: '#ff4d4f' }}>*</span>}
                        </label>
                        <Select
                            placeholder="请选择企业"
                            value={component.selectedEnterprise || undefined}
                            onChange={handleEnterpriseSelect}
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            filterOption={(input, option) => 
                                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {enterprises.map((enterprise) => (
                                <Select.Option key={enterprise.id} value={enterprise.enterpriseName}>
                                    {enterprise.enterpriseName}
                                    {enterprise.enterpriseAlias && ` (${enterprise.enterpriseAlias})`}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    {/* 证照字段 */}
                    {component.showBusinessLicense !== false && 
                        renderCertificateField('营业执照', 'BusinessLicense', 'businessLicense', '请输入营业执照号码')}
                    
                    {component.showOrganizationCode !== false && 
                        renderCertificateField('组织机构代码证', 'OrganizationCode', 'organizationCode', '请输入组织机构代码')}
                    
                    {component.showTaxRegistration !== false && 
                        renderCertificateField('税务登记证', 'TaxRegistration', 'taxRegistration', '请输入税务登记证号')}
                    
                    {component.showBankPermit === true && 
                        renderCertificateField('开户许可证', 'BankPermit', 'bankPermit', '请输入开户许可证号')}
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
                title="证照预览"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img 
                    alt="证照预览" 
                    style={{ width: '100%' }} 
                    src={previewImage} 
                />
            </Modal>
        </div>
    );
};

export default OurCertificateComponent;
