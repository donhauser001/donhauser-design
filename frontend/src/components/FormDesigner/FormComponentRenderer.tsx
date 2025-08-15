import React, { useMemo } from 'react';
import { FormComponent } from '../../types/formDesigner';
import { useAuth } from '../../contexts/AuthContext';
import { useFormDesignerStore } from '../../stores/formDesignerStore';
import { globalLogicEngine } from './utils/logicEngine';

// 导入基础组件
import {
    InputComponent,
    TextareaComponent,
    PresetTextComponent,
    NumberComponent,
    DateComponent,
    SelectComponent,
    RadioComponent,
    UploadComponent,
    ImageComponent,
    SliderComponent,
    HtmlComponent,
    CountdownComponent
} from './components/basic';

// 导入布局组件
import {
    GroupComponent,
    DividerComponent,
    ColumnContainerComponent,
    PaginationComponent,
    StepsComponent
} from './components/layout';

// 导入项目组件
import {
    ProjectNameComponent,
    ClientComponent,
    ContactComponent,
    QuotationComponent,
    OrderComponent,
    InstructionComponent,
    TaskListComponent
} from './components/project';

// 导入合同组件
import {
    ContractNameComponent,
    ContractPartyComponent,
    SignatureComponent
} from './components/contract';
import OurCertificateComponent from './components/contract/OurCertificateComponent';

// 导入文章组件
import {
    ArticleTitleComponent,
    ArticleContentComponent,
    AuthorComponent,
    ArticleSummaryComponent,
    ArticleCategoryComponent,
    ArticleTagsComponent,
    ArticlePublishTimeComponent,
    ArticleCoverImageComponent,
    ArticleSeoComponent
} from './components/article';

// 导入财务组件
import {
    AmountComponent,
    AmountInWordsComponent,
    TotalComponent,
    InvoiceTypeComponent,
    InvoiceInfoComponent,
    PaymentMethodComponent
} from './components/finance';

interface FormComponentRendererProps {
    component: FormComponent;
    isDesignMode?: boolean; // 是否为设计模式
}

const FormComponentRenderer: React.FC<FormComponentRendererProps> = ({ component, isDesignMode = false }) => {
    const { userInfo } = useAuth();
    const { layout, theme } = useFormDesignerStore();

    // 注意：逻辑引擎的初始化现在由 LogicEngineProvider 处理

    // 获取计算后的组件属性（应用逻辑规则）
    const logicEngineStateVersion = isDesignMode ? 0 : globalLogicEngine.getStateVersion();

    const computedProps = useMemo(() => {
        if (isDesignMode || !layout.logicRules) {
            return {};
        }
        return globalLogicEngine.getComputedComponentProps(component);
    }, [component, layout.logicRules, isDesignMode, layout, logicEngineStateVersion]);

    // 合并原始组件属性和计算后的属性
    const finalComponent = useMemo(() => {
        return { ...component, ...computedProps };
    }, [component, computedProps]);

    // 检查组件可见性
    const isComponentVisible = () => {
        // 在设计模式下，所有组件都显示（在SortableComponent中处理视觉效果）
        if (isDesignMode) {
            return true;
        }

        const visibility = finalComponent.visibility || 'visible';

        switch (visibility) {
            case 'hidden':
                return false;
            case 'admin':
                // 只有超级管理员才能看到
                return userInfo?.role === '超级管理员';
            case 'visible':
            default:
                return true;
        }
    };

    // 如果组件不可见，返回null
    if (!isComponentVisible()) {
        return null;
    }

    // 渲染组件标签
    const renderLabel = () => {
        // 不需要显示标签的组件类型
        const noLabelComponents = ['columnContainer', 'divider', 'pagination', 'steps', 'presetText', 'image', 'html', 'countdown', 'ourCertificate'];

        if (noLabelComponents.includes(finalComponent.type) || finalComponent.hideLabel) {
            return null;
        }

        const labelStyle: React.CSSProperties = {
            fontWeight: 500,
            fontSize: theme.labelFontSize || '14px',
            color: theme.labelColor || '#262626',
            display: 'flex',
            alignItems: 'center'
        };

        const labelContent = (
            <span style={labelStyle}>
                {finalComponent.label}
                {finalComponent.required && (
                    <span style={{
                        color: '#ff4d4f',
                        marginLeft: '8px',
                        fontSize: '12px',
                        padding: '2px 6px',
                        backgroundColor: '#fff2f0',
                        borderRadius: '4px',
                        border: '1px solid #ffccc7'
                    }}>
                        必填
                    </span>
                )}
            </span>
        );

        return labelContent;
    };

    const renderComponent = () => {
        switch (finalComponent.type) {
            // 基础组件
            case 'input':
                return <InputComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'textarea':
                return <TextareaComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'presetText':
                return <PresetTextComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'number':
                return <NumberComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'date':
                return <DateComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'select':
                return <SelectComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'radio':
                return <RadioComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'upload':
                return <UploadComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'image':
                return <ImageComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'slider':
                return <SliderComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'html':
                return <HtmlComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'countdown':
                return <CountdownComponent component={finalComponent} isDesignMode={isDesignMode} />;

            // 布局组件
            case 'group':
                return <GroupComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'divider':
                return <DividerComponent component={finalComponent} />;
            case 'columnContainer':
                return <ColumnContainerComponent component={finalComponent} />;
            case 'pagination':
                return <PaginationComponent component={finalComponent} />;
            case 'steps':
                return <StepsComponent component={finalComponent} />;

            // 项目组件
            case 'projectName':
                return <ProjectNameComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'client':
                return <ClientComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'contact':
                return <ContactComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'quotation':
                return <QuotationComponent component={finalComponent} />;
            case 'order':
                return <OrderComponent component={finalComponent} />;
            case 'instruction':
                return <InstructionComponent component={finalComponent} />;
            case 'taskList':
                return <TaskListComponent component={finalComponent} />;

            // 合同组件
            case 'contractName':
                return <ContractNameComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'contractParty':
                return <ContractPartyComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'ourCertificate':
                return <OurCertificateComponent component={finalComponent} />;
            case 'signature':
                return <SignatureComponent component={finalComponent} />;

            // 文章组件
            case 'articleTitle':
                return <ArticleTitleComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'articleContent':
                return <ArticleContentComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'author':
                return <AuthorComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'articleSummary':
                return <ArticleSummaryComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'articleCategory':
                return <ArticleCategoryComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'articleTags':
                return <ArticleTagsComponent component={finalComponent} />;
            case 'articlePublishTime':
                return <ArticlePublishTimeComponent component={finalComponent} isDesignMode={isDesignMode} />;
            case 'articleCoverImage':
                return <ArticleCoverImageComponent component={finalComponent} />;
            case 'articleSeo':
                return <ArticleSeoComponent component={finalComponent} />;

            // 财务组件
            case 'amount':
                return <AmountComponent component={finalComponent} />;
            case 'amountInWords':
                return <AmountInWordsComponent component={finalComponent} />;
            case 'total':
                return <TotalComponent component={finalComponent} />;
            case 'invoiceType':
                return <InvoiceTypeComponent component={finalComponent} />;
            case 'invoiceInfo':
                return <InvoiceInfoComponent component={finalComponent} />;
            case 'paymentMethod':
                return <PaymentMethodComponent component={finalComponent} />;


            default:
                return <div>未知组件类型: {finalComponent.type}</div>;
        }
    };

    // 根据标签位置渲染组件
    const labelPosition = layout.labelPosition || 'top';
    const labelWidth = layout.labelWidth || '100px';
    const label = renderLabel();

    if (!label) {
        // 没有标签的组件直接渲染
        return (
            <div style={{ width: '100%' }}>
                {renderComponent()}
            </div>
        );
    }

    // 根据标签位置选择布局
    switch (labelPosition) {
        case 'left':
            return (
                <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                }}>
                    <div style={{
                        width: labelWidth,
                        flexShrink: 0,
                        paddingTop: '6px' // 与输入框对齐
                    }}>
                        {label}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {renderComponent()}
                    </div>
                </div>
            );

        case 'right':
            return (
                <div style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {renderComponent()}
                    </div>
                    <div style={{
                        width: labelWidth,
                        flexShrink: 0,
                        paddingTop: '6px' // 与输入框对齐
                    }}>
                        {label}
                    </div>
                </div>
            );

        case 'top':
        default:
            return (
                <div style={{ width: '100%' }}>
                    <div style={{ marginBottom: '8px' }}>
                        {label}
                    </div>
                    {renderComponent()}
                </div>
            );
    }
};

export default FormComponentRenderer; 