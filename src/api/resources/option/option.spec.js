import { optionModel } from './option.model';
import { userModel } from './../user/user.model';
import { dbTools, createTestServer } from '../../../../tests';
import gql from 'graphql-tag';

describe('Option', () => {
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
    Models: { userModel, optionModel },
  });
  it('should get all', async () => {
    const options = [
      {
        optionKey: 'Stu1',
        optionValue: '123asdgKJL$#',
      },
      {
        optionKey: 'Stu2',
        optionValue: '13asdfgKJL$#',
      },
      {
        optionKey: 'Stu3',
        optionValue: '123asgKJL$#',
      },
      {
        optionKey: 'Stu4',
        optionValue: '123asdfg#',
      },
    ];
    await optionModel.create(options);

    const GET_ALL_OPTIONS = gql`
      {
        getAllOptions(input: { limit: 4, offset: 0 }) {
          options {
            optionValue
            optionKey
          }
        }
      }
    `;
    const { data, errors } = await query({ query: GET_ALL_OPTIONS });
    expect(errors).toBeUndefined();
    expect(data).tobeobject;
    expect(data.getAllOptions.options).toEqual(expect.arrayContaining(options));
  });
  it('should get one option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    const dbOption = await optionModel.create(option);
    const GET_ONE_OPTION = gql`
      query usr($input: OptionIdInput!) {
        getOption(input: $input) {
          optionKey
          optionValue
          id
        }
      }
    `;
    const { data, errors } = await query({
      query: GET_ONE_OPTION,
      variables: { input: { key: dbOption.optionKey } },
    });

    expect(errors).toBeUndefined();
    expect(data).tobeobject;
    expect(data.getOption).toEqual({
      optionKey: option.optionKey,
      optionValue: option.optionValue,
      id: dbOption.id,
    });
  });
  it('should create one option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    const CREATE_ONE_OPTION = gql`
      mutation usr($input: CreateOption!) {
        createOption(input: $input) {
          optionKey
          optionValue
        }
      }
    `;
    const { data, errors } = await mutate({
      mutation: CREATE_ONE_OPTION,
      variables: {
        input: { optionKey: option.optionKey, optionValue: option.optionValue },
      },
    });

    expect(errors).toBeUndefined();
    expect(data).tobeobject;
    expect(data.createOption).toEqual({
      optionKey: option.optionKey,
      optionValue: option.optionValue,
    });
  });
  it('should fail to get one fake option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    await optionModel.create(option);
    const FAIL_GET_OPTION = gql`
      query usr($input: OptionIdInput!) {
        getOption(input: $input) {
          optionKey
          optionValue
          id
        }
      }
    `;
    const { data, errors } = await query({
      query: FAIL_GET_OPTION,
      variables: { input: { optionKey: 'blah' } },
    });

    expect(errors).toBeDefined();
    expect(data).toBeNull;
  });
  it('should update one option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    const dbOption = await optionModel.create(option);
    const updatedValue = 'updated';
    const updatedKey = 'newId';
    const UPDATE_ONE_OPTION = gql`
      mutation usr($input: UpdateOption!) {
        updateOption(input: $input) {
          optionKey
          optionValue
        }
      }
    `;
    const { data, errors } = await mutate({
      mutation: UPDATE_ONE_OPTION,
      variables: {
        input: {
          id: dbOption._id + '',
          optionKey: updatedKey,
          optionValue: updatedValue,
        },
      },
    });

    expect(errors).toBeUndefined();
    expect(data).tobeobject;
    expect(data.updateOption.optionKey).toEqual(updatedKey);
    expect(data.updateOption.optionValue).toEqual(updatedValue);
  });
  it('should fail to update one fake option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    const dbOption = await optionModel.create(option);
    const updatedValue = 'updated';
    const updatedId = 'newId';
    const FAIL_UPDATE_OPTION = gql`
      mutation usr($input: UpdateOption!) {
        updateOption(input: $input) {
          optionKey
          optionValue
        }
      }
    `;
    const { data, errors } = await mutate({
      mutation: FAIL_UPDATE_OPTION,
      variables: {
        input: {
          id: dbOption._id + '45',
          optionKey: updatedId,
          optionValue: updatedValue,
        },
      },
    });

    expect(errors).toBeDefined();
    expect(data).toBeNull;
  });
  it('should delete one option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    const dbOption = await optionModel.create(option);

    const DELETE_ONE_OPTION = gql`
      mutation usr($input: DeleteOption!) {
        deleteOption(input: $input)
      }
    `;
    const { data, errors } = await mutate({
      mutation: DELETE_ONE_OPTION,
      variables: { input: { id: dbOption.id } },
    });

    expect(errors).toBeUndefined();
    expect(data).tobeobject;
    expect(data.deleteOption).toEqual(true);
  });
  it('should fail to delete one fake option', async () => {
    const option = {
      optionKey: 'Stu1',
      optionValue: '123asdgKJL$#',
    };
    const dbOption = await optionModel.create(option);

    const FAIL_DELETE_OPTION = gql`
      mutation usr($input: DeleteOption!) {
        deleteOption(input: $input)
      }
    `;
    const { data, errors } = await mutate({
      mutation: FAIL_DELETE_OPTION,
      variables: { input: { id: dbOption.id + '645' } },
    });
    expect(data).toBeNull();
    expect(errors).toBeTruthy();
  });
});
