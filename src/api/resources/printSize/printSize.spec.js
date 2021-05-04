import gql from 'graphql-tag';
import faker from 'faker';
import { dbTools, createTestServer, logger } from '../../../../tests';
import { printSizeModel } from './printSize.model';

describe('PrintSize', () => {
  beforeAll(async done => {
    await dbTools.connectToDB();
    done();
  });
  beforeEach(async done => {
    await dbTools.cleanDB();
    done();
  });
  afterEach(async done => {
    await dbTools.cleanDB();
    done();
  });
  afterAll(async done => {
    await dbTools.disconnectDB();
    done();
  });
  const { mutate, query } = createTestServer({
    Models: { printSizeModel },
  });
  const printSizeFactory = () => ({
    width: faker.random.number(1000),
    height: faker.random.number(1000),
    price: faker.random.number(1000),
    framePrice: faker.random.number(1000),
    hasFrame: true,
    margin: faker.random.number(1000),
    frameMargin: faker.random.number(1000),
    shippingWidth: faker.random.number(1000),
    shippingLength: faker.random.number(1000),
    shippingHeight: faker.random.number(1000),
    shippingWeight: faker.random.number(1000),
  });
  it('should get all', async () => {
    const printSizes = [];
    for (let i = 0; i < 5; i++) {
      printSizes.push(printSizeFactory());
    }
    await printSizeModel.create(printSizes);
    const GET_ALL_PRINT_SIZES = gql`
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
    const val = await printSizeModel.create(printSize);
    const GET_ONE_PRINT_SIZE = gql`
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

    const CREATE_ONE_PRINT_SIZE = gql`
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

    const val = await printSizeModel.create(printSize);

    const updateWidth = faker.random.number(1000);
    const UPDATE_ONE_PRINT_SIZE = gql`
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

    await printSizeModel.create(printSize);
    const updateWidth = faker.random.number(1000);
    const UPDATE_FAKE_PRINT_SIZE = gql`
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

    const val = await printSizeModel.create(printSize);
    const DELETE_ONE_PRINT_SIZE = gql`
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

    await printSizeModel.create(printSize);
    const DELETE_ONE_PRINT_SIZE = gql`
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
