import mongoose from 'mongoose';
import Article from '../src/models/Article';

// 连接数据库
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/donhauser');
        console.log('✅ MongoDB数据库连接成功');
    } catch (error) {
        console.error('❌ MongoDB数据库连接失败:', error);
        process.exit(1);
    }
};

// 测试文章数据
const articles = [
    {
        title: '设计行业发展趋势分析',
        content: `随着数字化时代的到来，设计行业正在经历前所未有的变革。从传统的平面设计到现在的用户体验设计，设计师需要掌握更多的技能和工具。

## 主要趋势

1. **数字化设计工具**
   - Figma、Sketch等协作设计工具
   - 3D建模和渲染技术
   - AI辅助设计工具

2. **用户体验设计**
   - 以用户为中心的设计思维
   - 数据驱动的设计决策
   - 无障碍设计的重要性

3. **可持续发展设计**
   - 环保材料的使用
   - 节能设计理念
   - 循环经济设计

## 未来展望

设计行业将继续向数字化、智能化方向发展，设计师需要不断学习和适应新的技术趋势。`,
        summary: '分析当前设计行业的发展趋势，包括数字化工具、用户体验设计和可持续发展等方面。',
        category: 'blog',
        tags: ['设计趋势', '数字化', '用户体验'],
        author: '设计总监',
        authorId: 'design-director',
        status: 'published',
        publishTime: new Date('2024-01-10'),
        viewCount: 156,
        isTop: true,
        isRecommend: true,
        seoTitle: '2024年设计行业发展趋势分析',
        seoKeywords: '设计趋势,数字化设计,用户体验设计',
        seoDescription: '深入分析2024年设计行业的发展趋势，包括数字化工具、用户体验设计和可持续发展等方面。'
    },
    {
        title: '品牌设计案例分享：某科技公司VI设计',
        content: `本文分享一个成功的品牌设计案例，展示如何为科技公司打造完整的视觉识别系统。

## 项目背景

客户是一家专注于人工智能技术的初创公司，需要建立专业的品牌形象来吸引投资和客户。

## 设计过程

1. **品牌调研**
   - 分析竞争对手的品牌策略
   - 了解目标用户群体
   - 确定品牌定位

2. **视觉设计**
   - Logo设计：简洁现代的几何图形
   - 色彩系统：蓝色主色调，体现科技感
   - 字体选择：无衬线字体，增强可读性

3. **应用设计**
   - 名片、信笺等办公用品
   - 网站和移动应用界面
   - 产品包装设计

## 设计成果

通过系统性的品牌设计，客户成功建立了专业的品牌形象，在行业内获得了良好的口碑。`,
        summary: '分享一个科技公司的品牌设计案例，展示完整的VI设计流程和成果。',
        category: 'case',
        tags: ['品牌设计', 'VI设计', '科技公司'],
        author: '资深设计师',
        authorId: 'senior-designer',
        status: 'published',
        publishTime: new Date('2024-01-08'),
        viewCount: 89,
        isTop: false,
        isRecommend: true,
        seoTitle: '科技公司VI设计案例分享',
        seoKeywords: '品牌设计,VI设计,科技公司,案例分享',
        seoDescription: '详细分享一个科技公司的品牌设计案例，包括设计流程、视觉元素和应用设计。'
    },
    {
        title: 'UI设计中的色彩心理学',
        content: `色彩在UI设计中起着至关重要的作用，不同的颜色能够传达不同的情感和信息。

## 色彩基础

### 红色
- 代表激情、能量、危险
- 常用于警告、错误提示
- 适合电商网站的购买按钮

### 蓝色
- 代表信任、专业、稳定
- 常用于企业网站、金融应用
- 给人可靠、安全的感觉

### 绿色
- 代表自然、健康、成功
- 常用于环保、健康类应用
- 适合成功状态的提示

### 黄色
- 代表快乐、活力、注意
- 常用于提醒、警告信息
- 需要谨慎使用，避免过度刺激

## 实践建议

1. **建立色彩系统**
   - 确定主色调和辅助色
   - 制定色彩使用规范
   - 考虑无障碍设计需求

2. **测试和优化**
   - 进行A/B测试
   - 收集用户反馈
   - 持续优化色彩搭配`,
        summary: '探讨UI设计中色彩心理学的重要性，以及如何正确运用色彩来提升用户体验。',
        category: 'tutorial',
        tags: ['UI设计', '色彩心理学', '用户体验'],
        author: 'UI设计师',
        authorId: 'ui-designer',
        status: 'published',
        publishTime: new Date('2024-01-05'),
        viewCount: 234,
        isTop: false,
        isRecommend: false,
        seoTitle: 'UI设计色彩心理学指南',
        seoKeywords: 'UI设计,色彩心理学,用户体验设计',
        seoDescription: '深入探讨UI设计中的色彩心理学，帮助设计师更好地运用色彩提升用户体验。'
    },
    {
        title: '公司荣获2024年度最佳设计奖',
        content: `我们很荣幸地宣布，公司在2024年度设计行业评选中荣获"最佳设计奖"！

## 获奖项目

我们的"智慧城市可视化平台"项目在众多参赛作品中脱颖而出，获得了评委的一致好评。

### 项目亮点

1. **创新性设计**
   - 独特的3D可视化技术
   - 直观的数据展示方式
   - 优秀的用户体验设计

2. **技术突破**
   - 自主研发的可视化引擎
   - 支持大规模数据处理
   - 跨平台兼容性

3. **社会价值**
   - 提升城市管理效率
   - 改善市民生活质量
   - 推动智慧城市建设

## 感谢

感谢所有参与项目的团队成员，感谢客户的支持和信任，感谢评委的认可。我们将继续努力，为客户提供更优质的设计服务！`,
        summary: '公司荣获2024年度最佳设计奖，展示获奖项目的亮点和成就。',
        category: 'company',
        tags: ['公司新闻', '获奖', '智慧城市'],
        author: '市场部',
        authorId: 'marketing',
        status: 'published',
        publishTime: new Date('2024-01-03'),
        viewCount: 567,
        isTop: true,
        isRecommend: true,
        seoTitle: '公司荣获2024年度最佳设计奖',
        seoKeywords: '设计奖,智慧城市,可视化平台',
        seoDescription: '公司荣获2024年度最佳设计奖，智慧城市可视化平台项目获得行业认可。'
    },
    {
        title: '设计师必备的10个设计工具',
        content: `在当今的设计行业中，掌握合适的工具能够大大提高工作效率。以下是设计师必备的10个工具：

## 设计软件

1. **Figma**
   - 协作设计工具
   - 支持实时协作
   - 丰富的插件生态

2. **Adobe Creative Suite**
   - Photoshop：图像处理
   - Illustrator：矢量图形
   - InDesign：排版设计

3. **Sketch**
   - Mac平台专用
   - 优秀的UI设计功能
   - 丰富的插件支持

## 原型工具

4. **Framer**
   - 高保真原型设计
   - 支持代码集成
   - 强大的交互功能

5. **Principle**
   - 交互动画设计
   - 简单易用的界面
   - 优秀的性能表现

## 辅助工具

6. **Notion**
   - 项目管理
   - 知识整理
   - 团队协作

7. **Miro**
   - 思维导图
   - 白板协作
   - 创意头脑风暴

8. **Loom**
   - 屏幕录制
   - 设计演示
   - 团队沟通

## 资源网站

9. **Dribbble**
   - 设计灵感
   - 作品展示
   - 社区交流

10. **Behance**
    - 作品集展示
    - 项目案例
    - 行业资讯

## 使用建议

- 根据项目需求选择合适的工具
- 持续学习新工具和功能
- 建立个人工具使用习惯
- 关注工具更新和趋势`,
        summary: '介绍设计师必备的10个设计工具，包括设计软件、原型工具和辅助工具。',
        category: 'tutorial',
        tags: ['设计工具', '工作效率', '软件推荐'],
        author: '设计经理',
        authorId: 'design-manager',
        status: 'published',
        publishTime: new Date('2024-01-01'),
        viewCount: 789,
        isTop: false,
        isRecommend: true,
        seoTitle: '设计师必备的10个设计工具推荐',
        seoKeywords: '设计工具,设计师,工作效率,软件推荐',
        seoDescription: '详细介绍设计师必备的10个设计工具，帮助设计师提高工作效率和设计质量。'
    }
];

// 清空现有数据并插入新数据
const seedArticles = async () => {
    try {
        console.log('🌱 开始生成文章数据...');

        // 清空现有数据
        await Article.deleteMany({});
        console.log('✅ 清空现有文章数据');

        // 插入新数据
        const result = await Article.insertMany(articles);
        console.log(`✅ 成功插入 ${result.length} 篇文章`);

        // 显示插入的文章
        console.log('\n📝 插入的文章列表：');
        result.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title} (${article.category})`);
        });

        console.log('\n🎉 文章数据生成完成！');
        process.exit(0);
    } catch (error) {
        console.error('❌ 生成文章数据失败:', error);
        process.exit(1);
    }
};

// 运行种子脚本
connectDB().then(() => {
    seedArticles();
}); 