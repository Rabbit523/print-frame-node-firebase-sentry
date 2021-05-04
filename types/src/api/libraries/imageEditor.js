"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
function testIt() {
    sharp_1.default('uploads/0ac9b57e/819541ab.JPG')
        .jpeg({ quality: 100, progressive: true })
        .extract({
        left: Math.floor(6000 * 0.5328000000000047),
        top: Math.floor(4000 * 0.33333333333333337),
        width: Math.floor(6000 * 0.3552),
        height: Math.floor(4000 * 0.6666666666666666),
    })
        .toFile('uploads/0ac9b57e/819541ab-Editted.JPG', function (err) {
        // console.log(err);
        // Extract a region of the input image, saving in the same format.
    });
}
//# sourceMappingURL=imageEditor.js.map