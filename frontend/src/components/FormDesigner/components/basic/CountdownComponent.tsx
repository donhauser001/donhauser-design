import React, { useState, useEffect } from 'react';
import { FormComponent } from '../../../../types/formDesigner';
import { useFormDesignerStore } from '../../../../stores/formDesignerStore';

interface CountdownComponentProps {
    component: FormComponent;
    isDesignMode?: boolean;
}

const CountdownComponent: React.FC<CountdownComponentProps> = ({ component, isDesignMode = false }) => {
    const { theme } = useFormDesignerStore();
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        total: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            let targetTime: number;

            if (component.syncWithFormExpiry) {
                // TODO: 这里将来需要从表单设置中获取有效期
                // 目前先使用一个示例时间（7天后）
                targetTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
            } else {
                targetTime = component.targetDate ? new Date(component.targetDate).getTime() : Date.now() + 24 * 60 * 60 * 1000;
            }

            const now = Date.now();
            const difference = targetTime - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds, total: difference });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
            }
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [component.targetDate, component.syncWithFormExpiry]);

    const formatTime = () => {
        const format = component.countdownFormat || 'DD天 HH:mm:ss';

        if (timeLeft.total <= 0) {
            return component.finishedText || '时间到！';
        }

        return format
            .replace('DD', timeLeft.days.toString().padStart(2, '0'))
            .replace('HH', timeLeft.hours.toString().padStart(2, '0'))
            .replace('mm', timeLeft.minutes.toString().padStart(2, '0'))
            .replace('ss', timeLeft.seconds.toString().padStart(2, '0'));
    };

    // 获取主题颜色
    const primaryColor = theme.primaryColor || '#1890ff';

    const containerStyle = {
        width: '100%',
        padding: component.style?.padding || '16px',
        margin: component.style?.margin || '0',
        backgroundColor: component.style?.backgroundColor || `${primaryColor}10`,
        borderRadius: component.style?.borderRadius || '8px',
        border: component.style?.borderWidth ?
            `${component.style.borderWidth} ${component.style.borderStyle || 'solid'} ${component.style.borderColor || primaryColor}` :
            `2px solid ${primaryColor}`,
        textAlign: 'center' as const,
        ...component.style
    };

    const timeStyle = {
        fontSize: component.style?.fontSize || '24px',
        fontWeight: component.style?.fontWeight || 'bold',
        color: timeLeft.total <= 0 ? '#ff4d4f' : (component.style?.color || primaryColor),
        lineHeight: component.style?.lineHeight || '1.2',
        marginBottom: '8px'
    };

    const placeholderStyle = {
        padding: '16px',
        backgroundColor: '#f5f5f5',
        border: '2px dashed #d9d9d9',
        borderRadius: '4px',
        textAlign: 'center' as const,
        color: '#8c8c8c',
        fontSize: '14px'
    };

    const shouldShowCountdown = component.syncWithFormExpiry || component.targetDate;

    const prefixStyle = {
        fontSize: (component.style?.fontSize ? parseInt(component.style.fontSize) * 0.7 : 16) + 'px',
        fontWeight: component.style?.fontWeight || '400',
        color: component.style?.color || '#666',
        lineHeight: '1.4',
        marginBottom: '4px'
    };

    const suffixStyle = {
        fontSize: (component.style?.fontSize ? parseInt(component.style.fontSize) * 0.7 : 16) + 'px',
        fontWeight: component.style?.fontWeight || '400',
        color: component.style?.color || '#666',
        lineHeight: '1.4',
        marginTop: '4px'
    };

    return (
        <div style={{ width: '100%' }}>
            {shouldShowCountdown ? (
                <div style={containerStyle}>
                    {/* 前缀文本 */}
                    {component.countdownPrefix && timeLeft.total > 0 && (
                        <div style={prefixStyle}>
                            {component.countdownPrefix}
                        </div>
                    )}

                    {/* 倒计时主体 */}
                    <div style={timeStyle}>
                        {formatTime()}
                    </div>

                    {/* 后缀文本 */}
                    {component.countdownSuffix && timeLeft.total > 0 && (
                        <div style={suffixStyle}>
                            {component.countdownSuffix}
                        </div>
                    )}
                </div>
            ) : (
                <div style={placeholderStyle}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                    </div>
                    <div>请设置目标日期或启用表单有效期同步</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#999' }}>
                        设置一个未来的日期和时间，或开启与表单有效期同步
                    </div>
                </div>
            )}

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

export default CountdownComponent;
