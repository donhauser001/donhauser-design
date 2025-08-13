import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch, InputNumber } from 'antd';
import { FormComponent } from '../../../types/formDesigner';
import { getOrganizationEnterprises, Enterprise } from '../../../api/enterprises';

const { Option } = Select;
const { TextArea } = Input;

interface ContractComponentsProps {
    component: FormComponent;
    onPropertyChange: (field: string, value: any) => void;
}

const ContractComponents: React.FC<ContractComponentsProps> = ({ component, onPropertyChange }) => {
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [loading, setLoading] = useState(false);

    // 获取企业列表
    useEffect(() => {
        const fetchEnterprises = async () => {
            setLoading(true);
            try {
                const response = await getOrganizationEnterprises();
                if (response.success) {
                    setEnterprises(response.data);
                }
            } catch (error) {
                console.error('获取企业列表失败:', error);
                // 如果API失败，使用默认选项
                setEnterprises([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEnterprises();
    }, []);
    // 合同名称组件属性 - 基本就是单行文本，使用通用属性即可
    const renderContractNameProperties = () => {
        return (
            <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f6f8fa',
                    border: '1px solid #e1e4e8',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#586069'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                        合同名称组件说明
                    </div>
                    <div>
                        • 用于输入合同的完整名称<br />
                        • 支持图标、占位符和字段描述设置<br />
                        • 可以设置为必填字段<br />
                        • 建议设置清晰的占位符文本以指导用户输入
                    </div>
                </div>
            </Form.Item>
        );
    };

    // 合同方组件属性
    const renderContractPartyProperties = () => {
        return (
            <>
                <Form.Item label="合作方数量">
                    <InputNumber
                        min={2}
                        value={component.partyCount || 2}
                        onChange={(value) => onPropertyChange('partyCount', value)}
                        style={{ width: '100%' }}
                        placeholder="设置合作方数量"
                    />
                </Form.Item>

                <Form.Item label="我方为">
                    <Select
                        value={component.ourParty || '甲'}
                        onChange={(value) => onPropertyChange('ourParty', value)}
                        style={{ width: '100%' }}
                        placeholder="选择我方为哪一方"
                    >
                        <Option value="甲">甲方</Option>
                        <Option value="乙">乙方</Option>
                        <Option value="丙">丙方</Option>
                        <Option value="丁">丁方</Option>
                        <Option value="戊">戊方</Option>
                        <Option value="己">己方</Option>
                        <Option value="庚">庚方</Option>
                        <Option value="辛">辛方</Option>
                        <Option value="壬">壬方</Option>
                        <Option value="癸">癸方</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="我方承接团队">
                    <Select
                        value={component.ourTeam || ''}
                        onChange={(value) => onPropertyChange('ourTeam', value)}
                        style={{ width: '100%' }}
                        placeholder="选择我方承接团队"
                        allowClear
                        loading={loading}
                        notFoundContent={loading ? '加载中...' : '暂无数据'}
                    >
                        {enterprises.map((enterprise) => (
                            <Option key={enterprise.id} value={enterprise.enterpriseName}>
                                {enterprise.enterpriseName}
                                {enterprise.enterpriseAlias && ` (${enterprise.enterpriseAlias})`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="客户数据开关">
                    <Switch
                        checked={component.enableClientData || false}
                        onChange={(checked) => onPropertyChange('enableClientData', checked)}
                    />
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                        开启后，除我方外，其他方可从客户和联系人数据中选择
                    </div>
                </Form.Item>

                <Form.Item label="包含字段" style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>公司名称</span>
                            <Switch
                                checked={component.showCompanyName !== false}
                                onChange={(checked) => onPropertyChange('showCompanyName', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>简称</span>
                            <Switch
                                checked={component.showShortName || false}
                                onChange={(checked) => onPropertyChange('showShortName', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>统一社会信用代码</span>
                            <Switch
                                checked={component.showCreditCode || false}
                                onChange={(checked) => onPropertyChange('showCreditCode', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>地址</span>
                            <Switch
                                checked={component.showAddress || false}
                                onChange={(checked) => onPropertyChange('showAddress', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>联系人</span>
                            <Switch
                                checked={component.showContactPerson !== false}
                                onChange={(checked) => onPropertyChange('showContactPerson', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>电话</span>
                            <Switch
                                checked={component.showPhone || false}
                                onChange={(checked) => onPropertyChange('showPhone', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>邮箱</span>
                            <Switch
                                checked={component.showEmail || false}
                                onChange={(checked) => onPropertyChange('showEmail', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>法人代表</span>
                            <Switch
                                checked={component.showLegalRepresentative || false}
                                onChange={(checked) => onPropertyChange('showLegalRepresentative', checked)}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>法人代表证件号码</span>
                            <Switch
                                checked={component.showLegalRepresentativeId || false}
                                onChange={(checked) => onPropertyChange('showLegalRepresentativeId', checked)}
                            />
                        </div>
                    </div>
                </Form.Item>

                <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#f6f8fa',
                        border: '1px solid #e1e4e8',
                        borderRadius: '6px',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: '#586069'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                            合同方组件说明
                        </div>
                        <div>
                            • 可设置合作方数量，默认为2方，最小为2方<br />
                            • 可指定我方为哪一方（甲方、乙方等），默认为甲方<br />
                            • 可选择我方承接团队，用于内部项目管理<br />
                            • 开启客户数据开关后，非我方可从客户和联系人数据中选择<br />
                            • 支持配置多种字段：公司名称、简称、统一社会信用代码、法人代表证件号码等<br />
                            • 公司名称和联系人字段默认开启<br />
                            • 其他字段可根据需要开启或关闭<br />
                            • 将根据设置的字段为每个合作方生成对应的输入表单
                        </div>
                    </div>
                </Form.Item>
            </>
        );
    };

    // 合同条款组件属性
    const renderContractTermsProperties = () => {
        return (
            <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f6f8fa',
                    border: '1px solid #e1e4e8',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#586069'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                        合同条款组件说明
                    </div>
                    <div>
                        • 用于显示合同的具体条款内容<br />
                        • 使用预设文本模式，可以预先配置常用条款<br />
                        • 支持多行文本和格式化显示<br />
                        • 可以作为合同模板的一部分使用
                    </div>
                </div>
            </Form.Item>
        );
    };

    // 签章组件属性
    const renderSignatureProperties = () => {
        return (
            <Form.Item label="使用说明" style={{ marginBottom: 0 }}>
                <div style={{
                    padding: '12px',
                    backgroundColor: '#f6f8fa',
                    border: '1px solid #e1e4e8',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    color: '#586069'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#24292e' }}>
                        签章组件说明
                    </div>
                    <div>
                        • 用于标记合同签章位置<br />
                        • 显示签章提示文本<br />
                        • 可以自定义签章区域的提示内容<br />
                        • 在正式合同中作为签章位置标识
                    </div>
                </div>
            </Form.Item>
        );
    };

    // 根据组件类型渲染不同的属性
    const renderComponentProperties = () => {
        switch (component.type) {
            case 'contractName':
                return renderContractNameProperties();
            case 'contractParty':
                return renderContractPartyProperties();
            case 'contractTerms':
                return renderContractTermsProperties();
            case 'signature':
                return renderSignatureProperties();
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

export default ContractComponents;
