import { create } from 'zustand';
// import { arrayMove } from '@dnd-kit/sortable';
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

interface FormDesignerStore extends FormDesignerState {
    // Actions
    addComponent: (type: string, position?: number, parentId?: string) => void;
    updateComponent: (id: string, updates: Partial<FormComponent>) => void;
    deleteComponent: (id: string) => void;
    moveComponent: (id: string, newIndex: number, newParentId?: string) => void;
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

    // Helper methods
    getComponentsByParent: (parentId?: string) => FormComponent[];
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
    // 辅助方法
    getComponentsByParent: (parentId?: string) => {
        return get().components.filter(comp => comp.parentId === parentId);
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

    moveComponent: (id: string, newIndex: number, newParentId?: string) => {
        const action: FormDesignerAction = {
            type: 'MOVE_COMPONENT',
            id,
            newOrder: newIndex
        };

        set(state => {
            const component = state.components.find(comp => comp.id === id);
            if (!component) return state;

            const newComponents = [...state.components];
            const oldParentId = component.parentId;

            // 调整旧父级兄弟顺序（移除该项）
            newComponents
                .filter(c => c.parentId === oldParentId && c.id !== id)
                .forEach(sib => {
                    if (sib.order > component.order) sib.order = sib.order - 1;
                });

            // 调整新父级兄弟顺序（为插入腾位）
            newComponents
                .filter(c => c.parentId === newParentId)
                .forEach(sib => {
                    if (sib.order >= newIndex) sib.order = sib.order + 1;
                });

            // 应用移动
            const componentIndex = newComponents.findIndex(comp => comp.id === id);
            if (componentIndex !== -1) {
                newComponents[componentIndex] = {
                    ...newComponents[componentIndex],
                    parentId: newParentId,
                    order: newIndex
                };
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
            theme: defaultTheme
        });
    }
})); 