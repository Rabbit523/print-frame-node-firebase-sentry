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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const Sentry = __importStar(require("@sentry/node"));
//TODO:Change username and pass
const getToken = async () => {
    const scope = 'printjobs:read printjobs:write hosts:read hosts:write printers:read printers:write documents:read documents:write documents:print documents:print:free identity:read identity:write';
    const grant_type = 'password';
    const username = 'nick_testuser_1@mailinator.com';
    const password = 'ezeep12';
    const base64Encode = 'bVZUclpVTGJBU2Z3OHlOckFpUXBZTXdLTThUR2Y1SFRLRndqRVNCVzpNQnl1UnRXUGhhTXdPeXZINmJtN0llOUZjTDBlbTBlZVZvNWk5RTh0WDZ5Zk5TdW1QMm9uMkJySG5kUnd6YXU3eEthZFNXeUdTbTZaaE5ObGtuSlBwajdNMGwyS2IyMHRCN1RyNm9pSXZxM3FUaXlQVWd6VHRpYU5yb1VaZENEcQ==';
    const form = new form_data_1.default();
    form.append('grant_type', grant_type);
    form.append('username', username);
    form.append('password', password);
    form.append('scope', scope);
    const url = 'https://accounts.ezeep.com/oauth/access_token/';
    try {
        const response = await axios_1.default({
            method: 'post',
            url: url,
            data: form,
            headers: {
                ...form.getHeaders(),
                Authorization: 'Basic ' + base64Encode,
            },
        });
        if (response && response.data && response.data.access_token) {
            return response.data.access_token;
        }
        else {
            Sentry.captureException('Ezeep Token failed');
        }
    }
    catch (e) {
        Sentry.captureException('error is' + e);
    }
    return '';
};
const createPrintDoc = async (name) => {
    try {
        const token = await getToken();
        const url = 'https://portal.ezeep.com/api/documents/';
        const form = new form_data_1.default();
        form.append('name', name);
        const response = await axios_1.default({
            method: 'post',
            url: url,
            data: form,
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`,
            },
        });
        if (response && response.data && response.data.id) {
            return response.data.id;
        }
        else {
            Sentry.captureException('Ezeep Document creation failed');
        }
    }
    catch (e) {
        Sentry.captureException(e);
    }
    return '';
};
const uploadPrintDocument = async (name, filePath) => {
    try {
        const token = await getToken();
        const uid = await createPrintDoc(name);
        const url = `https://portal.ezeep.com/api/documents/${uid}/payload/`;
        const form = new form_data_1.default();
        form.append('filename', name);
        form.append('file', fs_1.default.createReadStream(filePath));
        // form.append('md5',md5File(filePath))
        const response = await axios_1.default({
            method: 'post',
            url: url,
            data: form,
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`,
            },
        });
        Sentry.captureException(response.data);
        if (response && response.data && response.data.id) {
            return response.data.id;
        }
        else {
            Sentry.captureException('Ezeep Document upload failed');
        }
    }
    catch (e) {
        Sentry.captureException(e);
    }
    return false;
};
// uploadPrintDocument('Hamid','')
//# sourceMappingURL=ezeep.js.map