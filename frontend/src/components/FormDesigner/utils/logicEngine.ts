import { FormComponent, LogicRule } from '../../../types/formDesigner';

// 逻辑执行引擎
export class LogicEngine {
    private componentValues: Record<string, any> = {};
    private logicRules: LogicRule[] = [];
    private valueChangeListeners: Record<string, ((value: any) => void)[]> = {};
    private stateVersion: number = 0;

    constructor(logicRules: LogicRule[] = []) {
        this.logicRules = logicRules;
    }

    // 更新组件值
    updateComponentValue(componentId: string, value: any) {
        console.log(`逻辑引擎: 更新组件值 ${componentId} = ${value}`);
        this.componentValues[componentId] = value;
        this.executeRules();
    }

    // 获取组件值
    getComponentValue(componentId: string): any {
        return this.componentValues[componentId];
    }

    // 获取状态版本（用于触发React重新渲染）
    getStateVersion(): number {
        return this.stateVersion;
    }

    // 添加值变化监听器
    addValueChangeListener(componentId: string, listener: (value: any) => void) {
        if (!this.valueChangeListeners[componentId]) {
            this.valueChangeListeners[componentId] = [];
        }
        this.valueChangeListeners[componentId].push(listener);
    }

    // 移除值变化监听器
    removeValueChangeListener(componentId: string, listener: (value: any) => void) {
        if (this.valueChangeListeners[componentId]) {
            const index = this.valueChangeListeners[componentId].indexOf(listener);
            if (index > -1) {
                this.valueChangeListeners[componentId].splice(index, 1);
            }
        }
    }

    // 通知值变化
    private notifyValueChange(componentId: string, value: any) {
        const listeners = this.valueChangeListeners[componentId];
        if (listeners) {
            listeners.forEach(listener => listener(value));
        }
    }

    // 设置逻辑规则
    setLogicRules(rules: LogicRule[]) {
        console.log('LogicEngine: 设置逻辑规则', {
            rulesCount: rules.length,
            rules: rules
        });
        this.logicRules = rules;
        console.log('LogicEngine: 规则设置完成，当前引擎中的规则数量:', this.logicRules.length);
    }

    // 检查条件是否满足
    private checkCondition(sourceValue: any, condition: string, targetValue: string): boolean {
        // 处理空值情况
        if (sourceValue === undefined || sourceValue === null) {
            sourceValue = '';
        }

        // 转换为字符串进行比较
        const sourceStr = String(sourceValue);
        const targetStr = String(targetValue);

        switch (condition) {
            case 'equals':
                return sourceStr === targetStr;
            case 'notEquals':
                return sourceStr !== targetStr;
            case 'greater':
                // 尝试数字比较，如果不是数字则按字符串比较
                const sourceNum = parseFloat(sourceStr);
                const targetNum = parseFloat(targetStr);
                if (!isNaN(sourceNum) && !isNaN(targetNum)) {
                    return sourceNum > targetNum;
                }
                return sourceStr > targetStr;
            case 'less':
                const sourceNum2 = parseFloat(sourceStr);
                const targetNum2 = parseFloat(targetStr);
                if (!isNaN(sourceNum2) && !isNaN(targetNum2)) {
                    return sourceNum2 < targetNum2;
                }
                return sourceStr < targetStr;
            case 'contains':
                return sourceStr.includes(targetStr);
            case 'notContains':
                return !sourceStr.includes(targetStr);
            default:
                return false;
        }
    }

    // 执行所有逻辑规则
    private executeRules() {
        console.log(`逻辑引擎: 执行规则, 共 ${this.logicRules.length} 条规则`);
        console.log('当前组件值:', this.componentValues);

        const appliedChanges: Record<string, any> = {};

        for (const rule of this.logicRules) {
            // 获取源组件的值
            const sourceValue = this.componentValues[rule.sourceComponent];

            console.log(`检查规则: ${rule.sourceComponent} ${rule.condition} ${rule.value}, 当前值: ${sourceValue}`);

            // 检查条件是否满足
            if (this.checkCondition(sourceValue, rule.condition, rule.value)) {
                console.log(`规则条件满足! 执行动作: ${rule.type} - ${rule.action}`);

                if (rule.type === 'visibility') {
                    // 可见性逻辑：修改目标组件的visibility属性
                    appliedChanges[rule.targetComponent] = {
                        ...appliedChanges[rule.targetComponent],
                        visibility: rule.action
                    };
                } else if (rule.type === 'linkage') {
                    // 联动逻辑：修改目标组件的值
                    console.log(`设置组件 ${rule.targetComponent} 的值为: ${rule.targetValue}`);
                    this.componentValues[rule.targetComponent] = rule.targetValue;

                    // 通知值变化监听器
                    this.notifyValueChange(rule.targetComponent, rule.targetValue);

                    appliedChanges[rule.targetComponent] = {
                        ...appliedChanges[rule.targetComponent],
                        value: rule.targetValue
                    };
                }
            } else {
                console.log('规则条件不满足');
            }
        }

        console.log('应用的变更:', appliedChanges);

        // 递增状态版本以触发React重新渲染
        this.stateVersion++;
        console.log(`逻辑引擎状态版本更新: ${this.stateVersion}`);

        // 触发组件更新回调（如果有的话）
        if (Object.keys(appliedChanges).length > 0) {
            this.onRulesExecuted?.(appliedChanges);
        }
    }

    // 规则执行完成的回调
    onRulesExecuted?: (changes: Record<string, any>) => void;

    // 获取组件的计算后属性（包含逻辑规则的影响）
    getComputedComponentProps(component: FormComponent): Partial<FormComponent> {
        const computedProps: Partial<FormComponent> = {};

        // 检查是否有影响该组件的逻辑规则
        for (const rule of this.logicRules) {
            if (rule.targetComponent === component.id) {
                const sourceValue = this.componentValues[rule.sourceComponent];

                if (this.checkCondition(sourceValue, rule.condition, rule.value)) {
                    if (rule.type === 'visibility') {
                        computedProps.visibility = rule.action as any;
                    } else if (rule.type === 'linkage') {
                        // 对于联动逻辑，我们可能需要设置默认值或其他属性
                        computedProps.defaultValue = rule.targetValue;
                    }
                }
            }
        }

        return computedProps;
    }

    // 初始化组件值
    initializeComponentValues(components: FormComponent[]) {
        for (const component of components) {
            if (this.componentValues[component.id] === undefined) {
                // 设置初始值
                this.componentValues[component.id] = component.defaultValue || '';
            }
        }
    }

    // 重置所有组件值
    reset() {
        this.componentValues = {};
    }
}

// 创建全局逻辑引擎实例
export const globalLogicEngine = new LogicEngine();
