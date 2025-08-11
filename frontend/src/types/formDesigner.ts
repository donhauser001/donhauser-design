// 表单组件类型
export type ComponentType =
    | 'input'
    | 'textarea'
    | 'presetText'
    | 'number'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'time'
    | 'upload'
    | 'group'
    | 'divider'
    | 'columnContainer'
    | 'pagination'
    | 'steps'
    // 项目组件
    | 'projectName'
    | 'client'
    | 'contact'
    | 'quotation'
    | 'order'
    | 'instruction'
    | 'taskList'
    // 合同组件
    | 'contractName'
    | 'contractParty'
    | 'contractTerms'
    | 'signature'
    // 文章组件
    | 'author'
    | 'articleSummary'
    // 财务组件
    | 'amount'
    | 'amountInWords'
    | 'total'
    | 'invoiceType'
    | 'invoiceInfo'
    | 'paymentMethod'
    | 'taxRate';

// 验证规则类型
export interface ValidationRule {
    type: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern' | 'custom';
    message: string;
    value?: any;
}

// 组件样式
export interface ComponentStyle {
    width?: string;
    height?: string;
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    fontSize?: string;
    color?: string;
}

// 表单组件配置
export interface FormComponent {
    id: string;
    type: ComponentType;
    label: string;
    placeholder?: string;
    content?: string; // 用于presetText组件
    required?: boolean;
    disabled?: boolean;
    validation?: ValidationRule[];
    style?: ComponentStyle;
    options?: Array<{ label: string; value: any }>; // 用于select、radio、checkbox
    defaultValue?: any;
    parentId?: string; // 父容器ID，null表示在根容器中
    order: number; // 排序
    // 布局组件特有属性
    columns?: number; // 用于columnContainer
    current?: number; // 用于pagination和steps
    total?: number; // 用于pagination
    pageSize?: number; // 用于pagination
    steps?: Array<{ title: string; description: string }>; // 用于steps
}

// 布局配置
export interface LayoutConfig {
    columns: number; // 栅格列数
    gutter: number; // 栅格间距
    responsive: boolean; // 是否响应式
}

// 主题配置
export interface ThemeConfig {
    primaryColor: string;
    backgroundColor: string;
    borderColor: string;
    borderRadius: string;
    fontSize: string;
}

// 表单配置
export interface FormConfig {
    id: string;
    name: string;
    components: FormComponent[];
    layout: LayoutConfig;
    theme: ThemeConfig;
}

// 组件元数据
export interface ComponentMeta {
    type: ComponentType;
    name: string;
    icon: string;
    category: 'basic' | 'project' | 'contract' | 'article' | 'finance' | 'layout';
    description: string;
    defaultProps: Partial<FormComponent>;
}

// 设计器状态
export interface FormDesignerState {
    components: FormComponent[];
    selectedComponent: string | null;
    clipboard: FormComponent | null;
    history: FormDesignerAction[];
    currentStep: number;
    layout: LayoutConfig;
    theme: ThemeConfig;
}

// 设计器操作类型
export type FormDesignerAction =
    | { type: 'ADD_COMPONENT'; component: FormComponent }
    | { type: 'UPDATE_COMPONENT'; id: string; updates: Partial<FormComponent> }
    | { type: 'BATCH_UPDATE_COMPONENTS'; updates: Array<{ id: string, updates: Partial<FormComponent> }> }
    | { type: 'DELETE_COMPONENT'; id: string }
    | { type: 'MOVE_COMPONENT'; id: string; newOrder: number }
    | { type: 'SELECT_COMPONENT'; id: string | null }
    | { type: 'COPY_COMPONENT'; component: FormComponent }
    | { type: 'PASTE_COMPONENT'; position: number }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'UPDATE_LAYOUT'; layout: Partial<LayoutConfig> }
    | { type: 'UPDATE_THEME'; theme: Partial<ThemeConfig> }; 