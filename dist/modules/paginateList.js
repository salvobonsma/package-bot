"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginateList = (list) => {
    var paginatedList = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i].deleted == true) {
            list.splice(i, 1);
            i--;
        }
    }
    for (var i = 0; i < Math.ceil(list.length / 5); i++) {
        paginatedList.push(list.slice(i * 5, i * 5 + 5));
    }
    return paginatedList;
};
module.exports = paginateList;
//# sourceMappingURL=paginateList.js.map