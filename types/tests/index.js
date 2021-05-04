"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./db"));
__export(require("./run"));
exports.logger = (msg) => {
    console.log(JSON.stringify(msg, null, 4));
};
//# sourceMappingURL=index.js.map