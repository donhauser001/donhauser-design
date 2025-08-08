import React from 'react';
import { FormComponent } from '../../types/formDesigner';

// 导入基础组件
import {
    InputComponent,
    TextareaComponent,
    PresetTextComponent,
    NumberComponent,
    DateComponent,
    TimeComponent,
    SelectComponent,
    RadioComponent,
    CheckboxComponent,
    UploadComponent
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
    ContractTermsComponent,
    SignatureComponent
} from './components/contract';

// 导入文章组件
import {
    AuthorComponent,
    ArticleSummaryComponent
} from './components/article';

// 导入财务组件
import {
    AmountComponent,
    AmountInWordsComponent,
    TotalComponent,
    InvoiceTypeComponent,
    InvoiceInfoComponent,
    PaymentMethodComponent,
    TaxRateComponent
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
            case 'time':
                return <TimeComponent component={component} />;
            case 'select':
                return <SelectComponent component={component} />;
            case 'radio':
                return <RadioComponent component={component} />;
            case 'checkbox':
                return <CheckboxComponent component={component} />;
            case 'upload':
                return <UploadComponent component={component} />;

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
            case 'contractTerms':
                return <ContractTermsComponent component={component} />;
            case 'signature':
                return <SignatureComponent component={component} />;

            // 文章组件
            case 'author':
                return <AuthorComponent component={component} />;
            case 'articleSummary':
                return <ArticleSummaryComponent component={component} />;

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
            case 'taxRate':
                return <TaxRateComponent component={component} />;

            default:
                return <div>未知组件类型: {component.type}</div>;
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* 分组组件不显示外部标签，因为内部已有标签 */}
            {component.type !== 'group' && (
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>
                        {component.label}
                    </span>
                    {component.required && (
                        <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
                    )}
                </div>
            )}
            {renderComponent()}
        </div>
    );
};

export default FormComponentRenderer; 