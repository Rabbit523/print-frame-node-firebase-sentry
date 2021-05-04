"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var orderStatus;
(function (orderStatus) {
    orderStatus["started"] = "started";
    orderStatus["completed"] = "completed";
    orderStatus["cancelled"] = "cancelled";
    orderStatus["refunded"] = "refunded";
    orderStatus["paymentFailed"] = "paymentFailed";
    orderStatus["pendingShipment"] = "pendingShipment";
})(orderStatus = exports.orderStatus || (exports.orderStatus = {}));
var userRoles;
(function (userRoles) {
    userRoles[userRoles["superAdmin"] = 4] = "superAdmin";
    userRoles[userRoles["admin"] = 3] = "admin";
    userRoles[userRoles["user"] = 2] = "user";
})(userRoles = exports.userRoles || (exports.userRoles = {}));
exports.statesArray = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DC',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
];
//# sourceMappingURL=generalInterfaces.js.map