import React from 'react';
import { Input } from 'antd';
import { FormComponent } from '../../../../types/formDesigner';

interface ProjectNameComponentProps {
    component: FormComponent;
}

const ProjectNameComponent: React.FC<ProjectNameComponentProps> = ({ component }) => {
    return (
        <Input
            placeholder={component.placeholder}
            disabled={true}
            style={component.style}
        />
    );
};

export default ProjectNameComponent; 