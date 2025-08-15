import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getLinearIcon } from '../../utils/iconUtils';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface PaymentMethodComponentProps {
    component: FormComponent;
}

const PaymentMethodComponent: React.FC<PaymentMethodComponentProps> = ({ component }) => {
    const { theme } = useFormDesignerStore();
    const getOptions = () => {
        if (component.paymentOptions && component.paymentOptions.length > 0) {
            return component.paymentOptions.map(option => ({
                label: option,
                value: option
            }));
        }

        return component.options?.map(opt => ({
            label: opt.label,
            value: opt.value
        })) || [
                { label: '银行转账', value: '银行转账' },
                { label: '现金', value: '现金' },
                { label: '支票', value: '支票' },
                { label: '支付宝', value: '支付宝' },
                { label: '微信支付', value: '微信支付' },
                { label: '信用卡', value: '信用卡' }
            ];
    };

    const getPrefix = () => {
        if (component.icon) {
            const icon = getLinearIcon(component.icon);
            if (icon) {
                return <span style={{ opacity: 1, display: 'inline-flex', alignItems: 'center' }}>{icon}</span>;
            }
        }
        return <span style={{ opacity: 0, width: '0px' }}></span>;
    };

    const renderSelectWithIcon = (selectComponent: React.ReactElement) => {
        if (component.icon) {
            const containerClass = `payment-method-select-with-icon-${component.id}`;
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
                        top: 'calc(50% + 2px)',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}>
                        {getPrefix()}
                    </div>
                    {selectComponent}
                </div>
            );
        }
        return selectComponent;
    };

    const selectComponent = (
        <Select
            placeholder={component.placeholder || '请选择付款方式'}
            disabled={component.disabled}
            style={{ width: '100%', ...component.style }}
            allowClear={component.allowClear}
            showSearch={component.allowSearch}
            options={getOptions()}
            filterOption={(input, option) =>
                option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
            }
        />
    );

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                {renderSelectWithIcon(selectComponent)}
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default PaymentMethodComponent; 