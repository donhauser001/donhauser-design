import React from 'react'

interface StepIndicatorProps {
    currentStep: number
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: currentStep >= 1 ? '#1890ff' : '#d9d9d9',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
                    1
                </div>
                <div style={{
                    width: 60,
                    height: 2,
                    backgroundColor: currentStep >= 2 ? '#1890ff' : '#d9d9d9',
                    margin: '0 8px'
                }}></div>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: currentStep >= 2 ? '#1890ff' : '#d9d9d9',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
                    2
                </div>
                <div style={{
                    width: 60,
                    height: 2,
                    backgroundColor: currentStep >= 3 ? '#1890ff' : '#d9d9d9',
                    margin: '0 8px'
                }}></div>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: currentStep >= 3 ? '#1890ff' : '#d9d9d9',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}>
                    3
                </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                {currentStep === 1 ? '选择客户和联系人' : currentStep === 2 ? '选择服务项目' : '确认订单信息'}
            </div>
        </div>
    )
}

export default StepIndicator 