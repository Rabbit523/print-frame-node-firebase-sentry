import { dbTools, createTestServer } from '../../../../tests';
import gql from 'graphql-tag';
import * as sendGridLib from './../../libraries/sendGrid';

describe('Misc', () => {
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
    Models: {},
  });

  it('should send contact form', async () => {
    const mock = jest.spyOn(sendGridLib, 'contactFormSubmission');
    mock.mockImplementation(() => {});
    const SEND_CONTACT_FORM = gql`
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
