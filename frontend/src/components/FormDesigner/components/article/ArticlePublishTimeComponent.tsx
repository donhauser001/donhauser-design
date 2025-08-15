import React from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';
import dayjs from 'dayjs';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';
import { renderTopDescription, renderBottomDescription, renderRightDescription, getDescriptionContainerStyle, getComponentContentStyle  } from '../../utils/descriptionUtils';

interface ArticlePublishTimeComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const ArticlePublishTimeComponent: React.FC<ArticlePublishTimeComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();
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
        <div style={getDescriptionContainerStyle(theme)}>
            {renderTopDescription({ component, theme })}

            <div style={getComponentContentStyle(theme)}>
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
            </div>

            {renderBottomDescription({ component, theme })}
            {renderRightDescription({ component, theme })}
        </div>
    );
};

export default ArticlePublishTimeComponent;
