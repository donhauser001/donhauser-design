import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';

interface SelectComponentProps {
    component: FormComponent;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ component }) => {
    // 获取默认值
    const getDefaultValue = () => {
        if (component.defaultValue) {
            return component.defaultValue;
        }

        // 查找默认选中的选项
        const defaultOptions = component.options?.filter(opt => opt.defaultSelected);
        if (!defaultOptions || defaultOptions.length === 0) {
            return undefined;
        }

        if (component.selectMode === 'multiple') {
            return defaultOptions.map(opt => opt.value);
        } else {
            return defaultOptions[0].value;
        }
    };

    // 获取图标前缀
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    const selectComponent = (
        <Select
            placeholder={component.placeholder || '请选择'}
            value={getDefaultValue()}
            mode={component.selectMode === 'multiple' ? 'multiple' : undefined}
            allowClear={component.allowClear}
            showSearch={component.allowSearch}
            disabled={true}
            style={{ width: '100%' }}
            options={component.options?.map(opt => ({
                label: opt.label,
                value: opt.value
            }))}
        />
    );

    return (
        <div style={{ width: '100%' }}>
            {component.icon ? (
                <div style={{ position: 'relative', width: '100%' }}>
                    <style>
                        {`
                        .select-with-icon-${component.id} .ant-select .ant-select-selector {
                            padding-left: 32px !important;
                        }
                        .select-with-icon-${component.id} .ant-select .ant-select-selection-search-input {
                            padding-left: 32px !important;
                        }
                        .select-with-icon-${component.id} .ant-select .ant-select-selection-item {
                            padding-left: 0 !important;
                        }
                        .select-with-icon-${component.id} .ant-select .ant-select-selection-placeholder {
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
                        pointerEvents: 'none',
                        color: '#8c8c8c'
                    }}>
                        {getPrefix()}
                    </div>
                    <div className={`select-with-icon-${component.id}`}>
                        {selectComponent}
                    </div>
                </div>
            ) : (
                selectComponent
            )}
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

export default SelectComponent; 