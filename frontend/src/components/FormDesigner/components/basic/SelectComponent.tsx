import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface SelectComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const [selectValue, setSelectValue] = useState(getInitialValue());

    // 监听外部值变化（比如逻辑规则导致的值变化）
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== selectValue) {
            setSelectValue(currentValue);
        }
    }, [getValue, selectValue]);

    // 处理选择值变化
    const handleChange = (value: any) => {
        setSelectValue(value);
        setValue(value);
    };
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
            value={selectValue !== undefined && selectValue !== null && selectValue !== '' ? selectValue : getDefaultValue()}
            mode={component.selectMode === 'multiple' ? 'multiple' : undefined}
            allowClear={component.allowClear}
            showSearch={component.allowSearch}
            disabled={isDesignMode}
            style={{ width: '100%' }}
            onChange={handleChange}
            options={component.options?.map(opt => ({
                label: opt.label,
                value: opt.value
            }))}
        />
    );

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={{
                ...getComponentContentStyle(theme),
                ...component.style
            }}>
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
                            pointerEvents: 'none'
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
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default SelectComponent; 