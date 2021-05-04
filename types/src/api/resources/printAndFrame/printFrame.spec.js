"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const faker_1 = __importDefault(require("faker"));
const tests_1 = require("../../../../tests");
const printAndFrame_model_1 = require("./printAndFrame.model");
describe("PrintFrame", () => {
    beforeAll(tests_1.dbTools.connectToDB);
    beforeEach(tests_1.dbTools.cleanDB);
    afterEach(tests_1.dbTools.cleanDB);
    //afterAll(dbTools.disconnectDB);
    const { mutate, query } = tests_1.createTestServer({
        Models: { printAndFrameModel: printAndFrame_model_1.printAndFrameModel }
    });
    const printFrameFactory = () => ({
        frameName: faker_1.default.name.firstName(),
        width: faker_1.default.random.number(1000),
        height: faker_1.default.random.number(1000),
        price: faker_1.default.random.number(1000),
        margin: faker_1.default.random.number(50),
        frameUrl: faker_1.default.image.imageUrl()
    });
    it("should get all", async () => {
        const printFrames = [];
        for (let i = 0; i < 5; i++) {
            printFrames.push(printFrameFactory());
        }
        await printAndFrame_model_1.printAndFrameModel.create(printFrames);
        const GET_ALL_PRINT_FRAMES = graphql_tag_1.default `
      {
        getAllPrintFrames(input: { limit: 5, offset: 0 }) {
          printFrames {
            frameName
            width
            height
            price
            frameUrl
            margin
          }
        }
      }
    `;
        const { data, errors } = await query({ query: GET_ALL_PRINT_FRAMES });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getAllPrintFrames.printFrames).toEqual(expect.arrayContaining(printFrames));
    });
    it("should get one printFrame", async () => {
        const printFrame = printFrameFactory();
        const val = await printAndFrame_model_1.printAndFrameModel.create(printFrame);
        const GET_ONE_PRINT_FRAME = graphql_tag_1.default `
      query printFrame($input: PrintFrameInput!) {
        getOnePrintFrame(input: $input) {
          frameName
          width
          height
          price
          disabled
          frameUrl
          id
        }
      }
    `;
        const { data, errors } = await query({
            query: GET_ONE_PRINT_FRAME,
            variables: { input: { id: val.id } }
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getOnePrintFrame).toEqual({
            frameName: printFrame.frameName,
            width: printFrame.width,
            height: printFrame.height,
            price: printFrame.price,
            disabled: false,
            frameUrl: printFrame.frameUrl,
            id: val.id
        });
    });
    it("should create one printFrame", async () => {
        const printFrame = printFrameFactory();
        const CREATE_ONE_PRINT_FRAME = graphql_tag_1.default `
      mutation printFrame($input: NewPrintFrame!) {
        createPrintFrame(input: $input) {
          frameName
          width
          height
          price
          frameUrl
          margin
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_PRINT_FRAME,
            variables: {
                input: printFrame
            }
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.createPrintFrame).toEqual(printFrame);
    });
    it("should update one printFrame", async () => {
        const printFrame = printFrameFactory();
        const val = await printAndFrame_model_1.printAndFrameModel.create(printFrame);
        const updateWidth = faker_1.default.random.number(1000);
        const updateDisabled = true;
        const UPDATE_ONE_PRINT_FRAME = graphql_tag_1.default `
      mutation usr($input: UpdatePrintFrame!) {
        updatePrintFrame(input: $input) {
          frameName
          width
          height
          price
          disabled
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_ONE_PRINT_FRAME,
            variables: {
                input: {
                    id: val.id,
                    width: updateWidth,
                    disabled: updateDisabled
                }
            }
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.updatePrintFrame).toEqual({
            frameName: printFrame.frameName,
            width: updateWidth,
            height: printFrame.height,
            price: printFrame.price,
            disabled: updateDisabled
        });
    });
    it("should fail to update one fake printFrame", async () => {
        const printFrame = printFrameFactory();
        const val = await printAndFrame_model_1.printAndFrameModel.create(printFrame);
        const updateWidth = faker_1.default.random.number(1000);
        const updateDisabled = true;
        const UPDATE_FAKE_PRINT_FRAME = graphql_tag_1.default `
      mutation usr($input: UpdatePrintFrame!) {
        updatePrintFrame(input: $input) {
          frameName
          width
          height
          price
          disabled
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_FAKE_PRINT_FRAME,
            variables: {
                input: {
                    id: 456564,
                    width: updateWidth,
                    disabled: updateDisabled
                }
            }
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it("should delete one print Frame", async () => {
        const printFrame = printFrameFactory();
        const val = await printAndFrame_model_1.printAndFrameModel.create(printFrame);
        const DELETE_ONE_PRINT_FRAME = graphql_tag_1.default `
      mutation usr($input: DeletePrintFrame!) {
        deletePrintFrame(input: $input) {
          err
          id
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_PRINT_FRAME,
            variables: { input: { id: val.id } }
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.deletePrintFrame.id).toEqual(val.id);
        expect(data.deletePrintFrame.err).toBe(0);
    });
    it("should fail to delete fictional print frame", async () => {
        const printFrame = printFrameFactory();
        const val = await printAndFrame_model_1.printAndFrameModel.create(printFrame);
        const DELETE_ONE_PRINT_FRAME = graphql_tag_1.default `
      mutation usr($input: DeletePrintFrame!) {
        deletePrintFrame(input: $input) {
          err
          id
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_PRINT_FRAME,
            variables: { input: { id: 1234 } }
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
});
//# sourceMappingURL=printFrame.spec.js.map