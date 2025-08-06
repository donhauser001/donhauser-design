import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { Client, Contact, Enterprise, Designer, Service, Task, Quotation } from './types';
import { getQuotationsByClientId } from '../../../api/quotations';

export const useCreateProject = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [pricingPolicies, setPricingPolicies] = useState<any[]>([]);

    // 根据选择的客户过滤联系人
    const filteredContacts = selectedClient
        ? contacts.filter(contact => contact.company === selectedClient.name)
        : [];

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/clients?limit=100');
            const data = await response.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            console.error('获取客户列表失败:', error);
            message.error('获取客户列表失败');
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/users?limit=100');
            const data = await response.json();
            if (data.success) {
                setContacts(data.data);
            }
        } catch (error) {
            console.error('获取联系人列表失败:', error);
            message.error('获取联系人列表失败');
        }
    };

    const fetchEnterprises = async () => {
        try {
            const response = await fetch('/api/enterprises?status=active&limit=100');
            const data = await response.json();
            if (data.success) {
                setEnterprises(data.data);
            }
        } catch (error) {
            console.error('获取企业列表失败:', error);
            message.error('获取企业列表失败');
        }
    };

    const fetchDesigners = async () => {
        try {
            const response = await fetch('/api/users?limit=100');
            const data = await response.json();
            if (data.success) {
                const designerUsers = data.data.filter((user: any) =>
                    user.role === '员工' || user.role === '超级管理员'
                );
                setDesigners(designerUsers);
            }
        } catch (error) {
            console.error('获取设计师列表失败:', error);
            message.error('获取设计师列表失败');
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/service-pricing?limit=100');
            const data = await response.json();
            if (data.success) {
                setServices(data.data);
            }
        } catch (error) {
            console.error('获取服务列表失败:', error);
            message.error('获取服务列表失败');
        }
    };

    const fetchPricingPolicies = async () => {
        try {
            const response = await fetch('/api/pricing-policies?status=active&limit=100');
            const data = await response.json();
            if (data.success) {
                setPricingPolicies(data.data);
            }
        } catch (error) {
            console.error('获取定价政策列表失败:', error);
            message.error('获取定价政策列表失败');
        }
    };

    const handleClientChange = useCallback(async (clientId: string) => {
        const client = clients.find(c => c._id === clientId);
        setSelectedClient(client || null);

        // 获取客户关联的报价单
        if (client) {
            try {
                const clientQuotations = await getQuotationsByClientId(client._id);
                setQuotations(clientQuotations);
            } catch (error) {
                console.error('获取客户报价单失败:', error);
                setQuotations([]);
            }
        } else {
            setQuotations([]);
        }
    }, [clients]);

    const handleContactChange = (contactIds: string[]) => {
        // 可以在这里添加联系人变化的处理逻辑
        console.log('选择的联系人:', contactIds);
    };

    const addTask = () => {
        const newTask: Task = {
            taskName: '',
            serviceId: '',
            assignedDesigners: [],
            quantity: 1,
            unit: '',
            subtotal: 0,
            pricingPolicies: [],
            billingDescription: '',
            priority: 'medium',
            remarks: ''
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (index: number) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    const updateTask = (index: number, field: keyof Task, value: any) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    const calculateSubtotal = (task: Task) => {
        const service = services.find(s => s._id === task.serviceId);
        if (service && task.quantity) {
            return service.unitPrice * task.quantity;
        }
        return 0;
    };

    useEffect(() => {
        fetchClients();
        fetchContacts();
        fetchEnterprises();
        fetchDesigners();
        fetchServices();
        fetchPricingPolicies();
    }, []);

    return {
        clients,
        contacts,
        enterprises,
        designers,
        services,
        selectedClient,
        tasks,
        quotations,
        pricingPolicies,
        filteredContacts,
        handleClientChange,
        handleContactChange,
        addTask,
        removeTask,
        updateTask,
        calculateSubtotal
    };
}; 