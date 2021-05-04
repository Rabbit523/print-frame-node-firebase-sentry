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
const tests_1 = require("../../../../tests");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const sendGridLib = __importStar(require("./../../libraries/sendGrid"));
describe('Misc', () => {
    beforeAll(async (done) => {
        await tests_1.dbTools.connectToDB();
        done();
    });
    beforeEach(async (done) => {
        await tests_1.dbTools.cleanDB();
        done();
    });
    afterEach(async (done) => {
        await tests_1.dbTools.cleanDB();
        done();
    });
    afterAll(async (done) => {
        await tests_1.dbTools.disconnectDB();
        done();
    });
    const { mutate, query } = tests_1.createTestServer({
        Models: {},
    });
    it('should send contact form', async () => {
        const mock = jest.spyOn(sendGridLib, 'contactFormSubmission');
        mock.mockImplementation(() => { });
        const SEND_CONTACT_FORM = graphql_tag_1.default `
      mutation mu($input: contactFormInput!) {
        sendContactForm(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: SEND_CONTACT_FORM,
            variables: {
                input: {
                    name: 'hamid',
                    email: 'hamidre13@gmail.com',
                    category: 'woooow',
                    message: 'I dont know',
                },
            },
        });
        expect(mock).toHaveBeenCalled();
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.sendContactForm).toEqual(true);
    });
});
//# sourceMappingURL=misc.spec.js.map