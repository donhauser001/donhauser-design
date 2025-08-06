"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, '../../../date/wp_dhs_customer_contacts.json');
const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
const jsonData = JSON.parse(fileContent);
console.log('JSON数据结构:');
console.log('总长度:', jsonData.length);
console.log('类型:', typeof jsonData);
jsonData.forEach((item, index) => {
    console.log(`\n索引 ${index}:`);
    console.log('类型:', item.type);
    console.log('键:', Object.keys(item));
    if (item.data) {
        console.log('数据长度:', item.data.length);
        if (item.data.length > 0) {
            console.log('第一条数据示例:', item.data[0]);
        }
    }
});
//# sourceMappingURL=debugJsonStructure.js.map