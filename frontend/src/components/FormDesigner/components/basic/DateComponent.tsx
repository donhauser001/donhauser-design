import React from 'react';
import { DatePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface DateComponentProps {
    component: FormComponent;
}

const DateComponent: React.FC<DateComponentProps> = ({ component }) => {
    return (
        <DatePicker
            disabled={true}
            style={component.style}
        />
    );
};

export default DateComponent; 