import mongoose from 'mongoose'
import ContractElement from '../src/models/ContractElement'

// 连接数据库
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/donhauser')
        console.log('✅ MongoDB数据库连接成功')
    } catch (error) {
        console.error('❌ MongoDB数据库连接失败:', error)
        process.exit(1)
    }
}

// 合同元素种子数据
const contractElementsData = [
    {
        name: '公司抬头',
        type: 'header' as const,
        description: '公司名称、地址、联系方式等抬头信息',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '甲乙双方签章',
        type: 'signature' as const,
        description: '合同结尾的甲乙双方签名盖章区域',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '订单服务明细',
        type: 'order' as const,
        description: '从订单中获取服务项目明细表格',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '报价单信息',
        type: 'quotation' as const,
        description: '动态引用报价单中的详细信息',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '项目描述',
        type: 'paragraph_text' as const,
        description: '项目具体描述的多行文本输入',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '合同金额',
        type: 'money' as const,
        description: '合同总金额的数字格式显示',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '合同金额大写',
        type: 'money_cn' as const,
        description: '合同总金额的中文大写形式',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '签订日期',
        type: 'date' as const,
        description: '合同签订日期选择器',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '交付日期',
        type: 'date' as const,
        description: '项目交付日期选择器',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '服务类型',
        type: 'dropdown' as const,
        description: '服务类型下拉选择框',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '付款方式',
        type: 'radio' as const,
        description: '付款方式的单选按钮组',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '附加服务',
        type: 'checkbox' as const,
        description: '附加服务的多选复选框',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '标准条款',
        type: 'preset_text' as const,
        description: '固定的标准合同条款文本',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '项目名称',
        type: 'short_text' as const,
        description: '项目名称的单行文本输入',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '项目编号',
        type: 'number' as const,
        description: '项目编号的数字输入框',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '项目信息',
        type: 'project' as const,
        description: '项目信息的动态引用',
        status: 'active' as const,
        createdBy: 'system'
    },
    {
        name: '任务列表',
        type: 'task' as const,
        description: '任务信息的动态引用',
        status: 'active' as const,
        createdBy: 'system'
    }
]

// 清空并重新插入数据
const seedContractElements = async () => {
    try {
        // 清空现有数据
        await ContractElement.deleteMany({})
        console.log('🗑️ 清空现有合同元素数据')

        // 插入新数据
        const elements = await ContractElement.insertMany(contractElementsData)
        console.log(`✅ 成功插入 ${elements.length} 个合同元素`)

        // 显示插入的数据
        console.log('\n📋 插入的合同元素列表:')
        elements.forEach((element, index) => {
            console.log(`${index + 1}. ${element.name} (${element.type})`)
        })

        console.log('\n🎉 合同元素数据初始化完成!')
    } catch (error) {
        console.error('❌ 初始化合同元素数据失败:', error)
    } finally {
        await mongoose.disconnect()
        console.log('🔌 数据库连接已关闭')
    }
}

// 执行脚本
connectDB().then(() => {
    seedContractElements()
}) 