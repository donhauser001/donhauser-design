import React from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import dayjs from 'dayjs';

interface DateComponentProps {
    component: FormComponent;
}

const DateComponent: React.FC<DateComponentProps> = ({ component }) => {
    // 根据是否启用时间选择来渲染不同的DatePicker
    const renderDatePicker = () => {
        // 获取默认值
        const getDefaultValue = () => {
            // 如果开启了自动抓取当前时间，显示当前时间
            if (component.autoCurrentTime) {
                return dayjs();
            }

            if (!component.defaultValue) return null;
            try {
                return dayjs(component.defaultValue);
            } catch {
                return null;
            }
        };

        if (component.showTimePicker) {
            // 启用时间选择
            return (
                <DatePicker
                    showTime={{
                        format: 'HH:mm:ss'
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={component.placeholder || '请选择日期时间'}
                    value={getDefaultValue()}
                    disabled={true}
                    style={{ width: '100%', ...component.style }}
                />
            );
        } else {
            // 只选择日期
            return (
                <DatePicker
                    format="YYYY-MM-DD"
                    placeholder={component.placeholder || '请选择日期'}
                    value={getDefaultValue()}
                    disabled={true}
                    style={{ width: '100%', ...component.style }}
                />
            );
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {renderDatePicker()}
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

export default DateComponent; 