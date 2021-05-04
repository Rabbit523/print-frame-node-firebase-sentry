"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const faker_1 = __importDefault(require("faker"));
const tests_1 = require("../../../../tests");
const printSize_model_1 = require("./printSize.model");
describe('PrintSize', () => {
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
        Models: { printSizeModel: printSize_model_1.printSizeModel },
    });
    const printSizeFactory = () => ({
        width: faker_1.default.random.number(1000),
        height: faker_1.default.random.number(1000),
        price: faker_1.default.random.number(1000),
        framePrice: faker_1.default.random.number(1000),
        hasFrame: true,
        margin: faker_1.default.random.number(1000),
        frameMargin: faker_1.default.random.number(1000),
        shippingWidth: faker_1.default.random.number(1000),
        shippingLength: faker_1.default.random.number(1000),
        shippingHeight: faker_1.default.random.number(1000),
        shippingWeight: faker_1.default.random.number(1000),
    });
    it('should get all', async () => {
        const printSizes = [];
        for (let i = 0; i < 5; i++) {
            printSizes.push(printSizeFactory());
        }
        await printSize_model_1.printSizeModel.create(printSizes);
        const GET_ALL_PRINT_SIZES = graphql_tag_1.default `
      {
        getAllPrintSizes(input: { limit: 5, offset: 0 }) {
          printSizes {
            width
            height
            price
            framePrice
            hasFrame
            margin
            frameMargin
            shippingHeight
            shippingLength
            shippingWeight
            shippingWidth
          }
        }
      }
    `;
        const { data, errors } = await query({ query: GET_ALL_PRINT_SIZES });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getAllPrintSizes.printSizes).toEqual(expect.arrayContaining(printSizes));
    });
    it('should get one printSize', async () => {
        const printSize = printSizeFactory();
        const val = await printSize_model_1.printSizeModel.create(printSize);
        const GET_ONE_PRINT_SIZE = graphql_tag_1.default `
      query printFrame($input: PrintSizeInput!) {
        getOnePrintSize(input: $input) {
          width
          height
          price
          id
        }
      }
    `;
        const { data, errors } = await query({
            query: GET_ONE_PRINT_SIZE,
            variables: { input: { id: val.id } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getOnePrintSize).toEqual({
            width: printSize.width,
            height: printSize.height,
            price: printSize.price,
            id: val.id,
        });
    });
    it('should create one printSize', async () => {
        const printSize = printSizeFactory();
        const CREATE_ONE_PRINT_SIZE = graphql_tag_1.default `
      mutation printFrame($input: NewPrintSize!) {
        createPrintSize(input: $input) {
          width
          height
          price
          framePrice
          hasFrame
          margin
          frameMargin
          shippingHeight
          shippingLength
          shippingWeight
          shippingWidth
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_PRINT_SIZE,
            variables: {
                input: printSize,
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.createPrintSize).toEqual(printSize);
    });
    it('should update one printSize', async () => {
        const printSize = printSizeFactory();
        const val = await printSize_model_1.printSizeModel.create(printSize);
        const updateWidth = faker_1.default.random.number(1000);
        const UPDATE_ONE_PRINT_SIZE = graphql_tag_1.default `
      mutation usr($input: UpdatePrintSize!) {
        updatePrintSize(input: $input) {
          width
          height
          price
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_ONE_PRINT_SIZE,
            variables: {
                input: {
                    id: val.id,
                    width: updateWidth,
                },
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.updatePrintSize).toEqual({
            width: updateWidth,
            height: printSize.height,
            price: printSize.price,
        });
    });
    it('should fail to update one fake printSize', async () => {
        const printSize = printSizeFactory();
        await printSize_model_1.printSizeModel.create(printSize);
        const updateWidth = faker_1.default.random.number(1000);
        const UPDATE_FAKE_PRINT_SIZE = graphql_tag_1.default `
      mutation usr($input: UpdatePrintSize!) {
        updatePrintSize(input: $input) {
          width
          height
          price
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_FAKE_PRINT_SIZE,
            variables: {
                input: {
                    id: 456564,
                    width: updateWidth,
                },
            },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should delete one printSize', async () => {
        const printSize = printSizeFactory();
        const val = await printSize_model_1.printSizeModel.create(printSize);
        const DELETE_ONE_PRINT_SIZE = graphql_tag_1.default `
      mutation usr($input: DeletePrintSize!) {
        deletePrintSize(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_PRINT_SIZE,
            variables: { input: { id: val.id } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.deletePrintSize).toEqual(true);
    });
    it('should fail to delete fictional printSize', async () => {
        const printSize = printSizeFactory();
        await printSize_model_1.printSizeModel.create(printSize);
        const DELETE_ONE_PRINT_SIZE = graphql_tag_1.default `
      mutation usr($input: DeletePrintSize!) {
        deletePrintSize(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_PRINT_SIZE,
            variables: { input: { id: 1234 } },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
});
//# sourceMappingURL=printSize.spec.js.map