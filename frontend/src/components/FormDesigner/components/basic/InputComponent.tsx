import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import { getIconPrefix } from '../../utils/iconUtils';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderDescription, getDescriptionContainerStyle, getComponentContentStyle } from '../../utils/descriptionUtils';

interface InputComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const InputComponent: React.FC<InputComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const [inputValue, setInputValue] = useState(getInitialValue());

    // 监听外部值变化（比如逻辑规则导致的值变化）
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null && currentValue !== inputValue) {
            console.log(`InputComponent ${component.id}: 外部值变化 ${inputValue} -> ${currentValue}`);
            setInputValue(currentValue);
        }
    }, [getValue, inputValue, component.id]);

    // 处理输入值变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setValue(newValue);
    };
    // 根据输入格式设置类型和验证
    const getInputType = () => {
        switch (component.inputFormat) {
            case 'email':
                return 'email';
            case 'phone':
                return 'tel';
            default:
                return 'text';
        }
    };

    // 根据格式生成占位符
    const getPlaceholder = () => {
        if (component.placeholder) {
            return component.placeholder;
        }

        switch (component.inputFormat) {
            case 'email':
                return '请输入邮箱地址';
            case 'name':
                return '请输入姓名';
            case 'phone':
                return '请输入电话号码';
            default:
                return '请输入内容';
        }
    };

    // 获取图标，始终返回一个prefix以避免DOM结构变化
    const getPrefix = () => {
        return getIconPrefix(component.icon);
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {theme.descriptionPosition === 'top' && renderDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                <Input
                    type={getInputType()}
                    placeholder={getPlaceholder()}
                    value={inputValue}
                    prefix={getPrefix()}
                    style={component.style}
                    readOnly={isDesignMode}
                    onChange={handleChange}
                />
            </div>

            {theme.descriptionPosition === 'bottom' && renderDescription({ component, theme })}
            {theme.descriptionPosition === 'right' && renderDescription({ component, theme })}
        </div>
    );
};

export default InputComponent; 