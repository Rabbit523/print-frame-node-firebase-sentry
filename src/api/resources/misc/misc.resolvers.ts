import sanitizeHtml from 'sanitize-html';
import { IContactForm, contactFormSubmission } from './../../libraries/sendGrid';

const sendContactForm = async (source: any, { input }: { input: IContactForm }) => {
  Object.keys(input).map(key => {
    input[key] = sanitizeHtml(input[key]);
  });

  contactFormSubmission(input);
  return true;
};
export const miscResolvers = {
  Mutation: {
    sendContactForm,
  },
};
