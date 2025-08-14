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

    return (
        <div style={{ width: '100%' }}>
            <Select
                placeholder={component.placeholder || '请选择'}
                value={getDefaultValue()}
                mode={component.selectMode === 'multiple' ? 'multiple' : undefined}
                allowClear={component.allowClear}
                showSearch={component.allowSearch}
                disabled={true}
                style={{ width: '100%' }}
                prefix={getPrefix()}
                options={component.options?.map(opt => ({
                    label: opt.label,
                    value: opt.value
                }))}
            />
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