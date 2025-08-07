import React from 'react';
import { Select } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface SelectComponentProps {
    component: FormComponent;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ component }) => {
    return (
        <Select
            placeholder="请选择"
            disabled={true}
            style={component.style}
            options={component.options?.map(opt => ({
                label: opt.label,
                value: opt.value
            }))}
        />
    );
};

export default SelectComponent; 