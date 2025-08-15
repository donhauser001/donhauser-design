import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import dayjs from 'dayjs';
import { useLogicEngine } from '../../hooks/useLogicEngine';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface DateComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const DateComponent: React.FC<DateComponentProps> = ({ component, isDesignMode = false }) => {
    const { getValue, setValue, getInitialValue } = useLogicEngine(component, isDesignMode);
    const { theme } = useFormDesignerStore();
    const [dateValue, setDateValue] = useState(getInitialValue());

    // 监听外部值变化
    useEffect(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null && currentValue !== dateValue) {
            setDateValue(currentValue);
        }
    }, [getValue, dateValue]);

    // 处理日期变化
    const handleChange = (date: any, dateString: string) => {
        setDateValue(dateString);
        setValue(dateString);
    };
    // 获取当前日期值（优先使用逻辑引擎的值）
    const getCurrentDateValue = () => {
        const currentValue = dateValue || component.defaultValue;

        // 如果开启了自动抓取当前时间且没有其他值，显示当前时间
        if (component.autoCurrentTime && !currentValue) {
            return dayjs();
        }

        if (!currentValue) return null;
        try {
            return dayjs(currentValue);
        } catch {
            return null;
        }
    };

    // 根据是否启用时间选择来渲染不同的DatePicker
    const renderDatePicker = () => {

        if (component.showTimePicker) {
            // 启用时间选择
            return (
                <DatePicker
                    showTime={{
                        format: 'HH:mm:ss'
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={component.placeholder || '请选择日期时间'}
                    value={getCurrentDateValue()}
                    disabled={isDesignMode}
                    onChange={handleChange}
                    style={{ width: '100%', ...component.style }}
                />
            );
        } else {
            // 只选择日期
            return (
                <DatePicker
                    format="YYYY-MM-DD"
                    placeholder={component.placeholder || '请选择日期'}
                    value={getCurrentDateValue()}
                    disabled={isDesignMode}
                    onChange={handleChange}
                    style={{ width: '100%', ...component.style }}
                />
            );
        }
    };

    return (
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
                {renderDatePicker()}
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default DateComponent; 