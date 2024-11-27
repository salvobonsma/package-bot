"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PackageBotError extends Error {
    errorMsgDescription;
    errorMsgFooter;
    constructor(errorMsgDescription, errorMsgFooter = undefined) {
        super();
        this.name = 'PackageBotError';
        this.errorMsgDescription = errorMsgDescription;
        this.errorMsgFooter = errorMsgFooter;
    }
}
exports.default = PackageBotError;
//# sourceMappingURL=packageBotError.js.map