"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.luhnCheck = luhnCheck;
function luhnCheck(num) {
    const digits = num.replace(/\D/g, '');
    if (digits.length === 0)
        return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i], 10);
        if (isEven) {
            d *= 2;
            if (d > 9)
                d -= 9;
        }
        sum += d;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}
//# sourceMappingURL=luhn.js.map