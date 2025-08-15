import { useCallback, useEffect, useState } from 'react';
import { FormComponent } from '../../../types/formDesigner';
import { globalLogicEngine } from '../utils/logicEngine';
import { useFormDesignerStore } from '../../../stores/formDesignerStore';

// 用于组件与逻辑引擎交互的 Hook
export const useLogicEngine = (component: FormComponent, isDesignMode: boolean = false) => {
    const { getComponentValue, setComponentValue } = useFormDesignerStore();
    const [logicEngineValue, setLogicEngineValue] = useState<any>(undefined);

    // 在非设计模式下，监听逻辑引擎的值变化
    useEffect(() => {
        if (!isDesignMode) {
            const handleValueChange = (value: any) => {
                console.log(`useLogicEngine ${component.id}: 收到逻辑引擎值变化通知 ${value}`);
                setLogicEngineValue(value);
            };

            globalLogicEngine.addValueChangeListener(component.id, handleValueChange);

            return () => {
                globalLogicEngine.removeValueChangeListener(component.id, handleValueChange);
            };
        }
    }, [component.id, isDesignMode]);

    // 获取组件当前值
    const getValue = useCallback(() => {
        if (isDesignMode) {
            // 设计模式下从 store 获取值
            return getComponentValue(component.id);
        } else {
            // 运行模式下优先使用逻辑引擎推送的值，否则从逻辑引擎获取值
            return logicEngineValue !== undefined ? logicEngineValue : globalLogicEngine.getComponentValue(component.id);
        }
    }, [component.id, isDesignMode, getComponentValue, logicEngineValue]);

    // 设置组件值并触发逻辑规则
    const setValue = useCallback((value: any) => {
        if (isDesignMode) {
            // 设计模式下只更新 store
            setComponentValue(component.id, value);
        } else {
            // 运行模式下更新逻辑引擎，这会触发规则执行
            globalLogicEngine.updateComponentValue(component.id, value);
            // 同时更新 store 以保持一致性
            setComponentValue(component.id, value);
        }
    }, [component.id, isDesignMode, setComponentValue]);

    // 获取组件的初始值
    const getInitialValue = useCallback(() => {
        const currentValue = getValue();
        if (currentValue !== undefined && currentValue !== null) {
            return currentValue;
        }
        return component.defaultValue || '';
    }, [getValue, component.defaultValue]);

    return {
        getValue,
        setValue,
        getInitialValue
    };
};
