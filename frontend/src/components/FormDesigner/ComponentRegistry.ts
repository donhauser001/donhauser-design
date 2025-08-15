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
                maxLength: 500,
                showCharCount: true,
                enableRichText: false,
                richTextHeight: 300,
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
                imageColumns: 3,
                showImageName: true,
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
            description: '报价单信息输入，从报价单表选择',
            defaultProps: {
                label: '报价单',
                placeholder: '请在属性面板中选择报价单',
                required: false,
                disabled: false,
                fromQuotationTable: true,
                selectedQuotationId: '',
                quotationDisplayMode: 'card',
                quotationNameDisplay: 'show',
                customQuotationName: '',
                showPricingPolicy: false,
                policyDetailMode: 'hover',
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
                titleDisplay: 'show', // 'show' | 'hide' | 'custom'
                customTitle: '订单详情',
                associationMode: 'auto', // 'quotation' | 'project' | 'auto' | 'select'
                order: 0
            }
        });

        this.register('instruction', {
            type: 'instruction',
            name: '嘱托',
            icon: 'BulbOutlined',
            category: 'project',
            description: '多行文本输入，用于项目嘱托和特殊要求',
            defaultProps: {
                label: '嘱托',
                placeholder: '请输入嘱托内容',
                required: false,
                disabled: false,
                maxLength: 500,
                showCharCount: true,
                enableRichText: false,
                richTextHeight: 300,
                order: 0
            }
        });

        this.register('taskList', {
            type: 'taskList',
            name: '任务列表',
            icon: 'CheckSquareOutlined',
            category: 'project',
            description: '项目任务列表展示',
            defaultProps: {
                label: '任务列表',
                required: false,
                disabled: false,
                titleDisplay: 'show', // 'show' | 'hide' | 'custom'
                customTitle: '任务列表',
                displayMode: 'list', // 'list' | 'text' - 默认为列表模式
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
                required: true,
                disabled: false,
                order: 0,
                partyCount: 2,
                showCompanyName: true,
                showShortName: false,
                showCreditCode: false,
                showAddress: false,
                showContactPerson: true,
                showPhone: false,
                showEmail: false,
                showLegalRepresentative: false,
                showLegalRepresentativeId: false,
                ourParty: '甲',
                ourTeam: '',
                enableClientData: false
            }
        });

        this.register('ourCertificate', {
            type: 'ourCertificate',
            name: '我方证照',
            icon: 'certificate',
            category: 'contract',
            description: '我方企业证照信息',
            defaultProps: {
                label: '我方证照',
                required: true,
                disabled: false,
                order: 0,
                selectedEnterprise: '',
                showBusinessLicense: true,
                showBankPermit: false
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
        this.register('articleTitle', {
            type: 'articleTitle',
            name: '文章标题',
            icon: 'EditOutlined',
            category: 'article',
            description: '文章标题输入框',
            defaultProps: {
                label: '文章标题',
                placeholder: '请输入文章标题',
                required: true,
                disabled: false,
                maxLength: 100,
                showCharCount: true,
                order: 0
            }
        });

        this.register('articleContent', {
            type: 'articleContent',
            name: '文章内容',
            icon: 'FileTextOutlined',
            category: 'article',
            description: '文章内容编辑器，支持富文本或纯文本模式',
            defaultProps: {
                label: '文章内容',
                placeholder: '请输入文章内容',
                required: true,
                disabled: false,
                enableRichText: false, // 默认为普通文本模式
                richTextHeight: 400,
                rows: 8,
                maxLength: 10000, // 默认最大字符数
                showCharCount: true, // 默认显示字符统计
                autoSize: false,
                fieldDescription: '支持切换普通文本和富文本编辑模式',
                order: 0
            }
        });

        this.register('author', {
            type: 'author',
            name: '作者',
            icon: 'UserOutlined',
            category: 'article',
            description: '文章作者输入框，支持从用户表选择',
            defaultProps: {
                label: '作者',
                placeholder: '请输入作者真实姓名',
                required: false,
                disabled: false,
                fromUserTable: false,
                authorSelectMode: 'input', // 'input' | 'select' | 'autocomplete'
                autoCurrentUser: false, // 自动获取当前用户为作者
                allowClear: true,
                allowSearch: true,
                maxLength: 50,
                showCharCount: false,
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
                rows: 4,
                maxLength: 200,
                showCharCount: true,
                autoSize: false,
                order: 0
            }
        });

        this.register('articleCategory', {
            type: 'articleCategory',
            name: '文章分类',
            icon: 'FolderOutlined',
            category: 'article',
            description: '文章分类选择器，从文章分类表动态加载',
            defaultProps: {
                label: '文章分类',
                placeholder: '请选择文章分类',
                required: true,
                disabled: false,
                allowClear: true,
                allowSearch: true,
                order: 0
            }
        });

        this.register('articleTags', {
            type: 'articleTags',
            name: '文章标签',
            icon: 'TagsOutlined',
            category: 'article',
            description: '文章标签多选器',
            defaultProps: {
                label: '文章标签',
                placeholder: '请输入文章标签，多个标签用逗号分隔',
                required: false,
                disabled: false,
                fromTagTable: false,
                allowClear: true,
                allowSearch: true,
                maxTagCount: 5,
                maxTagTextLength: 10,
                maxLength: 200,
                showCharCount: true,
                options: [
                    { label: '技术', value: 'tech' },
                    { label: '设计', value: 'design' },
                    { label: '产品', value: 'product' },
                    { label: '市场', value: 'marketing' },
                    { label: '运营', value: 'operation' }
                ],
                order: 0
            }
        });

        this.register('articlePublishTime', {
            type: 'articlePublishTime',
            name: '发布时间',
            icon: 'CalendarOutlined',
            category: 'article',
            description: '文章发布时间选择器',
            defaultProps: {
                label: '发布时间',
                placeholder: '请选择发布时间',
                required: false,
                disabled: false,
                showTimePicker: true,
                autoCurrentTime: false,
                allowClear: true,
                showToday: true,
                showNow: true,
                disablePastDates: false,
                order: 0
            }
        });

        this.register('articleCoverImage', {
            type: 'articleCoverImage',
            name: '封面图片',
            icon: 'PictureOutlined',
            category: 'article',
            description: '文章封面图片上传',
            defaultProps: {
                label: '封面图片',
                required: false,
                disabled: false,
                uploadType: 'card', // 'button' | 'drag' | 'card'
                maxFileSize: 5,
                uploadButtonText: '上传封面图',
                order: 0
            }
        });

        this.register('articleSeo', {
            type: 'articleSeo',
            name: 'SEO设置',
            icon: 'SearchOutlined',
            category: 'article',
            description: 'SEO优化信息设置',
            defaultProps: {
                label: 'SEO设置',
                required: false,
                disabled: false,
                defaultExpanded: false,
                ghost: false,
                expandIconPosition: 'start',
                seoTitlePlaceholder: '请输入SEO标题（建议60字符以内）',
                seoKeywordsPlaceholder: '请输入关键词，用逗号分隔',
                seoDescriptionPlaceholder: '请输入SEO描述（建议160字符以内）',
                seoTitleMaxLength: 60,
                seoKeywordsMaxLength: 200,
                seoDescriptionMaxLength: 160,
                showCharCount: true,
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
                precision: 2,
                formatter: true,
                step: 1,
                linkOrderTotal: false,
                orderTotalPercentage: 100,
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
                amountStyle: 'normal',
                fontSize: 14,
                includePrefix: true,
                backgroundColor: 'default',
                linkAmount: true,
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
                precision: 2,
                formatter: true,
                fontSize: 16,
                fontWeight: 'bold',
                totalMode: 'order', // 默认为订单总计模式
                orderTotalPercentage: 100,
                selectedAmountIds: [], // 默认没有选择金额组件
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
                placeholder: '请选择发票类型',
                required: true,
                disabled: false,
                allowClear: true,
                allowSearch: true,
                invoiceOptions: ['增值税专用发票', '增值税普通发票', '电子发票', '纸质发票', '收据'],
                order: 0
            }
        });

        this.register('invoiceInfo', {
            type: 'invoiceInfo',
            name: '开票信息',
            icon: 'FileTextOutlined',
            category: 'finance',
            description: '从企业设置自动获取开票信息',
            defaultProps: {
                label: '开票信息',
                required: false,
                disabled: false,
                titleDisplay: 'show',
                customTitle: '开票信息',
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
                placeholder: '请选择付款方式',
                required: true,
                disabled: false,
                allowClear: true,
                allowSearch: true,
                paymentOptions: ['现金', '银行转账', '支票', '微信支付', '支付宝', '信用卡'],
                order: 0
            }
        });


    }
}

export default new ComponentRegistry(); 