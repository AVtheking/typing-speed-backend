"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const base_guard_1 = require("./base.guard");
const config_1 = require("../config");
class AdminGuard extends base_guard_1.BaseGuard {
    constructor(jwtService) {
        super(jwtService, config_1.Env.jwtAdminSecret);
    }
}
exports.AdminGuard = AdminGuard;
//# sourceMappingURL=admin.guard.js.map