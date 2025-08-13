// 表单组件类型
export type ComponentType =
    | 'input'
    | 'textarea'
    | 'presetText'
    | 'number'
    | 'select'
    | 'radio'
    | 'date'
    | 'upload'
    | 'image'
    | 'slider'
    | 'html'
    | 'countdown'
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
    | 'ourCertificate'
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
    fontWeight?: string | number;
    color?: string;
    lineHeight?: string;
    textAlign?: string;
    gap?: string; // 用于分栏容器的列间距
    columnPadding?: string; // 用于分栏容器的栏内边距
    borderWidth?: string; // 边框宽度
    borderStyle?: string; // 边框样式
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
    // 通用属性
    hideLabel?: boolean; // 隐藏标签
    icon?: string; // 图标
    fieldDescription?: string; // 字段说明
    defaultValue?: any; // 默认值
    // 单行文本特有属性
    inputFormat?: 'text' | 'email' | 'name' | 'phone'; // 输入格式
    // 数字组件特有属性
    showThousandSeparator?: boolean; // 显示千分号
    decimalPlaces?: number; // 小数位数
    unit?: string; // 单位
    // 日期组件特有属性
    showTimePicker?: boolean; // 包含时间选择
    autoCurrentTime?: boolean; // 自动抓取当前时间
    // 文件上传组件特有属性
    maxFileSize?: number; // 最大文件大小(MB)
    allowedFileTypes?: string[]; // 允许的文件类型
    maxFileCount?: number; // 最大文件数量
    uploadButtonText?: string; // 上传按钮文本
    uploadTip?: string; // 上传提示文本
    uploadType?: 'button' | 'dragger'; // 上传类型：按钮或拖拽
    showFileList?: boolean; // 显示文件列表
    validation?: ValidationRule[];
    style?: ComponentStyle;
    options?: Array<{ label: string; value: any; defaultSelected?: boolean }>; // 用于select、radio、checkbox
    allowMultiple?: boolean; // 允许多选（用于radio/checkbox合并组件）
    optionLayout?: 'vertical' | 'horizontal'; // 选项布局方向
    optionColumns?: number; // 横排时的分列数
    // 下拉选择特有属性
    allowClear?: boolean; // 允许清空选择
    allowSearch?: boolean; // 允许搜索选项
    selectMode?: 'single' | 'multiple'; // 选择模式：单选或多选
    // 图片组件特有属性
    imageUrl?: string; // 图片URL（单图模式）
    imageWidth?: string; // 图片宽度
    imageHeight?: string; // 图片高度
    imageAlt?: string; // 图片描述
    imageList?: Array<{ url: string; name: string; alt: string; id: string }>; // 多图列表
    imageMode?: 'single' | 'multiple' | 'slideshow'; // 图片模式
    imageColumns?: number; // 多图模式的列数
    // 嘱托组件特有属性
    showCharCount?: boolean; // 显示字符统计
    maxLength?: number; // 最大字符数
    enableRichText?: boolean; // 启用富文本编辑器
    richTextHeight?: number; // 富文本编辑器高度
    showImageName?: boolean; // 显示图片名称
    slideshowInterval?: number; // 幻灯片切换间隔（秒）
    slideshowAutoplay?: boolean; // 自动播放幻灯片
    // 滑块组件特有属性
    sliderMode?: 'slider' | 'rate'; // 滑块模式：滑动条或星星评级
    min?: number; // 最小值
    max?: number; // 最大值
    step?: number; // 步长
    marks?: { [key: number]: string }; // 刻度标记
    sliderAlign?: 'left' | 'center' | 'right'; // 滑块对齐方式
    // HTML内容组件特有属性
    htmlContent?: string; // HTML内容
    // 倒计时组件特有属性
    targetDate?: string; // 目标日期
    countdownFormat?: string; // 倒计时格式
    finishedText?: string; // 结束后显示的文本
    countdownPrefix?: string; // 倒计时前缀文本
    countdownSuffix?: string; // 倒计时后缀文本
    syncWithFormExpiry?: boolean; // 与表单有效期同步
    // 项目组件特有属性
    fromProjectTable?: boolean; // 来自项目表（用于projectName组件）
    showClient?: boolean; // 显示客户信息
    showStatus?: boolean; // 显示项目状态
    showContact?: boolean; // 显示联系人信息
    // 客户组件特有属性
    fromClientTable?: boolean; // 来自客户表（用于client组件）
    showClientCategory?: boolean; // 显示客户分类
    showClientRating?: boolean; // 显示客户评级
    // 联系人组件特有属性
    fromContactTable?: boolean; // 来自联系人表（用于contact组件）
    showContactPhone?: boolean; // 显示联系人电话
    showContactEmail?: boolean; // 显示联系人邮箱
    showContactCompany?: boolean; // 显示联系人公司
    showContactPosition?: boolean; // 显示联系人职位
    enableCompanyFilter?: boolean; // 公司过滤（根据客户组件的选择过滤联系人）
    allowMultipleContacts?: boolean; // 允许多选联系人
    // 报价单组件特有属性
    fromQuotationTable?: boolean; // 来自报价单表（用于quotation组件）
    selectedQuotationId?: string; // 选择的报价单ID（在属性面板中设置）
    quotationDisplayMode?: 'card' | 'tabs' | 'list'; // 报价单显示模式：卡片列表、选项卡形式、列表形式
    quotationNameDisplay?: 'show' | 'hide' | 'custom'; // 报价单名称显示模式：显示、隐藏、自定义
    customQuotationName?: string; // 自定义报价单名称
    showPricingPolicy?: boolean; // 显示价格政策标签
    policyDetailMode?: 'hover' | 'modal' | 'append'; // 政策详情呈现方式：悬停、弹窗、附加到价格说明
    // 订单组件特有属性
    titleDisplay?: 'show' | 'hide' | 'custom'; // 标题显示模式：显示、隐藏、自定义
    customTitle?: string; // 自定义标题文本
    associationMode?: 'quotation' | 'project' | 'auto' | 'select'; // 关联模式：关联报价单、关联项目、自动、请选择关联
    // 任务列表组件特有属性
    displayMode?: 'list' | 'text'; // 显示模式：列表模式、静态文本模式
    // 合同方组件特有属性
    partyCount?: number; // 合作方数量，默认为2方，最小为2方
    showCompanyName?: boolean; // 显示公司名称字段
    showShortName?: boolean; // 显示简称字段
    showCreditCode?: boolean; // 显示统一社会信用代码字段
    showAddress?: boolean; // 显示地址字段
    showContactPerson?: boolean; // 显示联系人字段
    showPhone?: boolean; // 显示电话字段
    showEmail?: boolean; // 显示邮箱字段
    showLegalRepresentative?: boolean; // 显示法人代表字段
    showLegalRepresentativeId?: boolean; // 显示法人代表证件号码字段
    ourParty?: string; // 我方为哪一方（甲方、乙方等）
    ourTeam?: string; // 我方承接团队
    selectedContactId?: string; // 选中的联系人用户ID（仅我方）
    enableClientData?: boolean; // 启用客户数据开关
    // 我方证照组件特有属性
    selectedEnterprise?: string; // 选择的企业
    showBusinessLicense?: boolean; // 显示营业执照
    showOrganizationCode?: boolean; // 显示组织机构代码证
    showTaxRegistration?: boolean; // 显示税务登记证
    showBankPermit?: boolean; // 显示开户许可证
    // 手动编辑的证照信息（优先级高于企业数据）
    manualBusinessLicense?: string; // 手动输入的营业执照号
    manualOrganizationCode?: string; // 手动输入的组织机构代码
    manualTaxRegistration?: string; // 手动输入的税务登记证号
    manualBankPermit?: string; // 手动输入的开户许可证号
    // 证照图片
    BusinessLicenseImage?: string; // 营业执照图片URL
    OrganizationCodeImage?: string; // 组织机构代码证图片URL
    TaxRegistrationImage?: string; // 税务登记证图片URL
    BankPermitImage?: string; // 开户许可证图片URL
    parentId?: string; // 父容器ID，null表示在根容器中
    order: number; // 排序
    columnIndex?: number; // 用于分栏容器，标识组件属于哪一列
    // 布局组件特有属性
    columns?: number; // 用于columnContainer
    current?: number; // 用于pagination和steps
    total?: number; // 用于pagination
    pageSize?: number; // 用于pagination
    showSizeChanger?: boolean; // 用于pagination - 显示每页条数选择器
    showQuickJumper?: boolean; // 用于pagination - 显示页码跳转
    showTotal?: boolean; // 用于pagination - 显示总数
    align?: 'left' | 'center' | 'right'; // 用于pagination - 对齐方式
    steps?: Array<{ title: string; description: string }>; // 用于steps
    direction?: 'horizontal' | 'vertical'; // 用于steps - 步骤方向
    size?: 'small' | 'default'; // 用于steps - 步骤大小
    status?: 'wait' | 'process' | 'finish' | 'error'; // 用于steps - 步骤状态
    // 分割线属性
    dividerStyle?: 'solid' | 'dashed' | 'dotted'; // 用于divider - 线条样式
    thickness?: number; // 用于divider - 线条粗细
    lineColor?: string; // 用于divider - 线条颜色
    title?: string; // 用于divider - 标题文本
    description?: string; // 用于divider - 说明文本
    textAlign?: 'left' | 'center' | 'right'; // 用于divider - 文本对齐
    descriptionPosition?: 'above' | 'below'; // 用于divider - 说明文本位置
    titleStyle?: {
        fontSize?: string;
        fontWeight?: string | number;
        color?: string;
    }; // 用于divider - 标题样式
    descriptionStyle?: {
        fontSize?: string;
        fontWeight?: string | number;
        color?: string;
    }; // 用于divider - 描述样式
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