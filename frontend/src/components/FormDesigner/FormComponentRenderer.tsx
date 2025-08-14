import React from 'react';
import { FormComponent } from '../../types/formDesigner';

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
}

const FormComponentRenderer: React.FC<FormComponentRendererProps> = ({ component }) => {
    const renderComponent = () => {
        switch (component.type) {
            // 基础组件
            case 'input':
                return <InputComponent component={component} />;
            case 'textarea':
                return <TextareaComponent component={component} />;
            case 'presetText':
                return <PresetTextComponent component={component} />;
            case 'number':
                return <NumberComponent component={component} />;
            case 'date':
                return <DateComponent component={component} />;
            case 'select':
                return <SelectComponent component={component} />;
            case 'radio':
                return <RadioComponent component={component} />;
            case 'upload':
                return <UploadComponent component={component} />;
            case 'image':
                return <ImageComponent component={component} />;
            case 'slider':
                return <SliderComponent component={component} />;
            case 'html':
                return <HtmlComponent component={component} />;
            case 'countdown':
                return <CountdownComponent component={component} />;

            // 布局组件
            case 'group':
                return <GroupComponent component={component} />;
            case 'divider':
                return <DividerComponent component={component} />;
            case 'columnContainer':
                return <ColumnContainerComponent component={component} />;
            case 'pagination':
                return <PaginationComponent component={component} />;
            case 'steps':
                return <StepsComponent component={component} />;

            // 项目组件
            case 'projectName':
                return <ProjectNameComponent component={component} />;
            case 'client':
                return <ClientComponent component={component} />;
            case 'contact':
                return <ContactComponent component={component} />;
            case 'quotation':
                return <QuotationComponent component={component} />;
            case 'order':
                return <OrderComponent component={component} />;
            case 'instruction':
                return <InstructionComponent component={component} />;
            case 'taskList':
                return <TaskListComponent component={component} />;

            // 合同组件
            case 'contractName':
                return <ContractNameComponent component={component} />;
            case 'contractParty':
                return <ContractPartyComponent component={component} />;
            case 'ourCertificate':
                return <OurCertificateComponent component={component} />;
            case 'signature':
                return <SignatureComponent component={component} />;

            // 文章组件
            case 'articleTitle':
                return <ArticleTitleComponent component={component} />;
            case 'articleContent':
                return <ArticleContentComponent component={component} />;
            case 'author':
                return <AuthorComponent component={component} />;
            case 'articleSummary':
                return <ArticleSummaryComponent component={component} />;
            case 'articleCategory':
                return <ArticleCategoryComponent component={component} />;
            case 'articleTags':
                return <ArticleTagsComponent component={component} />;
            case 'articlePublishTime':
                return <ArticlePublishTimeComponent component={component} />;
            case 'articleCoverImage':
                return <ArticleCoverImageComponent component={component} />;
            case 'articleSeo':
                return <ArticleSeoComponent component={component} />;

            // 财务组件
            case 'amount':
                return <AmountComponent component={component} />;
            case 'amountInWords':
                return <AmountInWordsComponent component={component} />;
            case 'total':
                return <TotalComponent component={component} />;
            case 'invoiceType':
                return <InvoiceTypeComponent component={component} />;
            case 'invoiceInfo':
                return <InvoiceInfoComponent component={component} />;
            case 'paymentMethod':
                return <PaymentMethodComponent component={component} />;


            default:
                return <div>未知组件类型: {component.type}</div>;
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* 布局组件不显示外部标签，支持隐藏标签功能 */}
            {!['group', 'columnContainer', 'divider', 'pagination', 'steps', 'presetText', 'image', 'html', 'countdown', 'ourCertificate'].includes(component.type) &&
                !component.hideLabel && (
                    <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: 500, fontSize: '14px' }}>
                            {component.label}
                        </span>
                        {component.required && (
                            <span style={{
                                color: '#ff4d4f',
                                marginLeft: '8px',
                                fontSize: '12px',
                                padding: '2px 6px',
                                backgroundColor: '#fff2f0',
                                border: '1px solid #ffccc7',
                                borderRadius: '4px'
                            }}>
                                必填
                            </span>
                        )}
                    </div>
                )}
            {renderComponent()}
        </div>
    );
};

export default FormComponentRenderer; 