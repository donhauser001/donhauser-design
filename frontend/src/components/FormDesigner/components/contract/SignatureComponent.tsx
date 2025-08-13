import React from 'react';
import { Alert, Card, Space, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface SignatureComponentProps {
    component: FormComponent;
}

const SignatureComponent: React.FC<SignatureComponentProps> = ({ component }) => {
    const { components } = useFormDesignerStore();

    // 检查画布上是否存在合同方组件
    const hasContractPartyComponent = components.some((comp: FormComponent) => comp.type === 'contractParty');
    
    // 获取合同方组件信息
    const contractPartyComponent = components.find((comp: FormComponent) => comp.type === 'contractParty');
    
    // 获取合作方数量（默认为2）
    const partyCount = contractPartyComponent?.partyCount || 2;
    
    // 生成合作方名称数组（甲方、乙方、丙方...）
    const getPartyNames = (count: number): string[] => {
        const names = ['甲方', '乙方', '丙方', '丁方', '戊方', '己方', '庚方', '辛方', '壬方', '癸方'];
        return names.slice(0, count);
    };
    
    const partyNames = getPartyNames(partyCount);
    
    // 获取合作方公司名称
    const getPartyCompanyName = (partyIndex: number): string => {
        if (!contractPartyComponent) return '';
        
        // 从合同方组件中获取公司名称数据
        const companyName = (contractPartyComponent as any)[`party${partyIndex}CompanyName`];
        return companyName || '';
    };

    // 如果没有合同方组件，显示提示信息
    if (!hasContractPartyComponent) {
        return (
            <div style={{ width: '100%' }}>
                <Alert
                    message="签章组件需要配合合同方组件使用，请先在画布中添加合同方组件"
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{ fontSize: '12px' }}
                />
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
    }

    // 渲染签章区域
    return (
        <div style={{ width: '100%' }}>
            <Card
                title="签字盖章"
                size="small"
                style={{
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    ...component.style
                }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(partyCount, 2)}, 1fr)`, gap: '24px' }}>
                    {partyNames.map((partyName, index) => {
                        const companyName = getPartyCompanyName(index);
                        const displayTitle = companyName ? `${partyName}：${companyName}` : partyName;
                        
                        return (
                            <div key={index} style={{ 
                                padding: '16px',
                                border: '1px solid #f0f0f0',
                                borderRadius: '6px',
                                backgroundColor: '#fafafa'
                            }}>
                                {/* 合作方标题 */}
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#262626',
                                    marginBottom: '12px',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #e8e8e8',
                                    paddingBottom: '8px'
                                }}>
                                    {displayTitle}
                                </div>
                            
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                {/* 联系人签字 */}
                                <div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#8c8c8c',
                                        marginBottom: '4px'
                                    }}>
                                        联系人签字：
                                    </div>
                                    <div style={{
                                        height: '40px',
                                        border: '1px dashed #d9d9d9',
                                        borderRadius: '4px',
                                        backgroundColor: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#bfbfbf',
                                        fontSize: '12px'
                                    }}>
                                        签字区域
                                    </div>
                                </div>
                                
                                {/* 签订日期 */}
                                <div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#8c8c8c',
                                        marginBottom: '4px'
                                    }}>
                                        签订日期：
                                    </div>
                                    <div style={{
                                        padding: '8px',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '4px',
                                        backgroundColor: '#ffffff',
                                        fontSize: '12px',
                                        color: '#595959',
                                        textAlign: 'center'
                                    }}>
                                        ___年___月___日
                                    </div>
                                </div>
                            </Space>
                        </div>
                        );
                    })}
                </div>
                
                {/* 如果合作方超过2个，显示额外的签章区域 */}
                {partyCount > 2 && (
                    <>
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(partyCount - 2, 2)}, 1fr)`, gap: '24px' }}>
                            {partyNames.slice(2).map((partyName, index) => {
                                const partyIndex = index + 2;
                                const companyName = getPartyCompanyName(partyIndex);
                                const displayTitle = companyName ? `${partyName}：${companyName}` : partyName;
                                
                                return (
                                    <div key={partyIndex} style={{ 
                                        padding: '16px',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: '6px',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        {/* 合作方标题 */}
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#262626',
                                            marginBottom: '12px',
                                            textAlign: 'center',
                                            borderBottom: '1px solid #e8e8e8',
                                            paddingBottom: '8px'
                                        }}>
                                            {displayTitle}
                                        </div>
                                    
                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        {/* 联系人签字 */}
                                        <div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#8c8c8c',
                                                marginBottom: '4px'
                                            }}>
                                                联系人签字：
                                            </div>
                                            <div style={{
                                                height: '40px',
                                                border: '1px dashed #d9d9d9',
                                                borderRadius: '4px',
                                                backgroundColor: '#ffffff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#bfbfbf',
                                                fontSize: '12px'
                                            }}>
                                                签字区域
                                            </div>
                                        </div>
                                        
                                        {/* 签订日期 */}
                                        <div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#8c8c8c',
                                                marginBottom: '4px'
                                            }}>
                                                签订日期：
                                            </div>
                                            <div style={{
                                                padding: '8px',
                                                border: '1px solid #e8e8e8',
                                                borderRadius: '4px',
                                                backgroundColor: '#ffffff',
                                                fontSize: '12px',
                                                color: '#595959',
                                                textAlign: 'center'
                                            }}>
                                                ___年___月___日
                                            </div>
                                        </div>
                                    </Space>
                                </div>
                                );
                            })}
                        </div>
                    </>
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

export default SignatureComponent; 