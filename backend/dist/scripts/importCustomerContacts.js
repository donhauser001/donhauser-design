"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/donhauser');
        console.log('数据库连接成功');
    }
    catch (error) {
        console.error('数据库连接失败:', error);
        process.exit(1);
    }
};
const cleanData = (rawData) => {
    const cleanedData = [];
    const processedEmails = new Set();
    const processedPhones = new Set();
    for (const contact of rawData) {
        if (contact.blacklist === "1") {
            continue;
        }
        let phone = contact.contact_phone;
        if (phone) {
            phone = phone.replace(/\.0$/, '');
            phone = phone.replace(/\D/g, '');
            if (phone.length < 11) {
                console.log(`跳过无效电话号码: ${contact.contact_name} - ${contact.contact_phone}`);
                continue;
            }
        }
        else {
            console.log(`跳过无电话号码用户: ${contact.contact_name}`);
            continue;
        }
        if (processedPhones.has(phone)) {
            console.log(`跳过重复电话: ${contact.contact_name} - ${phone}`);
            continue;
        }
        let email = contact.contact_email;
        if (email && email !== "NULL") {
            email = email.replace(/[^\w@.-]/g, '');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                email = '';
            }
        }
        else {
            email = '';
        }
        if (!email) {
            const timestamp = Date.now();
            const randomSuffix = Math.floor(Math.random() * 1000);
            email = `customer_${timestamp}_${randomSuffix}@placeholder.com`;
        }
        if (processedEmails.has(email)) {
            console.log(`跳过重复邮箱: ${contact.contact_name} - ${email}`);
            continue;
        }
        let realName = contact.contact_name?.trim();
        if (!realName || realName === "NULL") {
            console.log(`跳过无姓名用户: ${contact.contact_name}`);
            continue;
        }
        let username = realName.toLowerCase().replace(/\s+/g, '');
        let counter = 1;
        let finalUsername = username;
        while (cleanedData.some(item => item.username === finalUsername)) {
            finalUsername = `${username}${counter}`;
            counter++;
        }
        let company = undefined;
        let address = '';
        if (contact.shipping_method && contact.shipping_method !== "Unknown Address" && contact.shipping_method !== "NULL") {
            address = contact.shipping_method;
        }
        const userData = {
            username: finalUsername,
            password: '123456',
            email: email || undefined,
            phone: phone,
            realName: realName,
            role: '客户',
            department: '客户部',
            status: 'active',
            company: company || undefined,
            contactPerson: realName,
            address: address || undefined,
            shippingMethod: contact.shipping_method && contact.shipping_method !== "Unknown Address" ? contact.shipping_method : undefined,
            description: contact.notes && contact.notes !== "NULL" ? contact.notes : undefined,
            createTime: contact.created_at ? contact.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]
        };
        cleanedData.push(userData);
        processedEmails.add(email);
        processedPhones.add(phone);
    }
    return cleanedData;
};
const importData = async (cleanedData) => {
    try {
        console.log(`开始导入 ${cleanedData.length} 条客户数据...`);
        let successCount = 0;
        let errorCount = 0;
        for (const userData of cleanedData) {
            try {
                const existingUser = await User_1.default.findOne({
                    $or: [
                        { username: userData.username },
                        ...(userData.email ? [{ email: userData.email }] : [])
                    ]
                });
                if (existingUser) {
                    console.log(`跳过已存在用户: ${userData.realName} (${userData.username})`);
                    continue;
                }
                const newUser = new User_1.default(userData);
                await newUser.save();
                successCount++;
                if (successCount % 10 === 0) {
                    console.log(`已成功导入 ${successCount} 条数据...`);
                }
            }
            catch (error) {
                errorCount++;
                console.error(`导入失败 ${userData.realName}:`, error);
            }
        }
        console.log(`\n导入完成！`);
        console.log(`成功: ${successCount} 条`);
        console.log(`失败: ${errorCount} 条`);
        console.log(`总计: ${cleanedData.length} 条`);
    }
    catch (error) {
        console.error('导入过程中发生错误:', error);
    }
};
const main = async () => {
    try {
        await connectDB();
        const filePath = path_1.default.join(__dirname, '../../../date/wp_dhs_customer_contacts.json');
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        const rawData = jsonData[2].data;
        console.log(`原始数据条数: ${rawData.length}`);
        const cleanedData = cleanData(rawData);
        console.log(`清理后数据条数: ${cleanedData.length}`);
        console.log('\n数据示例:');
        cleanedData.slice(0, 3).forEach((item, index) => {
            console.log(`${index + 1}. ${item.realName} - ${item.phone} - ${item.email || '无邮箱'}`);
        });
        console.log('\n是否继续导入数据？(y/n)');
        await importData(cleanedData);
    }
    catch (error) {
        console.error('程序执行失败:', error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('数据库连接已关闭');
        process.exit(0);
    }
};
main();
//# sourceMappingURL=importCustomerContacts.js.map