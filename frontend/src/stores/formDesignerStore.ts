import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { FormComponent, FormDesignerState, FormDesignerAction, LayoutConfig, ThemeConfig } from '../types/formDesigner';
import ComponentRegistry from '../components/FormDesigner/ComponentRegistry';

// 默认布局配置
const defaultLayout: LayoutConfig = {
    columns: 1,
    gutter: 16,
    responsive: true
};

// 默认主题配置
const defaultTheme: ThemeConfig = {
    primaryColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderColor: '#d9d9d9',
    borderRadius: '6px',
    fontSize: '14px'
};

// 订单项接口
export interface OrderItem {
    id: string;
    serviceName: string;
    categoryName: string;
    unitPrice: number;
    unit: string;
    quantity: number;
    priceDescription: string;
    pricingPolicyIds?: string[];
    pricingPolicyNames?: string[];
    selectedPolicies?: string[]; // 用户选择的政策ID
    subtotal: number;
    originalPrice?: number; // 原价
    discountAmount?: number; // 优惠金额
    calculationDetails?: string; // 计算详情
}

interface FormDesignerStore extends FormDesignerState {
    // 存储组件的运行时选择值（仅在设计模式下使用）
    componentValues: Record<string, any>;

    // 订单相关状态
    selectedServices: Record<string, any[]>; // 按报价单组件ID存储选中的服务
    orderItems: Record<string, OrderItem[]>; // 按订单组件ID存储订单项
    pricingPolicies: any[]; // 价格政策数据

    // Actions
    addComponent: (type: string, position?: number, parentId?: string) => void;
    addComponentToColumn: (type: string, position: number, parentId: string, columnIndex: number) => void;
    moveComponentToColumn: (componentId: string, position: number, parentId: string, columnIndex: number) => void;
    updateComponent: (id: string, updates: Partial<FormComponent>) => void;
    batchUpdateComponents: (updates: Array<{ id: string, updates: Partial<FormComponent> }>) => void;
    deleteComponent: (id: string) => void;
    moveComponent: (id: string, newIndex: number, newParentId?: string) => void;
    moveComponentToPosition: (componentId: string, targetComponentId: string, parentId?: string) => void;
    selectComponent: (id: string | null) => void;
    copyComponent: (id: string) => void;
    pasteComponent: (position: number, parentId?: string) => void;
    duplicateComponent: (id: string) => void;
    undo: () => void;
    redo: () => void;
    updateLayout: (layout: Partial<LayoutConfig>) => void;
    updateTheme: (theme: Partial<ThemeConfig>) => void;
    loadFormConfig: (config: any) => void;
    clearForm: () => void;

    // 运行时值管理
    setComponentValue: (componentId: string, value: any) => void;
    getComponentValue: (componentId: string) => any;

    // Helper methods
    getComponentsByParent: (parentId?: string) => FormComponent[];

    // 订单相关方法
    addServiceToOrder: (quotationComponentId: string, orderComponentId: string, service: any) => void;
    removeServiceFromOrder: (orderComponentId: string, serviceId: string) => void;
    updateOrderItemQuantity: (orderComponentId: string, serviceId: string, quantity: number) => void;
    updateOrderItemPolicies: (orderComponentId: string, serviceId: string, selectedPolicies: string[]) => void;
    getOrderItems: (orderComponentId: string) => OrderItem[];
    getOrderTotal: (orderComponentId: string) => number;
    isServiceSelected: (orderComponentId: string, serviceId: string) => boolean;
    clearOrderItems: (orderComponentId: string) => void;
    loadPricingPolicies: () => Promise<void>;
    calculateItemPrice: (orderItem: OrderItem) => { originalPrice: number; discountedPrice: number; discountAmount: number; calculationDetails: string };
    addOrderItems: (orderComponentId: string, items: OrderItem[]) => void;
}

export const useFormDesignerStore = create<FormDesignerStore>((set, get) => ({
    // 初始状态
    components: [],
    selectedComponent: null,
    clipboard: null,
    history: [],
    currentStep: -1,
    layout: defaultLayout,
    theme: defaultTheme,
    componentValues: {},
    selectedServices: {},
    orderItems: {},
    pricingPolicies: [],
    // 辅助方法
    getComponentsByParent: (parentId?: string) => {
        return get().components
            .filter(comp => comp.parentId === parentId)
            .sort((a, b) => a.order - b.order);
    },

    // Actions
    addComponent: (type: string, position?: number, parentId?: string) => {
        const componentMeta = ComponentRegistry.getComponent(type as any);
        if (!componentMeta) return;

        const newComponent: FormComponent = {
            id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: componentMeta.type,
            label: componentMeta.defaultProps.label || componentMeta.name,
            placeholder: componentMeta.defaultProps.placeholder,
            required: componentMeta.defaultProps.required || false,
            disabled: componentMeta.defaultProps.disabled || false,
            options: componentMeta.defaultProps.options,
            parentId: parentId,
            order: position !== undefined ? position : get().getComponentsByParent(parentId).length
        };

        const action: FormDesignerAction = {
            type: 'ADD_COMPONENT',
            component: newComponent
        };

        set(state => {
            const newComponents = [...state.components];
            // 计算同父级的兄弟集合
            const siblings = newComponents
                .filter(c => c.parentId === parentId)
                .sort((a, b) => a.order - b.order);
            const insertAt = position !== undefined ? Math.min(Math.max(position, 0), siblings.length) : siblings.length;
            // 更新同父级后续项的顺序
            siblings.forEach(sib => {
                if (sib.order >= insertAt) sib.order = sib.order + 1;
            });
            newComponents.push(newComponent);
            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1,
                selectedComponent: newComponent.id
            };
        });
    },

    addComponentToColumn: (type: string, position: number, parentId: string, columnIndex: number) => {
        const componentMeta = ComponentRegistry.getComponent(type as any);
        if (!componentMeta) return;

        const newComponent: FormComponent = {
            id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: componentMeta.type,
            label: componentMeta.defaultProps.label || componentMeta.name,
            placeholder: componentMeta.defaultProps.placeholder,
            required: componentMeta.defaultProps.required || false,
            disabled: componentMeta.defaultProps.disabled || false,
            options: componentMeta.defaultProps.options,
            parentId: parentId,
            columnIndex: columnIndex, // 设置列索引
            order: position
        };

        const action: FormDesignerAction = {
            type: 'ADD_COMPONENT',
            component: newComponent
        };

        set(state => ({
            components: [...state.components, newComponent],
            selectedComponent: newComponent.id,
            history: [...state.history.slice(0, state.currentStep + 1), action],
            currentStep: state.currentStep + 1
        }));
    },

    moveComponentToColumn: (componentId: string, position: number, parentId: string, columnIndex: number) => {
        const action: FormDesignerAction = {
            type: 'MOVE_COMPONENT',
            id: componentId,
            newOrder: position
        };

        set(state => {
            const component = state.components.find(comp => comp.id === componentId);
            if (!component) return state;

            const newComponents = [...state.components];
            const componentIndex = newComponents.findIndex(comp => comp.id === componentId);

            if (componentIndex !== -1) {
                newComponents[componentIndex] = {
                    ...newComponents[componentIndex],
                    parentId: parentId,
                    columnIndex: columnIndex,
                    order: position
                };
            }

            console.log('moveComponentToColumn 完成:', {
                componentId,
                parentId,
                columnIndex,
                position
            });

            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1
            };
        });
    },

    updateComponent: (id: string, updates: Partial<FormComponent>) => {
        const action: FormDesignerAction = {
            type: 'UPDATE_COMPONENT',
            id,
            updates
        };

        set(state => ({
            components: state.components.map(comp =>
                comp.id === id ? { ...comp, ...updates } : comp
            ),
            history: [...state.history.slice(0, state.currentStep + 1), action],
            currentStep: state.currentStep + 1
        }));
    },

    batchUpdateComponents: (updates: Array<{ id: string, updates: Partial<FormComponent> }>) => {
        const action: FormDesignerAction = {
            type: 'BATCH_UPDATE_COMPONENTS',
            updates
        };

        set(state => {
            const newComponents = [...state.components];

            // 批量更新所有组件
            updates.forEach(({ id, updates: componentUpdates }) => {
                const index = newComponents.findIndex(comp => comp.id === id);
                if (index !== -1) {
                    newComponents[index] = {
                        ...newComponents[index],
                        ...componentUpdates
                    };
                }
            });

            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1
            };
        });
    },

    deleteComponent: (id: string) => {
        const action: FormDesignerAction = {
            type: 'DELETE_COMPONENT',
            id
        };

        set(state => {
            const newComponents = state.components.filter(comp => comp.id !== id);

            // 重新排序
            newComponents.forEach((comp, index) => {
                comp.order = index;
            });

            return {
                components: newComponents,
                selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1
            };
        });
    },

    moveComponent: (id: string, targetOrder: number, newParentId?: string) => {
        const action: FormDesignerAction = {
            type: 'MOVE_COMPONENT',
            id,
            newOrder: targetOrder
        };

        set(state => {
            const component = state.components.find(comp => comp.id === id);
            if (!component) return state;

            let newComponents = [...state.components];
            const oldParentId = component.parentId;
            // 修复：当newParentId为undefined时，应该保持为undefined（表示移动到画布）
            const actualNewParentId = newParentId;

            console.log('moveComponent 调试:', {
                componentId: id,
                oldParentId,
                newParentId,
                actualNewParentId,
                targetOrder
            });

            // 处理跨容器移动
            if (oldParentId !== actualNewParentId) {
                console.log('跨容器移动:', oldParentId, '->', actualNewParentId);

                // 更新组件的父级和order
                const componentIndex = newComponents.findIndex(comp => comp.id === id);
                if (componentIndex !== -1) {
                    newComponents[componentIndex] = {
                        ...newComponents[componentIndex],
                        parentId: actualNewParentId,
                        order: targetOrder
                    };
                }

                // 重新整理旧父级下的组件order
                const oldSiblings = newComponents.filter(c => c.parentId === oldParentId && c.id !== id);
                oldSiblings.sort((a, b) => a.order - b.order);
                oldSiblings.forEach((sibling, index) => {
                    const compIndex = newComponents.findIndex(c => c.id === sibling.id);
                    if (compIndex !== -1) {
                        newComponents[compIndex] = {
                            ...newComponents[compIndex],
                            order: index
                        };
                    }
                });

                // 重新整理新父级下的组件order
                const newSiblings = newComponents.filter(c => c.parentId === actualNewParentId);
                newSiblings.sort((a, b) => a.order - b.order);
                newSiblings.forEach((sibling, index) => {
                    const compIndex = newComponents.findIndex(c => c.id === sibling.id);
                    if (compIndex !== -1) {
                        newComponents[compIndex] = {
                            ...newComponents[compIndex],
                            order: index
                        };
                    }
                });
            } else {
                // 同级移动：使用arrayMove
                const siblings = newComponents.filter(c => c.parentId === actualNewParentId);
                siblings.sort((a, b) => a.order - b.order);

                const moveIndex = siblings.findIndex(s => s.id === id);
                const targetIndex = siblings.findIndex(s => s.order === targetOrder);

                if (moveIndex !== -1 && targetIndex !== -1) {
                    const reorderedSiblings = arrayMove(siblings, moveIndex, targetIndex);

                    reorderedSiblings.forEach((sibling, index) => {
                        const compIndex = newComponents.findIndex(c => c.id === sibling.id);
                        if (compIndex !== -1) {
                            newComponents[compIndex] = {
                                ...newComponents[compIndex],
                                order: index
                            };
                        }
                    });
                }
            }

            // 获取最终的兄弟组件用于日志
            const finalSiblings = newComponents.filter(c => c.parentId === actualNewParentId);

            console.log('moveComponent 完成:', {
                componentId: id,
                newParentId: actualNewParentId,
                targetOrder,
                reorderedComponents: finalSiblings.map(s => ({ id: s.id, order: s.order }))
            });

            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1
            };
        });
    },

    moveComponentToPosition: (componentId: string, targetComponentId: string, parentId?: string) => {
        const action: FormDesignerAction = {
            type: 'MOVE_COMPONENT',
            id: componentId,
            newOrder: 0 // 临时值，实际计算在下面
        };

        set(state => {
            const component = state.components.find(comp => comp.id === componentId);
            const targetComponent = state.components.find(comp => comp.id === targetComponentId);

            if (!component || !targetComponent) return state;

            let newComponents = [...state.components];

            // 获取同一父级下的所有组件，按order排序
            const siblings = newComponents
                .filter(c => c.parentId === parentId)
                .sort((a, b) => a.order - b.order);

            console.log('排序前兄弟组件:', siblings.map(s => ({ id: s.id, order: s.order })));

            // 找到当前组件和目标组件在排序后数组中的索引
            const currentIndex = siblings.findIndex(s => s.id === componentId);
            const targetIndex = siblings.findIndex(s => s.id === targetComponentId);

            console.log('索引信息:', { currentIndex, targetIndex, componentId, targetComponentId });

            if (currentIndex !== -1 && targetIndex !== -1) {
                // 使用arrayMove重新排序
                const reorderedSiblings = arrayMove(siblings, currentIndex, targetIndex);

                // 重新分配order值
                reorderedSiblings.forEach((sibling, index) => {
                    const compIndex = newComponents.findIndex(c => c.id === sibling.id);
                    if (compIndex !== -1) {
                        newComponents[compIndex] = {
                            ...newComponents[compIndex],
                            order: index
                        };
                    }
                });

                console.log('moveComponentToPosition 完成:', {
                    componentId,
                    targetComponentId,
                    parentId: parentId || '画布',
                    currentIndex,
                    targetIndex,
                    reorderedComponents: reorderedSiblings.map(s => ({ id: s.id, order: newComponents.find(c => c.id === s.id)?.order }))
                });
            }

            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1
            };
        });
    },

    selectComponent: (id: string | null) => {
        const action: FormDesignerAction = {
            type: 'SELECT_COMPONENT',
            id
        };

        set(state => ({
            selectedComponent: id,
            history: [...state.history.slice(0, state.currentStep + 1), action],
            currentStep: state.currentStep + 1
        }));
    },

    copyComponent: (id: string) => {
        const component = get().components.find(comp => comp.id === id);
        if (!component) return;

        const action: FormDesignerAction = {
            type: 'COPY_COMPONENT',
            component: { ...component }
        };

        set(state => ({
            clipboard: { ...component },
            history: [...state.history.slice(0, state.currentStep + 1), action],
            currentStep: state.currentStep + 1
        }));
    },

    pasteComponent: (position: number) => {
        const { clipboard } = get();
        if (!clipboard) return;

        const newComponent: FormComponent = {
            ...clipboard,
            id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            order: position
        };

        const action: FormDesignerAction = {
            type: 'PASTE_COMPONENT',
            position
        };

        set(state => {
            const newComponents = [...state.components];
            newComponents.splice(position, 0, newComponent);

            // 重新排序
            newComponents.forEach((comp, index) => {
                comp.order = index;
            });

            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1,
                selectedComponent: newComponent.id
            };
        });
    },

    duplicateComponent: (id: string) => {
        const component = get().components.find(comp => comp.id === id);
        if (!component) return;

        const currentIndex = get().components.findIndex(comp => comp.id === id);
        const newComponent: FormComponent = {
            ...component,
            id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            order: currentIndex + 1
        };

        const action: FormDesignerAction = {
            type: 'ADD_COMPONENT',
            component: newComponent
        };

        set(state => {
            const newComponents = [...state.components];
            // 更新后续组件的顺序
            newComponents.forEach(comp => {
                if (comp.order > currentIndex) {
                    comp.order = comp.order + 1;
                }
            });
            // 插入新组件
            newComponents.splice(currentIndex + 1, 0, newComponent);

            return {
                components: newComponents,
                history: [...state.history.slice(0, state.currentStep + 1), action],
                currentStep: state.currentStep + 1,
                selectedComponent: newComponent.id
            };
        });
    },



    undo: () => {
        const { currentStep } = get();
        if (currentStep <= 0) return;

        set(state => ({
            currentStep: state.currentStep - 1
        }));
    },

    redo: () => {
        const { currentStep } = get();
        if (currentStep >= history.length - 1) return;

        set(state => ({
            currentStep: state.currentStep + 1
        }));
    },

    updateLayout: (layout: Partial<LayoutConfig>) => {
        const action: FormDesignerAction = {
            type: 'UPDATE_LAYOUT',
            layout
        };

        set(state => ({
            layout: { ...state.layout, ...layout },
            history: [...state.history.slice(0, state.currentStep + 1), action],
            currentStep: state.currentStep + 1
        }));
    },

    updateTheme: (theme: Partial<ThemeConfig>) => {
        const action: FormDesignerAction = {
            type: 'UPDATE_THEME',
            theme
        };

        set(state => ({
            theme: { ...state.theme, ...theme },
            history: [...state.history.slice(0, state.currentStep + 1), action],
            currentStep: state.currentStep + 1
        }));
    },

    loadFormConfig: (config: any) => {
        set({
            components: config.components || [],
            layout: config.layout || defaultLayout,
            theme: config.theme || defaultTheme,
            selectedComponent: null,
            clipboard: null,
            history: [],
            currentStep: -1
        });
    },

    clearForm: () => {
        set({
            components: [],
            selectedComponent: null,
            clipboard: null,
            history: [],
            currentStep: -1,
            layout: defaultLayout,
            theme: defaultTheme,
            componentValues: {}
        });
    },

    // 运行时值管理
    setComponentValue: (componentId: string, value: any) => {
        set(state => ({
            componentValues: {
                ...state.componentValues,
                [componentId]: value
            }
        }));
    },

    getComponentValue: (componentId: string) => {
        return get().componentValues[componentId];
    },

    // 订单相关方法实现
    addServiceToOrder: (_quotationComponentId: string, orderComponentId: string, service: any) => {
        set(state => {
            const currentOrderItems = state.orderItems[orderComponentId] || [];

            // 检查是否已存在该服务
            const existingIndex = currentOrderItems.findIndex(item => item.id === service._id);

            if (existingIndex >= 0) {
                // 如果已存在，从订单中移除（切换功能）
                const filteredItems = currentOrderItems.filter(item => item.id !== service._id);

                return {
                    orderItems: {
                        ...state.orderItems,
                        [orderComponentId]: filteredItems
                    }
                };
            } else {
                // 创建新的订单项
                const newOrderItem: OrderItem = {
                    id: service._id,
                    serviceName: service.serviceName,
                    categoryName: service.categoryName,
                    unitPrice: service.unitPrice,
                    unit: service.unit,
                    quantity: 1,
                    priceDescription: service.priceDescription,
                    pricingPolicyIds: service.pricingPolicyIds,
                    pricingPolicyNames: service.pricingPolicyNames,
                    selectedPolicies: [], // 默认不选择任何政策
                    subtotal: service.unitPrice,
                    originalPrice: service.unitPrice,
                    discountAmount: 0,
                    calculationDetails: service.priceDescription || `按${service.unit}计费`
                };

                return {
                    orderItems: {
                        ...state.orderItems,
                        [orderComponentId]: [...currentOrderItems, newOrderItem]
                    }
                };
            }
        });
    },

    removeServiceFromOrder: (orderComponentId: string, serviceId: string) => {
        set(state => {
            const currentOrderItems = state.orderItems[orderComponentId] || [];
            const filteredItems = currentOrderItems.filter(item => item.id !== serviceId);

            return {
                orderItems: {
                    ...state.orderItems,
                    [orderComponentId]: filteredItems
                }
            };
        });
    },

    updateOrderItemQuantity: (orderComponentId: string, serviceId: string, quantity: number) => {
        set(state => {
            const store = get();
            const currentOrderItems = state.orderItems[orderComponentId] || [];
            const updatedItems = currentOrderItems.map(item => {
                if (item.id === serviceId) {
                    const updatedItem = {
                        ...item,
                        quantity: Math.max(1, quantity), // 最小数量为1
                    };

                    // 重新计算价格
                    const priceResult = store.calculateItemPrice(updatedItem);
                    updatedItem.originalPrice = priceResult.originalPrice;
                    updatedItem.subtotal = priceResult.discountedPrice;
                    updatedItem.discountAmount = priceResult.discountAmount;
                    updatedItem.calculationDetails = priceResult.calculationDetails;

                    return updatedItem;
                }
                return item;
            });

            return {
                orderItems: {
                    ...state.orderItems,
                    [orderComponentId]: updatedItems
                }
            };
        });
    },

    updateOrderItemPolicies: (orderComponentId: string, serviceId: string, selectedPolicies: string[]) => {
        set(state => {
            const store = get();
            const currentOrderItems = state.orderItems[orderComponentId] || [];
            const updatedItems = currentOrderItems.map(item => {
                if (item.id === serviceId) {
                    const updatedItem = {
                        ...item,
                        selectedPolicies
                    };

                    // 重新计算价格
                    const priceResult = store.calculateItemPrice(updatedItem);
                    updatedItem.originalPrice = priceResult.originalPrice;
                    updatedItem.subtotal = priceResult.discountedPrice;
                    updatedItem.discountAmount = priceResult.discountAmount;
                    updatedItem.calculationDetails = priceResult.calculationDetails;

                    return updatedItem;
                }
                return item;
            });

            return {
                orderItems: {
                    ...state.orderItems,
                    [orderComponentId]: updatedItems
                }
            };
        });
    },

    getOrderItems: (orderComponentId: string) => {
        return get().orderItems[orderComponentId] || [];
    },

    getOrderTotal: (orderComponentId: string) => {
        const orderItems = get().orderItems[orderComponentId] || [];
        return orderItems.reduce((total, item) => total + item.subtotal, 0);
    },

    isServiceSelected: (orderComponentId: string, serviceId: string) => {
        const orderItems = get().orderItems[orderComponentId] || [];
        return orderItems.some(item => item.id === serviceId);
    },

    clearOrderItems: (orderComponentId: string) => {
        set(state => ({
            orderItems: {
                ...state.orderItems,
                [orderComponentId]: []
            }
        }));
    },

    loadPricingPolicies: async () => {
        try {
            const response = await fetch('/api/pricing-policies');
            const data = await response.json();
            const policies = data.success ? data.data : data;
            set(state => ({ ...state, pricingPolicies: policies }));
        } catch (error) {
            console.error('加载价格政策失败:', error);
        }
    },

    calculateItemPrice: (orderItem: OrderItem) => {
        const originalPrice = orderItem.unitPrice * orderItem.quantity;
        const pricingPolicies = get().pricingPolicies;

        // 如果没有选择定价政策，返回原价
        if (!orderItem.selectedPolicies || orderItem.selectedPolicies.length === 0) {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                discountAmount: 0,
                calculationDetails: orderItem.priceDescription || `按${orderItem.unit}计费`
            };
        }

        // 获取选中的定价政策
        let selectedPolicy = null;
        if (orderItem.selectedPolicies && orderItem.selectedPolicies.length > 0) {
            const selectedPolicyId = orderItem.selectedPolicies[0];
            selectedPolicy = pricingPolicies.find(p => p._id === selectedPolicyId);

            // 如果从pricingPolicies中找不到，尝试从服务数据中匹配
            if (orderItem.pricingPolicyIds && orderItem.pricingPolicyNames) {
                const selectedIndex = orderItem.pricingPolicyIds.indexOf(selectedPolicyId);
                if (selectedIndex !== -1) {
                    const expectedPolicyName = orderItem.pricingPolicyNames[selectedIndex];
                    if (selectedPolicy && selectedPolicy.name !== expectedPolicyName && selectedPolicy.alias !== expectedPolicyName) {
                        selectedPolicy = pricingPolicies.find(p => p.name === expectedPolicyName || p.alias === expectedPolicyName);
                    }
                }
            }
        }

        if (!selectedPolicy || selectedPolicy.status !== 'active') {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                discountAmount: 0,
                calculationDetails: orderItem.priceDescription || `按${orderItem.unit}计费`
            };
        }

        let discountedPrice = originalPrice;
        let calculationDetails = '';

        if (selectedPolicy.type === 'uniform_discount') {
            // 统一折扣
            const discountRatio = selectedPolicy.discountRatio || 100;
            discountedPrice = (originalPrice * discountRatio) / 100;
            const discountAmount = originalPrice - discountedPrice;
            calculationDetails = `${orderItem.priceDescription || `按${orderItem.unit}计费`}\n\n优惠说明:\n统一按照${discountRatio}%计费\n小计:￥${orderItem.unitPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×${orderItem.quantity}${orderItem.unit}×${discountRatio}%=￥${discountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n优惠：￥${discountAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (selectedPolicy.type === 'tiered_discount' && selectedPolicy.tierSettings) {
            // 阶梯折扣
            const unitPrice = orderItem.unitPrice;
            let totalDiscountedPrice = 0;
            let tierDetails: string[] = [];

            const sortedTiers = [...selectedPolicy.tierSettings].sort((a, b) => (a.startQuantity || 0) - (b.startQuantity || 0));
            let remainingQuantity = orderItem.quantity;

            for (const tier of sortedTiers) {
                if (remainingQuantity <= 0) break;

                const startQuantity = tier.startQuantity || 0;
                const endQuantity = tier.endQuantity || Infinity;
                const discountRatio = tier.discountRatio || 100;

                let tierQuantity = 0;
                if (endQuantity === Infinity) {
                    tierQuantity = remainingQuantity;
                } else {
                    const tierCapacity = endQuantity - startQuantity + 1;
                    tierQuantity = Math.min(remainingQuantity, tierCapacity);
                }

                if (tierQuantity > 0) {
                    const tierPrice = unitPrice * tierQuantity;
                    const tierDiscountedPrice = (tierPrice * discountRatio) / 100;
                    totalDiscountedPrice += tierDiscountedPrice;

                    let tierRange = '';
                    if (startQuantity === endQuantity) {
                        tierRange = `第${startQuantity}${orderItem.unit}`;
                    } else if (endQuantity === Infinity) {
                        tierRange = `${startQuantity}${orderItem.unit}及以上`;
                    } else {
                        tierRange = `第${startQuantity}-${endQuantity}${orderItem.unit}`;
                    }

                    const tierDetail = `${tierRange}：￥${unitPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${tierQuantity}${orderItem.unit} × ${discountRatio}% = ￥${tierDiscountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    tierDetails.push(tierDetail);
                    remainingQuantity -= tierQuantity;
                }
            }

            discountedPrice = totalDiscountedPrice;

            // 生成优惠说明
            let discountDescription = '';
            for (let i = 0; i < sortedTiers.length; i++) {
                const tier = sortedTiers[i];
                const startQuantity = tier.startQuantity || 0;
                const endQuantity = tier.endQuantity || Infinity;
                const discountRatio = tier.discountRatio || 100;

                if (i > 0) discountDescription += '，';

                if (startQuantity === endQuantity) {
                    discountDescription += `第${startQuantity}${orderItem.unit}按${discountRatio}%计费`;
                } else if (endQuantity === Infinity) {
                    discountDescription += `${startQuantity}${orderItem.unit}及以上按${discountRatio}%计费`;
                } else {
                    discountDescription += `${startQuantity}-${endQuantity}${orderItem.unit}按${discountRatio}%计费`;
                }
            }

            calculationDetails = `${orderItem.priceDescription || `按${orderItem.unit}计费`}\n\n优惠说明:\n${discountDescription}\n${tierDetails.join('\n')}\n\n小计：${tierDetails.map(detail => detail.split(' = ')[1]).join('+')}=￥${totalDiscountedPrice.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n优惠：￥${(originalPrice - totalDiscountedPrice).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        const discountAmount = originalPrice - discountedPrice;

        return {
            originalPrice,
            discountedPrice,
            discountAmount,
            calculationDetails
        };
    },

    addOrderItems: (orderComponentId: string, items: OrderItem[]) => {
        set(state => ({
            orderItems: {
                ...state.orderItems,
                [orderComponentId]: [...(state.orderItems[orderComponentId] || []), ...items]
            }
        }));
    }
})); 