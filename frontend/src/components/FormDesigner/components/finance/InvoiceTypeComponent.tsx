import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getLinearIcon } from '../../utils/iconUtils';

interface InvoiceTypeComponentProps {
    component: FormComponent;
}

const InvoiceTypeComponent: React.FC<InvoiceTypeComponentProps> = ({ component }) => {
    const getOptions = () => {
        if (component.invoiceOptions && component.invoiceOptions.length > 0) {
            return component.invoiceOptions.map(option => ({
                label: option,
                value: option
            }));
        }

        return component.options?.map(opt => ({
            label: opt.label,
            value: opt.value
        })) || [
                { label: '增值税普通发票', value: '增值税普通发票' },
                { label: '增值税专用发票', value: '增值税专用发票' },
                { label: '电子发票', value: '电子发票' },
                { label: '纸质发票', value: '纸质发票' },
                { label: '收据', value: '收据' }
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
            const containerClass = `invoice-type-select-with-icon-${component.id}`;
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
            placeholder={component.placeholder || '请选择发票类型'}
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
        <div style={{ width: '100%' }}>
            {renderSelectWithIcon(selectComponent)}
            {component.fieldDescription && (
                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px', lineHeight: '1.4' }}>
                    提示：{component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default InvoiceTypeComponent; 