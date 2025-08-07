import React from 'react';
import { Checkbox, Space } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface CheckboxComponentProps {
    component: FormComponent;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ component }) => {
    return (
        <Checkbox.Group disabled={true}>
            <Space direction="vertical">
                {component.options?.map((option, index) => (
                    <Checkbox key={index} value={option.value}>
                        {option.label}
                    </Checkbox>
                ))}
            </Space>
        </Checkbox.Group>
    );
};

export default CheckboxComponent; 