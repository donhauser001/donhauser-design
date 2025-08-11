import { ComponentMeta, ComponentType } from '../../types/formDesigner';

class ComponentRegistry {
    private components = new Map<ComponentType, ComponentMeta>();

    constructor() {
        this.registerDefaultComponents();
    }

    register(type: ComponentType, meta: ComponentMeta) {
        this.components.set(type, meta);
    }

    getComponent(type: ComponentType): ComponentMeta | undefined {
        return this.components.get(type);
    }

    getAllComponents(): ComponentMeta[] {
        return Array.from(this.components.values());
    }

    getComponentsByCategory(category: string): ComponentMeta[] {
        return this.getAllComponents().filter(comp => comp.category === category);
    }

    private registerDefaultComponents() {
        // 基础组件
        this.register('input', {
            type: 'input',
            name: '单行文本',
            icon: 'FormOutlined',
            category: 'basic',
            description: '用于输入单行文本内容',
            defaultProps: {
                label: '单行文本',
                placeholder: '请输入内容',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('textarea', {
            type: 'textarea',
            name: '多行文本',
            icon: 'FileTextOutlined',
            category: 'basic',
            description: '用于输入多行文本内容',
            defaultProps: {
                label: '多行文本',
                placeholder: '请输入内容',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('presetText', {
            type: 'presetText',
            name: '预设文本',
            icon: 'FileTextOutlined',
            category: 'basic',
            description: '显示预设的文本内容',
            defaultProps: {
                label: '预设文本',
                content: '这里是预设的文本内容',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('number', {
            type: 'number',
            name: '数字输入',
            icon: 'NumberOutlined',
            category: 'basic',
            description: '用于输入数字',
            defaultProps: {
                label: '数字输入',
                placeholder: '请输入数字',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('date', {
            type: 'date',
            name: '日期时间',
            icon: 'CalendarOutlined',
            category: 'basic',
            description: '用于选择日期，可选择包含时间',
            defaultProps: {
                label: '日期时间',
                required: false,
                disabled: false,
                showTimePicker: false,
                autoCurrentTime: false,
                order: 0
            }
        });

        this.register('select', {
            type: 'select',
            name: '下拉选择',
            icon: 'DownOutlined',
            category: 'basic',
            description: '从下拉列表中选择选项',
            defaultProps: {
                label: '下拉选择',
                required: false,
                options: [
                    { label: '选项1', value: 'option1', defaultSelected: false },
                    { label: '选项2', value: 'option2', defaultSelected: false },
                    { label: '选项3', value: 'option3', defaultSelected: false }
                ],
                selectMode: 'single',
                allowClear: true,
                allowSearch: false,
                hideLabel: false,
                icon: '',
                fieldDescription: '',
                defaultValue: '',
                placeholder: '请选择',
                order: 0
            }
        });

        this.register('radio', {
            type: 'radio',
            name: '选择按钮',
            icon: 'CheckCircleOutlined',
            category: 'basic',
            description: '用于单选或多选，可通过开关切换模式',
            defaultProps: {
                label: '选择按钮',
                required: false,
                disabled: false,
                allowMultiple: false,
                optionLayout: 'vertical',
                optionColumns: 0,
                options: [
                    { label: '选项1', value: 'option1', defaultSelected: false },
                    { label: '选项2', value: 'option2', defaultSelected: false },
                    { label: '选项3', value: 'option3', defaultSelected: false }
                ],
                order: 0
            }
        });

        // 布局组件
        this.register('group', {
            type: 'group',
            name: '分组',
            icon: 'AppstoreOutlined',
            category: 'layout',
            description: '将相关字段分组显示',
            defaultProps: {
                label: '分组',
                children: [],
                order: 0
            }
        });

        this.register('divider', {
            type: 'divider',
            name: '分割线',
            icon: 'MinusOutlined',
            category: 'layout',
            description: '用于分隔表单内容',
            defaultProps: {
                label: '分割线',
                content: '分隔内容',
                order: 0
            }
        });

        this.register('columnContainer', {
            type: 'columnContainer',
            name: '分栏容器',
            icon: 'AppstoreOutlined',
            category: 'layout',
            description: '创建多列布局容器',
            defaultProps: {
                label: '分栏容器',
                children: [],
                columns: 2,
                order: 0
            }
        });

        this.register('pagination', {
            type: 'pagination',
            name: '分页',
            icon: 'DownOutlined',
            category: 'layout',
            description: '分页导航组件',
            defaultProps: {
                label: '分页',
                current: 1,
                total: 100,
                pageSize: 10,
                order: 0
            }
        });

        this.register('steps', {
            type: 'steps',
            name: '步骤',
            icon: 'CheckCircleOutlined',
            category: 'layout',
            description: '步骤导航组件',
            defaultProps: {
                label: '步骤',
                current: 1,
                steps: [
                    { title: '第一步', description: '开始' },
                    { title: '第二步', description: '进行中' },
                    { title: '第三步', description: '完成' }
                ],
                order: 0
            }
        });

        // 高级组件
        this.register('upload', {
            type: 'upload',
            name: '文件上传',
            icon: 'UploadOutlined',
            category: 'basic',
            description: '用于上传文件，支持多种文件类型和上传方式',
            defaultProps: {
                label: '文件上传',
                required: false,
                disabled: false,
                maxFileSize: 10,
                allowedFileTypes: [],
                maxFileCount: 1,
                uploadButtonText: '点击上传',
                uploadTip: '支持单个文件上传',
                uploadType: 'button',
                showFileList: true,
                order: 0
            }
        });

        this.register('image', {
            type: 'image',
            name: '图片展示',
            icon: 'PictureOutlined',
            category: 'basic',
            description: '用于在表单中展示图片，支持上传、多图和幻灯片模式',
            defaultProps: {
                label: '图片',
                imageUrl: '',
                imageWidth: '200px',
                imageHeight: 'auto',
                imageAlt: '图片',
                imageList: [],
                imageMode: 'single',
                showImageName: true,
                maxImageCount: 9,
                slideshowInterval: 3,
                slideshowAutoplay: true,
                fieldDescription: '',
                order: 0
            }
        });

        this.register('slider', {
            type: 'slider',
            name: '滑块/评级',
            icon: 'SlidersOutlined',
            category: 'basic',
            description: '用滑动条设置数字或星星评级',
            defaultProps: {
                label: '滑块',
                sliderMode: 'slider',
                min: 0,
                max: 100,
                step: 1,
                marks: {},
                defaultValue: 0,
                sliderAlign: 'left',
                hideLabel: false,
                fieldDescription: '',
                order: 0
            }
        });

        this.register('html', {
            type: 'html',
            name: 'HTML内容',
            icon: 'CodeOutlined',
            category: 'basic',
            description: '用于插入自定义HTML内容',
            defaultProps: {
                label: 'HTML内容',
                htmlContent: '<p>这里是HTML内容</p>',
                fieldDescription: '',
                order: 0
            }
        });

        this.register('countdown', {
            type: 'countdown',
            name: '倒计时',
            icon: 'ClockCircleOutlined',
            category: 'basic',
            description: '显示到指定日期的倒计时，支持与表单有效期同步',
            defaultProps: {
                label: '倒计时',
                targetDate: '',
                countdownFormat: 'DD天 HH:mm:ss',
                finishedText: '时间到！',
                countdownPrefix: '距离截止还有：',
                countdownSuffix: '',
                syncWithFormExpiry: false,
                fieldDescription: '',
                order: 0
            }
        });

        // 项目组件
        this.register('projectName', {
            type: 'projectName',
            name: '项目名称',
            icon: 'FormOutlined',
            category: 'project',
            description: '项目名称输入框',
            defaultProps: {
                label: '项目名称',
                placeholder: '请输入项目名称',
                required: true,
                disabled: false,
                fromProjectTable: false,
                showClient: false,
                showStatus: false,
                showContact: false,
                order: 0
            }
        });

        this.register('client', {
            type: 'client',
            name: '客户',
            icon: 'FormOutlined',
            category: 'project',
            description: '客户信息输入框',
            defaultProps: {
                label: '客户',
                placeholder: '请输入客户名称',
                required: true,
                disabled: false,
                fromClientTable: false,
                showClientCategory: false,
                showClientRating: false,
                order: 0
            }
        });

        this.register('contact', {
            type: 'contact',
            name: '联系人',
            icon: 'FormOutlined',
            category: 'project',
            description: '联系人信息输入框',
            defaultProps: {
                label: '联系人',
                placeholder: '请输入联系人姓名',
                required: false,
                disabled: false,
                fromContactTable: false,
                showContactPhone: false,
                showContactEmail: false,
                showContactCompany: false,
                showContactPosition: false,
                enableCompanyFilter: false,
                allowMultipleContacts: false,
                order: 0
            }
        });

        this.register('quotation', {
            type: 'quotation',
            name: '报价单',
            icon: 'FileTextOutlined',
            category: 'project',
            description: '报价单信息输入',
            defaultProps: {
                label: '报价单',
                placeholder: '请输入报价单号',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('order', {
            type: 'order',
            name: '订单',
            icon: 'FileTextOutlined',
            category: 'project',
            description: '订单信息输入',
            defaultProps: {
                label: '订单',
                placeholder: '请输入订单号',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('instruction', {
            type: 'instruction',
            name: '嘱托',
            icon: 'FileTextOutlined',
            category: 'project',
            description: '项目嘱托多行文本',
            defaultProps: {
                label: '嘱托',
                placeholder: '请输入项目嘱托',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('taskList', {
            type: 'taskList',
            name: '任务列表',
            icon: 'CheckSquareOutlined',
            category: 'project',
            description: '项目任务列表',
            defaultProps: {
                label: '任务列表',
                required: false,
                disabled: false,
                options: [
                    { label: '需求分析', value: 'requirement_analysis' },
                    { label: '方案设计', value: 'solution_design' },
                    { label: '开发实施', value: 'development' },
                    { label: '测试验收', value: 'testing' },
                    { label: '项目交付', value: 'delivery' }
                ],
                order: 0
            }
        });

        // 合同组件
        this.register('contractName', {
            type: 'contractName',
            name: '合同名称',
            icon: 'FormOutlined',
            category: 'contract',
            description: '合同名称输入框',
            defaultProps: {
                label: '合同名称',
                placeholder: '请输入合同名称',
                required: true,
                disabled: false,
                order: 0
            }
        });

        this.register('contractParty', {
            type: 'contractParty',
            name: '合同方',
            icon: 'FormOutlined',
            category: 'contract',
            description: '合同方信息输入',
            defaultProps: {
                label: '合同方',
                placeholder: '请输入合同方名称',
                required: true,
                disabled: false,
                order: 0
            }
        });

        this.register('contractTerms', {
            type: 'contractTerms',
            name: '合同条款',
            icon: 'FileTextOutlined',
            category: 'contract',
            description: '合同条款预设文本',
            defaultProps: {
                label: '合同条款',
                content: '1. 甲方责任：\n2. 乙方责任：\n3. 付款方式：\n4. 违约责任：',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('signature', {
            type: 'signature',
            name: '签章',
            icon: 'FormOutlined',
            category: 'contract',
            description: '签章区域',
            defaultProps: {
                label: '签章',
                content: '请在此处签章',
                required: false,
                disabled: false,
                order: 0
            }
        });

        // 文章组件
        this.register('author', {
            type: 'author',
            name: '作者',
            icon: 'UserOutlined',
            category: 'article',
            description: '文章作者输入框',
            defaultProps: {
                label: '作者',
                placeholder: '请输入作者姓名',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('articleSummary', {
            type: 'articleSummary',
            name: '文章摘要',
            icon: 'FileTextOutlined',
            category: 'article',
            description: '文章摘要多行文本',
            defaultProps: {
                label: '文章摘要',
                placeholder: '请输入文章摘要',
                required: false,
                disabled: false,
                order: 0
            }
        });

        // 财务组件
        this.register('amount', {
            type: 'amount',
            name: '金额',
            icon: 'NumberOutlined',
            category: 'finance',
            description: '金额输入框',
            defaultProps: {
                label: '金额',
                placeholder: '请输入金额',
                required: true,
                disabled: false,
                order: 0
            }
        });

        this.register('amountInWords', {
            type: 'amountInWords',
            name: '金额大写',
            icon: 'FormOutlined',
            category: 'finance',
            description: '金额大写显示',
            defaultProps: {
                label: '金额大写',
                content: '人民币零元整',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('total', {
            type: 'total',
            name: '总计',
            icon: 'NumberOutlined',
            category: 'finance',
            description: '总计金额输入',
            defaultProps: {
                label: '总计',
                placeholder: '请输入总计金额',
                required: true,
                disabled: false,
                order: 0
            }
        });

        this.register('invoiceType', {
            type: 'invoiceType',
            name: '发票类型',
            icon: 'DownOutlined',
            category: 'finance',
            description: '发票类型选择',
            defaultProps: {
                label: '发票类型',
                required: true,
                disabled: false,
                options: [
                    { label: '增值税普通发票', value: 'normal' },
                    { label: '增值税专用发票', value: 'special' },
                    { label: '电子发票', value: 'electronic' },
                    { label: '其他发票', value: 'other' }
                ],
                order: 0
            }
        });

        this.register('invoiceInfo', {
            type: 'invoiceInfo',
            name: '开票信息',
            icon: 'FileTextOutlined',
            category: 'finance',
            description: '开票信息多行文本',
            defaultProps: {
                label: '开票信息',
                placeholder: '请输入开票信息',
                required: false,
                disabled: false,
                order: 0
            }
        });

        this.register('paymentMethod', {
            type: 'paymentMethod',
            name: '付款方式',
            icon: 'DownOutlined',
            category: 'finance',
            description: '付款方式选择',
            defaultProps: {
                label: '付款方式',
                required: true,
                disabled: false,
                options: [
                    { label: '银行转账', value: 'bank' },
                    { label: '现金支付', value: 'cash' },
                    { label: '支付宝', value: 'alipay' },
                    { label: '微信支付', value: 'wechat' }
                ],
                order: 0
            }
        });

        this.register('taxRate', {
            type: 'taxRate',
            name: '税率',
            icon: 'NumberOutlined',
            category: 'finance',
            description: '税率百分比输入',
            defaultProps: {
                label: '税率',
                placeholder: '请输入税率(%)',
                required: false,
                disabled: false,
                order: 0
            }
        });
    }
}

export default new ComponentRegistry(); 