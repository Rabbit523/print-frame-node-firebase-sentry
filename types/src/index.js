"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./config"));
const runCron_1 = require("./runCron");
const server_1 = __importDefault(require("./server"));
const Sentry = __importStar(require("@sentry/node"));
if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: 'https://fec2a66679b04d18978dbe303856a163@sentry.io/2924823' });
    console.log('sentry started');
}
runCron_1.cron.start();
const server = http_1.default.createServer(server_1.default);
server.listen(config_1.default.port, () => {
    console.log('server listening on port ' + config_1.default.port);
});
//# sourceMappingURL=index.js.map