import React from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import dayjs from 'dayjs';

interface ArticlePublishTimeComponentProps {
    component: FormComponent;
}

const ArticlePublishTimeComponent: React.FC<ArticlePublishTimeComponentProps> = ({ component }) => {
    const showTime = component.showTimePicker !== false; // 默认显示时间选择器

    return (
        <DatePicker
            placeholder={component.placeholder || '请选择发布时间'}
            disabled={component.disabled}
            style={{ width: '100%', ...component.style }}
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
        />
    );
};

export default ArticlePublishTimeComponent;
