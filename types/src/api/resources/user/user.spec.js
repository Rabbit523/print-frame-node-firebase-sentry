"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./user.model");
const tests_1 = require("../../../../tests");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
describe.skip('User', () => {
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
        Models: { userModel: user_model_1.userModel, userMeta: user_model_1.userMeta },
    });
    it('should get all', async () => {
        const users = [
            {
                userName: 'Stu1',
                password: '123asdfgKJL$#',
                userEmail: 'test@test.org',
            },
            {
                userName: 'Stu2',
                password: '123asdfgKJL$#',
                userEmail: 'test23@test.org',
            },
            {
                userName: 'Stu3',
                password: '123asdfgKJL$#',
                userEmail: 'testgfd@test.org',
            },
            {
                userName: 'Stu4',
                password: '123asdfgKJL$#',
                userEmail: 'testgsdf@test.org',
            },
        ];
        await user_model_1.userModel.create(users);
        const GET_ALL_USERS = graphql_tag_1.default `
      {
        getAllUsers(input: { limit: 4, offset: 0 }) {
          users {
            userName
            userEmail
          }
        }
      }
    `;
        const { data, errors } = await query({ query: GET_ALL_USERS });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        const tempUser = users.map(us => {
            return { userName: us.userName, userEmail: us.userEmail };
        });
        expect(data.getAllUsers.users).toEqual(expect.arrayContaining(tempUser));
    });
    it('should get one user', async () => {
        const users = {
            userName: 'Stu1',
            password: '123asdfgKJL$#',
            userEmail: 'test@test.org',
        };
        const val = await user_model_1.userModel.create(users);
        const GET_ONE_USER = graphql_tag_1.default `
      query usr($input: UserIdInput!) {
        getUser(input: $input) {
          userName
          userEmail
          id
        }
      }
    `;
        const { data, errors } = await query({
            query: GET_ONE_USER,
            variables: { input: { id: val.id } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getUser).toEqual({
            userEmail: users.userEmail,
            userName: users.userName,
            id: val.id,
        });
    });
    it('should create one user', async () => {
        const user = {
            userName: 'Stu1',
            password: '123asdfgKJL$#',
            userEmail: 'test@test.org',
        };
        const CREATE_ONE_USER = graphql_tag_1.default `
      mutation usr($input: NewUser!) {
        createUser(input: $input) {
          userName
          userEmail
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_USER,
            variables: {
                input: {
                    userName: user.userName,
                    userEmail: user.userEmail,
                    password: user.password,
                },
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.createUser.userName).toEqual(user.userName);
    });
    it('should check existing username', async () => {
        const users = [
            {
                userName: 'Stu1',
                password: '123asdfgKJL$#',
                userEmail: 'test@test.org',
            },
            {
                userName: 'Stu2',
                password: '123asdfgKJL$#',
                userEmail: 'test23@test.org',
            },
        ];
        await user_model_1.userModel.create(users);
        const CHECK_EXISTING = graphql_tag_1.default `
      query usr($input: CheckUser!) {
        isUser(input: $input)
      }
    `;
        const { data, errors } = await query({
            query: CHECK_EXISTING,
            variables: { input: { userName: 'Stu1' } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.isUser).toBeTruthy();
    });
    it('should check non existing username', async () => {
        const users = [
            {
                userName: 'Stu1',
                password: '123asdfgKJL$#',
                userEmail: 'test@test.org',
            },
            {
                userName: 'Stu2',
                password: '123asdfgKJL$#',
                userEmail: 'test23@test.org',
            },
        ];
        await user_model_1.userModel.create(users);
        const NON_USER = graphql_tag_1.default `
      query usr($input: CheckUser!) {
        isUser(input: $input)
      }
    `;
        const { data, errors } = await query({
            query: NON_USER,
            variables: { input: { userName: 'null' } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.isUser).toBeFalsy();
    });
    it('should update one user', async () => {
        const users = {
            userName: 'Stu1',
            password: '123asdfgKJL$#',
            userEmail: 'test@test.org',
        };
        const val = await user_model_1.userModel.create(users);
        const updateEmail = 'update@sgf.vsdfg';
        const updatePassword = 'asdfasdfasdfasdfas$%G4';
        const UPDATE_ONE_USER = graphql_tag_1.default `
      mutation usr($input: UpdateUser!) {
        updateUser(input: $input) {
          userName
          userEmail
          id
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_ONE_USER,
            variables: {
                input: {
                    id: val.id,
                    userEmail: updateEmail,
                    password: updatePassword,
                },
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.updateUser.userEmail).toEqual(updateEmail);
        expect(data.updateUser.password).not.toEqual(val.password);
    });
    it('should fail to update one fake user', async () => {
        const users = {
            userName: 'Stu1',
            password: '123asdfgKJL$#',
            userEmail: 'test@test.org',
        };
        await user_model_1.userModel.create(users);
        const updateEmail = 'update@sgf.vsdfg';
        const updatePassword = 'asdfasdfasdfasdfas$%G4';
        const UPDATE_FAKE_USER = graphql_tag_1.default `
      mutation usr($input: UpdateUser!) {
        updateUser(input: $input) {
          userName
          userEmail
          id
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_FAKE_USER,
            variables: {
                input: {
                    id: 456564,
                    userEmail: updateEmail,
                    password: updatePassword,
                },
            },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should delete one user', async () => {
        const users = {
            userName: 'Stu1',
            password: '123asdfgKJL$#',
            userEmail: 'test@test.org',
        };
        const val = await user_model_1.userModel.create(users);
        const DELETE_ONE_USER = graphql_tag_1.default `
      mutation usr($input: DeleteUser!) {
        deleteUser(input: $input) {
          err
          id
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_USER,
            variables: { input: { id: val._id + '' } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.deleteUser.id).toEqual(val.id);
        expect(data.deleteUser.err).toBe(0);
    });
    it('should fail to delete fictional user', async () => {
        const users = {
            userName: 'Stu1',
            password: '123asdfgKJL$#',
            userEmail: 'test@test.org',
        };
        const val = await user_model_1.userModel.create(users);
        const FAIL_DELETE_USER = graphql_tag_1.default `
      mutation usr($input: DeleteUser!) {
        deleteUser(input: $input) {
          err
          id
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: FAIL_DELETE_USER,
            variables: { input: { id: '1234' } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.deleteUser.id).not.toEqual(val.id);
        expect(data.deleteUser.err).not.toBe(0);
    });
});
//# sourceMappingURL=user.spec.js.map