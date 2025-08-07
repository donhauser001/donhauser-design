import React from 'react';
import { Radio, Space } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface RadioComponentProps {
    component: FormComponent;
}

const RadioComponent: React.FC<RadioComponentProps> = ({ component }) => {
    return (
        <Radio.Group disabled={true}>
            <Space direction="vertical">
                {component.options?.map((option, index) => (
                    <Radio key={index} value={option.value}>
                        {option.label}
                    </Radio>
                ))}
            </Space>
        </Radio.Group>
    );
};

export default RadioComponent; 