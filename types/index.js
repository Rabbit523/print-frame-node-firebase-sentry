"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const config_1 = require("./config");
const runCron_1 = require("./runCron");
const server_1 = require("./server");
runCron_1.cron.start();
console.log("*************Cron job started*****************");
const server = http_1.default.createServer(server_1.default);
let currentApp = server_1.default;
server.listen(config_1.default.port, () => {
    console.log("server listening on port " + config_1.default.port);
});
if (module.hot) {
    module.hot.accept("./server", () => {
        console.log("im here");
        server.removeListener("request", currentApp);
        server.on("request", server_1.default);
        currentApp = server_1.default;
    });
}
//# sourceMappingURL=index.js.map