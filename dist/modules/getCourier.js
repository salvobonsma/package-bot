"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourier = void 0;
const pcgNumRegex = {
    dpd: [/^\d{10}$/, /^\d{12}$/, /^\d{14}$/, /^\d{13}[A-Z\d]$/, /^\d{14}[A-Z\d]$/],
    gls: [/^\d{10}$/, /^\d{11}$/, /^\d{12}$/, /^\d{14}$/, /^\d{20}$/, /^\d{2}B[A-Z0-9]{5}$/, /^\d{2}AE[A-Z0-9]{4}$/],
    ups: [/^1Z[A-Za-z0-9]{6}\d{10}$/, /^\d{12}$/, /^T\d{10}$/, /^\d{9}$/],
};
const pcgNumRegexCouriers = ['dpd', 'gls', 'ups'];
const getCourier = (packageNum) => {
    packageNum = packageNum.toUpperCase();
    var couriers = [];
    for (var i = 0; i < pcgNumRegexCouriers.length; i++) {
        var courier = pcgNumRegexCouriers[i];
        for (var j = 0; j < pcgNumRegex[courier].length; j++) {
            if (pcgNumRegex[courier][j].test(packageNum))
                couriers.push(courier);
        }
    }
    return couriers;
};
exports.getCourier = getCourier;
//# sourceMappingURL=getCourier.js.map