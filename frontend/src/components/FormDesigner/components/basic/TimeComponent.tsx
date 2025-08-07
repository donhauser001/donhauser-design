import React from 'react';
import { TimePicker } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface TimeComponentProps {
    component: FormComponent;
}

const TimeComponent: React.FC<TimeComponentProps> = ({ component }) => {
    return (
        <TimePicker
            disabled={true}
            style={component.style}
        />
    );
};

export default TimeComponent; 