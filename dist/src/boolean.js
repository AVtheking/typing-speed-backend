"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBoolean = ToBoolean;
exports.cleanData = cleanData;
const class_transformer_1 = require("class-transformer");
function ToBoolean() {
    return (0, class_transformer_1.Transform)((params) => {
        const { value } = params;
        if (typeof value === 'boolean') {
            return value;
        }
        if (value?.toString()?.toLowerCase() === 'false') {
            return false;
        }
        if (value?.toString()?.toLowerCase() === 'true') {
            return true;
        }
        return undefined;
    });
}
function cleanData(data) {
    const cleanedData = {};
    for (const key in data) {
        if (data[key] === '') {
            cleanedData[key] = undefined;
        }
        else {
            cleanedData[key] = data[key];
        }
    }
    return cleanedData;
}
//# sourceMappingURL=boolean.js.map