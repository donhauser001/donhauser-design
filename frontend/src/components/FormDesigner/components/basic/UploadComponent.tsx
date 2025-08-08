import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FormComponent } from '../../../../types/formDesigner';

interface UploadComponentProps {
    component: FormComponent;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ component }) => {
    return (
        <Upload disabled={true}>
            <Button icon={<UploadOutlined />} disabled={true}>
                点击上传
            </Button>
        </Upload>
    );
};

export default UploadComponent; 