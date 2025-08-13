import React, { useState } from 'react'
import { Button, Card, Row, Col, Typography, Space, Divider, Avatar } from 'antd'
import {
    UserOutlined,
    ProjectOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    StarOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const HomePage: React.FC = () => {
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('home')

    const handleLogin = () => {
        navigate('/login')
    }

    const features = [
        {
            icon: <ProjectOutlined className="text-3xl text-blue-600" />,
            title: '项目管理',
            description: '完整的项目生命周期管理，从需求分析到交付验收，全程跟踪项目进度。'
        },
        {
            icon: <UserOutlined className="text-3xl text-green-600" />,
            title: '客户管理',
            description: '专业的客户关系管理，建立长期稳定的合作关系，提升客户满意度。'
        },
        {
            icon: <DollarOutlined className="text-3xl text-orange-600" />,
            title: '财务管理',
            description: '全面的财务数据管理，包括报价、合同、发票等，确保资金流转透明。'
        },
        {
            icon: <FileTextOutlined className="text-3xl text-purple-600" />,
            title: '合同管理',
            description: '标准化的合同模板管理，支持电子签名，提高合同处理效率。'
        },
        {
            icon: <TeamOutlined className="text-3xl text-red-600" />,
            title: '团队协作',
            description: '高效的团队协作平台，任务分配、进度同步，提升团队工作效率。'
        },
        {
            icon: <CheckCircleOutlined className="text-3xl text-teal-600" />,
            title: '质量控制',
            description: '严格的质量控制流程，确保每个项目都达到最高标准。'
        }
    ]

    const testimonials = [
        {
            name: '张总',
            company: '创意设计公司',
            content: '这个系统帮助我们大大提升了项目管理效率，客户满意度也显著提高。',
            rating: 5
        },
        {
            name: '李经理',
            company: '广告策划公司',
            content: '界面简洁美观，功能强大实用，是我们团队不可或缺的管理工具。',
            rating: 5
        },
        {
            name: '王总监',
            company: '品牌咨询公司',
            content: '从项目立项到最终交付，整个流程都变得非常清晰和高效。',
            rating: 5
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* 导航栏 */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">D</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">设计业务管理系统</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                onClick={() => setActiveSection('home')}
                                className={`text-sm font-medium ${activeSection === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                首页
                            </button>
                            <button
                                onClick={() => setActiveSection('features')}
                                className={`text-sm font-medium ${activeSection === 'features' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                功能特色
                            </button>
                            <button
                                onClick={() => setActiveSection('about')}
                                className={`text-sm font-medium ${activeSection === 'about' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                关于我们
                            </button>
                            <button
                                onClick={() => setActiveSection('contact')}
                                className={`text-sm font-medium ${activeSection === 'contact' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                联系我们
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button type="primary" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                                登录系统
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 英雄区域 */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Title level={1} className="text-5xl font-bold text-gray-900 mb-6">
                        专业的设计业务管理平台
                    </Title>
                    <Paragraph className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        为设计公司、广告公司、品牌咨询等创意行业提供全方位的业务管理解决方案。
                        从项目立项到最终交付，让您的业务流程更加高效、透明、专业。
                    </Paragraph>
                    <Space size="large">
                        <Button type="primary" size="large" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg">
                            立即体验
                        </Button>
                        <Button size="large" className="h-12 px-8 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                            了解更多
                        </Button>
                    </Space>
                </div>
            </section>

            {/* 功能特色 */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">
                            核心功能特色
                        </Title>
                        <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
                            专为创意行业量身定制的管理功能，让您的业务运营更加高效
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]}>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card className="h-full text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <div className="mb-4">{feature.icon}</div>
                                    <Title level={3} className="text-xl font-semibold mb-3">
                                        {feature.title}
                                    </Title>
                                    <Paragraph className="text-gray-600">
                                        {feature.description}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 数据统计 */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[32, 32]} className="text-center">
                        <Col xs={12} sm={6}>
                            <div className="mb-4">
                                <Title level={1} className="text-4xl font-bold text-blue-600">500+</Title>
                                <Text className="text-lg text-gray-600">服务客户</Text>
                            </div>
                        </Col>
                        <Col xs={12} sm={6}>
                            <div className="mb-4">
                                <Title level={1} className="text-4xl font-bold text-green-600">2000+</Title>
                                <Text className="text-lg text-gray-600">成功项目</Text>
                            </div>
                        </Col>
                        <Col xs={12} sm={6}>
                            <div className="mb-4">
                                <Title level={1} className="text-4xl font-bold text-orange-600">98%</Title>
                                <Text className="text-lg text-gray-600">客户满意度</Text>
                            </div>
                        </Col>
                        <Col xs={12} sm={6}>
                            <div className="mb-4">
                                <Title level={1} className="text-4xl font-bold text-purple-600">24/7</Title>
                                <Text className="text-lg text-gray-600">技术支持</Text>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* 客户评价 */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">
                            客户评价
                        </Title>
                        <Paragraph className="text-xl text-gray-600">
                            听听我们的客户怎么说
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]}>
                        {testimonials.map((testimonial, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card className="h-full border-0 shadow-lg">
                                    <div className="flex items-center mb-4">
                                        <Avatar size={48} icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
                                        <div className="ml-3">
                                            <Text className="font-semibold text-gray-900">{testimonial.name}</Text>
                                            <br />
                                            <Text className="text-sm text-gray-500">{testimonial.company}</Text>
                                        </div>
                                    </div>
                                    <Paragraph className="text-gray-600 mb-4">
                                        "{testimonial.content}"
                                    </Paragraph>
                                    <div className="flex items-center">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <StarOutlined key={i} className="text-yellow-400 text-lg" />
                                        ))}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 关于我们 */}
            <section id="about" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[64, 32]} alignItems="center">
                        <Col xs={24} lg={12}>
                            <Title level={2} className="text-4xl font-bold text-gray-900 mb-6">
                                关于我们
                            </Title>
                            <Paragraph className="text-lg text-gray-600 mb-6">
                                我们是一家专注于为创意行业提供数字化解决方案的科技公司。多年来，
                                我们深入理解设计公司、广告公司、品牌咨询等行业的业务特点和管理需求。
                            </Paragraph>
                            <Paragraph className="text-lg text-gray-600 mb-6">
                                我们的使命是通过技术创新，帮助创意企业提升运营效率，降低管理成本，
                                让企业能够专注于核心创意工作，实现业务增长。
                            </Paragraph>
                            <Button type="primary" size="large" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                                了解更多
                            </Button>
                        </Col>
                        <Col xs={24} lg={12}>
                            <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 text-white text-center">
                                <Title level={3} className="text-2xl font-bold mb-4 text-white">
                                    我们的愿景
                                </Title>
                                <Paragraph className="text-lg text-blue-100 mb-6">
                                    成为创意行业数字化转型的引领者，
                                    让每一个创意企业都能享受到科技带来的便利。
                                </Paragraph>
                                <div className="flex justify-center space-x-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">5年+</div>
                                        <div className="text-sm text-blue-100">行业经验</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">50+</div>
                                        <div className="text-sm text-blue-100">技术专家</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">100%</div>
                                        <div className="text-sm text-blue-100">客户支持</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* 联系我们 */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">
                            联系我们
                        </Title>
                        <Paragraph className="text-xl text-gray-600">
                            有任何问题或建议，欢迎随时联系我们
                        </Paragraph>
                    </div>

                    <Row gutter={[64, 32]}>
                        <Col xs={24} lg={12}>
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <PhoneOutlined className="text-2xl text-blue-600 mr-4" />
                                    <div>
                                        <Text className="font-semibold text-gray-900">客服热线</Text>
                                        <br />
                                        <Text className="text-gray-600">400-888-8888</Text>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <MailOutlined className="text-2xl text-blue-600 mr-4" />
                                    <div>
                                        <Text className="font-semibold text-gray-900">邮箱地址</Text>
                                        <br />
                                        <Text className="text-gray-600">service@designsystem.com</Text>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <GlobalOutlined className="text-2xl text-blue-600 mr-4" />
                                    <div>
                                        <Text className="font-semibold text-gray-900">官方网站</Text>
                                        <br />
                                        <Text className="text-gray-600">www.designsystem.com</Text>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card className="border-0 shadow-lg">
                                <Title level={3} className="text-2xl font-bold mb-6">
                                    在线咨询
                                </Title>
                                <Paragraph className="text-gray-600 mb-6">
                                    填写以下信息，我们的专业顾问将尽快与您联系
                                </Paragraph>
                                <Button type="primary" size="large" block onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                                    立即咨询
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* 页脚 */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} lg={6}>
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">D</span>
                                </div>
                                <span className="ml-2 text-lg font-bold">设计业务管理系统</span>
                            </div>
                            <Paragraph className="text-gray-400">
                                专业的创意行业数字化管理解决方案提供商
                            </Paragraph>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">产品服务</Title>
                            <ul className="space-y-2 text-gray-400">
                                <li>项目管理</li>
                                <li>客户管理</li>
                                <li>财务管理</li>
                                <li>合同管理</li>
                            </ul>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">技术支持</Title>
                            <ul className="space-y-2 text-gray-400">
                                <li>在线帮助</li>
                                <li>视频教程</li>
                                <li>技术文档</li>
                                <li>客服支持</li>
                            </ul>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Title level={4} className="text-white mb-4">联系我们</Title>
                            <ul className="space-y-2 text-gray-400">
                                <li>400-888-8888</li>
                                <li>service@designsystem.com</li>
                                <li>www.designsystem.com</li>
                                <li>工作日 9:00-18:00</li>
                            </ul>
                        </Col>
                    </Row>

                    <Divider className="border-gray-700 my-8" />

                    <div className="text-center text-gray-400">
                        <Text>© 2024 设计业务管理系统. All rights reserved.</Text>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage
