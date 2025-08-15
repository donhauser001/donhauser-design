import React from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import dayjs from 'dayjs';

interface ArticlePublishTimeComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ArticlePublishTimeComponent: React.FC<ArticlePublishTimeComponentProps> = ({ component, isDesignMode = false }) => {
    const showTime = component.showTimePicker !== false; // 默认显示时间选择器

    // 获取默认值
    const getDefaultValue = () => {
        if (component.autoCurrentTime) {
            return dayjs();
        }
        if (component.defaultValue) {
            return dayjs(component.defaultValue);
        }
        return undefined;
    };

    return (
        <div style={{ width: '100%' }}>
            <DatePicker
                placeholder={component.placeholder || '请选择发布时间'}
                disabled={component.disabled}
                style={{ width: '100%', ...component.style }}
                value={getDefaultValue()}
                showTime={showTime ? {
                    format: 'HH:mm:ss',
                    defaultValue: component.autoCurrentTime ? dayjs() : undefined
                } : false}
                format={showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
                allowClear={component.allowClear !== false}
                showToday={component.showToday !== false}
                showNow={component.showNow !== false}
                disabledDate={component.disablePastDates ? (current) => {
                    return current && current < dayjs().startOf('day');
                } : undefined}
                disabled={isDesignMode}
            />
            {component.fieldDescription && (
                <div style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    marginTop: '4px',
                    lineHeight: '1.4'
                }}>
                    提示：{component.fieldDescription}
                </div>
            )}
        </div>
    );
};

export default ArticlePublishTimeComponent;
