"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRMB = void 0;
const convertToRMB = (num, showPrefix = false) => {
    if (num === 0)
        return showPrefix ? '人民币零元整' : '零元整';
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const integerPart = Math.floor(absNum);
    const decimalPart = Math.round((absNum - integerPart) * 100);
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '万', '亿', '万亿'];
    const convertFourDigits = (num) => {
        if (num === 0)
            return '';
        const result = [];
        const numStr = num.toString().padStart(4, '0');
        for (let i = 0; i < 4; i++) {
            const digit = parseInt(numStr[i]);
            if (digit === 0) {
                if (result.length > 0 && result[result.length - 1] !== '零') {
                    result.push('零');
                }
            }
            else {
                result.push(digits[digit] + units[3 - i]);
            }
        }
        return result.join('').replace(/零+$/, '');
    };
    const convertInteger = (num) => {
        if (num === 0)
            return '';
        const result = [];
        let unitIndex = 0;
        while (num > 0) {
            const fourDigits = num % 10000;
            const fourDigitsStr = convertFourDigits(fourDigits);
            if (fourDigitsStr) {
                result.unshift(fourDigitsStr + bigUnits[unitIndex]);
            }
            else if (unitIndex > 0 && result.length > 0) {
                if (result[0] !== '零') {
                    result.unshift('零');
                }
            }
            num = Math.floor(num / 10000);
            unitIndex++;
        }
        return result.join('').replace(/零+$/, '');
    };
    const convertDecimal = (num) => {
        if (num === 0)
            return '';
        const jiao = Math.floor(num / 10);
        const fen = num % 10;
        let result = '';
        if (jiao > 0) {
            result += digits[jiao] + '角';
        }
        if (fen > 0) {
            result += digits[fen] + '分';
        }
        return result;
    };
    let result = '';
    if (integerPart > 0) {
        result += convertInteger(integerPart) + '元';
    }
    const decimalResult = convertDecimal(decimalPart);
    if (decimalResult) {
        result += decimalResult;
    }
    else if (integerPart > 0) {
        result += '整';
    }
    if (result === '') {
        result = showPrefix ? '人民币零元整' : '零元整';
    }
    if (isNegative) {
        result = '负' + result;
    }
    if (showPrefix) {
        result = '人民币' + result;
    }
    return result;
};
exports.convertToRMB = convertToRMB;
//# sourceMappingURL=rmbConverter.js.map