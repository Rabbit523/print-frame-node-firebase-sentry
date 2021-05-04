"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const faker_1 = __importDefault(require("faker"));
const tests_1 = require("../../../../tests");
const discountCode_model_1 = require("./discountCode.model");
const moment_1 = __importDefault(require("moment"));
describe('DiscountCode', () => {
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
        Models: { discountCodeModel: discountCode_model_1.discountCodeModel },
    });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    const discountCodeFactory = () => ({
        code: faker_1.default.random.alphaNumeric(16),
        expirationDate: faker_1.default.date.future().getTime() + '',
        value: faker_1.default.random.number(100),
        type: faker_1.default.random.arrayElement(['fix', 'percent']),
    });
    it('should get all', async () => {
        const discountCodes = [];
        for (let i = 0; i < 5; i++) {
            discountCodes.push(discountCodeFactory());
        }
        await discountCode_model_1.discountCodeModel.create(discountCodes);
        const GET_ALL_DISCOUNT_CODES = graphql_tag_1.default `
      {
        getAllDiscountCodes(input: { limit: 5, offset: 0 }) {
          discountCodes {
            code
            expirationDate
            type
            value
          }
        }
      }
    `;
        const { data, errors } = await query({ query: GET_ALL_DISCOUNT_CODES });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getAllDiscountCodes.discountCodes).toEqual(expect.arrayContaining(discountCodes));
    });
    it('should get one DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const GET_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      query DiscountCode($input: DiscountCodeInput!) {
        getOneDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
          id
        }
      }
    `;
        const { data, errors } = await query({
            query: GET_ONE_DISCOUNT_CODE,
            variables: { input: { id: val.id } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getOneDiscountCode).toEqual({
            code: DiscountCode.code,
            expirationDate: DiscountCode.expirationDate,
            type: DiscountCode.type,
            value: DiscountCode.value,
            id: val.id,
        });
    });
    it('should check one existing DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const IS_CODE_EXIST = graphql_tag_1.default `
      query DiscountCode($input: DiscountCodeExist!) {
        isValidDiscountCode(input: $input) {
          value
          type
        }
      }
    `;
        const { data, errors } = await query({
            query: IS_CODE_EXIST,
            variables: { input: { code: val.code } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.isValidDiscountCode).toEqual({
            value: val.value,
            type: val.type,
        });
    });
    it('should check one existing DiscountCode with over the limit', async () => {
        const DiscountCode = {
            code: faker_1.default.random.alphaNumeric(16),
            expirationDate: faker_1.default.date.future().getTime() + '',
            value: faker_1.default.random.number(100),
            type: faker_1.default.random.arrayElement(['fix', 'percent']),
            limit: 100,
            timesUsed: 200,
        };
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const IS_CODE_EXIST = graphql_tag_1.default `
      query DiscountCode($input: DiscountCodeExist!) {
        isValidDiscountCode(input: $input) {
          value
          type
        }
      }
    `;
        const { data, errors } = await query({
            query: IS_CODE_EXIST,
            variables: { input: { code: val.code } },
        });
        expect(errors).toBeDefined();
        expect(data).toBeNull;
    });
    it('should check one existing DiscountCode with expired date', async () => {
        const DiscountCode = {
            code: faker_1.default.random.alphaNumeric(16),
            expirationDate: moment_1.default().add(1, 'second'),
            value: faker_1.default.random.number(100),
            type: faker_1.default.random.arrayElement(['fix', 'percent']),
        };
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        await sleep(1000);
        const IS_CODE_EXIST = graphql_tag_1.default `
      query DiscountCode($input: DiscountCodeExist!) {
        isValidDiscountCode(input: $input) {
          value
          type
        }
      }
    `;
        const { data, errors } = await query({
            query: IS_CODE_EXIST,
            variables: { input: { code: val.code } },
        });
        expect(errors).toBeDefined();
        expect(data).toBeNull;
    });
    it('should create one DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        const CREATE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation DiscountCode($input: NewDiscountCode!) {
        createDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_DISCOUNT_CODE,
            variables: {
                input: DiscountCode,
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.createDiscountCode).toEqual(DiscountCode);
    });
    it('should fail to create duplicate code for DiscountCode', async () => {
        const sameCode = faker_1.default.random.alphaNumeric(16);
        const DiscountCode = {
            code: sameCode,
            expirationDate: faker_1.default.date.future().getTime() + '',
            value: faker_1.default.random.number(100),
            type: faker_1.default.random.arrayElement(['fix', 'percent']),
        };
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const CREATE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation DiscountCode($input: NewDiscountCode!) {
        createDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_DISCOUNT_CODE,
            variables: {
                input: DiscountCode,
            },
        });
        expect(errors).toBeDefined();
        expect(data).toBeNull;
    });
    it('should fail to create one DiscountCode above %100', async () => {
        const DiscountCode = {
            code: faker_1.default.random.alphaNumeric(16),
            expirationDate: faker_1.default.date.future().getTime() + '',
            value: faker_1.default.random.number({ min: 100, max: 1000 }),
            type: 'percent',
        };
        const CREATE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation DiscountCode($input: NewDiscountCode!) {
        createDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_DISCOUNT_CODE,
            variables: {
                input: DiscountCode,
            },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should fail to create one DiscountCode with past exp date', async () => {
        const DiscountCode = {
            code: faker_1.default.random.alphaNumeric(16),
            expirationDate: faker_1.default.date.past().getTime() + '',
            value: faker_1.default.random.number(100),
            type: faker_1.default.random.arrayElement(['fix', 'percent']),
        };
        const CREATE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation DiscountCode($input: NewDiscountCode!) {
        createDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_DISCOUNT_CODE,
            variables: {
                input: DiscountCode,
            },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should update one DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const value = faker_1.default.random.number(100);
        const UPDATE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation usr($input: UpdateDiscountCode!) {
        updateDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_ONE_DISCOUNT_CODE,
            variables: {
                input: {
                    id: val.id,
                    value,
                },
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.updateDiscountCode).toEqual({
            code: DiscountCode.code,
            expirationDate: DiscountCode.expirationDate,
            type: DiscountCode.type,
            value,
        });
    });
    it('should fail to update one fake DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const value = faker_1.default.random.number(100);
        const UPDATE_FAKE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation usr($input: UpdateDiscountCode!) {
        updateDiscountCode(input: $input) {
          code
          expirationDate
          type
          value
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_FAKE_DISCOUNT_CODE,
            variables: {
                input: {
                    id: 456564,
                    value,
                },
            },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should delete one DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        const val = await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const DELETE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation usr($input: DeleteDiscountCode!) {
        deleteDiscountCode(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_DISCOUNT_CODE,
            variables: { input: { id: val.id } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.deleteDiscountCode).toEqual(true);
    });
    it('should fail to delete fictional DiscountCode', async () => {
        const DiscountCode = discountCodeFactory();
        await discountCode_model_1.discountCodeModel.create(DiscountCode);
        const DELETE_ONE_DISCOUNT_CODE = graphql_tag_1.default `
      mutation usr($input: DeleteDiscountCode!) {
        deleteDiscountCode(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_DISCOUNT_CODE,
            variables: { input: { id: 1234 } },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
});
//# sourceMappingURL=discountCode.spec.js.map