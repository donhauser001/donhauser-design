import React, { useEffect } from 'react';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import { globalLogicEngine } from './utils/logicEngine';

interface LogicEngineProviderProps {
    children: React.ReactNode;
    isPreviewMode: boolean;
}

const LogicEngineProvider: React.FC<LogicEngineProviderProps> = ({ children, isPreviewMode }) => {
    const { layout, components, updateComponent } = useFormDesignerStore();

    useEffect(() => {
        if (isPreviewMode && layout.logicRules) {
            console.log('初始化逻辑引擎', {
                rulesCount: layout.logicRules.length,
                componentsCount: components.length
            });

            // 设置逻辑规则
            globalLogicEngine.setLogicRules(layout.logicRules);

            // 初始化组件值
            globalLogicEngine.initializeComponentValues(components);

            // 设置规则执行回调
            globalLogicEngine.onRulesExecuted = (changes) => {
                console.log('逻辑规则执行结果:', changes);

                // 批量更新组件属性
                Object.keys(changes).forEach(componentId => {
                    const componentChanges = changes[componentId];
                    if (componentChanges.visibility !== undefined) {
                        console.log(`更新组件 ${componentId} 可见性为:`, componentChanges.visibility);
                        updateComponent(componentId, { visibility: componentChanges.visibility });
                    }
                });
            };
        } else if (!isPreviewMode) {
            // 非预览模式下重置逻辑引擎
            globalLogicEngine.reset();
        }
    }, [isPreviewMode, layout.logicRules, components, updateComponent]);

    return <>{children}</>;
};

export default LogicEngineProvider;
