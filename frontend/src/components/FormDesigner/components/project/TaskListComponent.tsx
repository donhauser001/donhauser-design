import React from 'react';
import { Checkbox, Space } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface TaskListComponentProps {
    component: FormComponent;
}

const TaskListComponent: React.FC<TaskListComponentProps> = ({ component }) => {
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

export default TaskListComponent; 