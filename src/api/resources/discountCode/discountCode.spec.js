import gql from 'graphql-tag';
import faker from 'faker';
import { dbTools, createTestServer, logger } from '../../../../tests';
import { discountCodeModel } from './discountCode.model';
import moment from 'moment';

describe('DiscountCode', () => {
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
    Models: { discountCodeModel },
  });
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const discountCodeFactory = () => ({
    code: faker.random.alphaNumeric(16),
    expirationDate: faker.date.future().getTime() + '',
    value: faker.random.number(100),
    type: faker.random.arrayElement(['fix', 'percent']),
  });
  it('should get all', async () => {
    const discountCodes = [];
    for (let i = 0; i < 5; i++) {
      discountCodes.push(discountCodeFactory());
    }

    await discountCodeModel.create(discountCodes);
    const GET_ALL_DISCOUNT_CODES = gql`
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

    const val = await discountCodeModel.create(DiscountCode);
    const GET_ONE_DISCOUNT_CODE = gql`
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

    const val = await discountCodeModel.create(DiscountCode);
    const IS_CODE_EXIST = gql`
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
      code: faker.random.alphaNumeric(16),
      expirationDate: faker.date.future().getTime() + '',
      value: faker.random.number(100),
      type: faker.random.arrayElement(['fix', 'percent']),
      limit: 100,
      timesUsed: 200,
    };

    const val = await discountCodeModel.create(DiscountCode);
    const IS_CODE_EXIST = gql`
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
      code: faker.random.alphaNumeric(16),
      expirationDate: moment().add(1, 'second'),
      value: faker.random.number(100),
      type: faker.random.arrayElement(['fix', 'percent']),
    };

    const val = await discountCodeModel.create(DiscountCode);
    await sleep(1000);
    const IS_CODE_EXIST = gql`
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

    const CREATE_ONE_DISCOUNT_CODE = gql`
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
    const sameCode = faker.random.alphaNumeric(16);
    const DiscountCode = {
      code: sameCode,
      expirationDate: faker.date.future().getTime() + '',
      value: faker.random.number(100),
      type: faker.random.arrayElement(['fix', 'percent']),
    };
    const val = await discountCodeModel.create(DiscountCode);

    const CREATE_ONE_DISCOUNT_CODE = gql`
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
      code: faker.random.alphaNumeric(16),
      expirationDate: faker.date.future().getTime() + '',
      value: faker.random.number({ min: 100, max: 1000 }),
      type: 'percent',
    };

    const CREATE_ONE_DISCOUNT_CODE = gql`
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
      code: faker.random.alphaNumeric(16),
      expirationDate: faker.date.past().getTime() + '',
      value: faker.random.number(100),
      type: faker.random.arrayElement(['fix', 'percent']),
    };

    const CREATE_ONE_DISCOUNT_CODE = gql`
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

    const val = await discountCodeModel.create(DiscountCode);

    const value = faker.random.number(100);

    const UPDATE_ONE_DISCOUNT_CODE = gql`
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

    await discountCodeModel.create(DiscountCode);
    const value = faker.random.number(100);

    const UPDATE_FAKE_DISCOUNT_CODE = gql`
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

    const val = await discountCodeModel.create(DiscountCode);
    const DELETE_ONE_DISCOUNT_CODE = gql`
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

    await discountCodeModel.create(DiscountCode);
    const DELETE_ONE_DISCOUNT_CODE = gql`
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
