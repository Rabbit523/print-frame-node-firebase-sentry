import sgMail from '@sendgrid/mail';
import config from '../../config';
import { optionModel } from './../resources/option/option.model';
import * as Sentry from '@sentry/node';

sgMail.setApiKey(config.secrets.SENDGRID_API_KEY);

/**
 *
 * @param args
 */
export const sendEmail = async (args: any) => {
  try {
    const mail = await sgMail.send(args);
    return mail;
  } catch (e) {
    console.log('Error sending Email', e);
    Sentry.captureException(e);
    return false;
  }
};

export interface IContactForm {
  name: string;
  email: string;
  category: string;
  message: string;
}
interface IForgotPass {
  userName: string;
  userEmail: string;
  resetLink: string;
}
interface INewAccount {
  firstName: string;
  userEmail: string;
}
//TODO:figure out how to attach file for invoice
interface INewOrder {
  firstName: string;
  userEmail: string;
  invoiceUrl: string;
  orderId: string;
  ImageList?: string;
}
//TODO:correct the template id
//TODO: add the right template id and emails in here

const getMasterEmail = async (): Promise<string | Error> => {
  try {
    const masterEmail = await optionModel.findOne({ optionKey: 'masterEmail' }).exec();
    if (!masterEmail) {
      Sentry.captureException('Email not Found');
      return new Error();
    } else return masterEmail.optionValue;
  } catch (e) {
    Sentry.captureException('Email not Found');
    return new Error();
  }
};
export const forgotPassword = ({ userName, userEmail, resetLink }: IForgotPass): void => {
  const params = {
    personalizations: [
      {
        to: [
          {
            email: userEmail,
          },
        ],
        subject: 'Print and Frame it Account Recovery',
      },
    ],
    from: {
      email: 'info@printandframeit.com',
      name: 'printAndFrameIt',
    },
    dynamic_template_data: {
      user: {
        userName: userName,
        passwordLink: resetLink,
      },
    },
    tracking_settings: {
      click_tracking: {
        enable: true,
      },
      open_tracking: {
        enable: true,
      },
    },
    footer: {
      enable: false,
    },
    template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
  };
  sendEmail(params);
};

export const newAccountSignUp = ({ firstName, userEmail }: INewAccount) => {
  const params = {
    personalizations: [
      {
        to: [
          {
            email: userEmail,
          },
        ],
        subject: 'Print and Frame it New Account creation',
      },
    ],
    from: {
      email: 'info@printandframeit.com',
      name: 'printAndFrameIt',
    },
    dynamic_template_data: {
      user: {
        firstName,
      },
    },
    tracking_settings: {
      click_tracking: {
        enable: true,
      },
      open_tracking: {
        enable: true,
      },
    },
    footer: {
      enable: false,
    },
    template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
  };
  sendEmail(params);
};

export const newOrderCreatedClient = ({ firstName, userEmail, invoiceUrl, orderId }: INewOrder) => {
  const params = {
    personalizations: [
      {
        to: [
          {
            email: userEmail,
          },
        ],
        subject: 'Print and Frame it New Order Created',
      },
    ],
    from: {
      email: 'info@printandframeit.com',
      name: 'printAndFrameIt',
    },
    dynamic_template_data: {
      firstName,
      orderId,
    },
    tracking_settings: {
      click_tracking: {
        enable: true,
      },
      open_tracking: {
        enable: true,
      },
    },
    attachments: [
      {
        content: invoiceUrl,
        filename: 'invoice.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
    footer: {
      enable: false,
    },
    template_id: 'd-383307ddabaf47d08d30046d13d4a9e8',
  };
  sendEmail(params);
};

export const orderShipped = ({ firstName, userEmail, invoiceUrl, orderId }: INewOrder) => {
  const params = {
    personalizations: [
      {
        to: [
          {
            email: userEmail,
          },
        ],
        subject: 'Print and Frame it New Order Created',
      },
    ],
    from: {
      email: 'info@printandframeit.com',
      name: 'printAndFrameIt',
    },
    dynamic_template_data: {
      user: {
        firstName,
        invoiceUrl,
        orderId,
      },
    },
    tracking_settings: {
      click_tracking: {
        enable: true,
      },
      open_tracking: {
        enable: true,
      },
    },
    footer: {
      enable: false,
    },
    template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
  };
  sendEmail(params);
};
interface ICancelOrder {
  firstName: string;
  userEmail: string;
  orderId: string;
}
export const cancelOrder = ({ firstName, userEmail, orderId }: ICancelOrder) => {
  const params = {
    personalizations: [
      {
        to: [
          {
            email: userEmail,
          },
        ],
        subject: 'Print and Frame it New Order Created',
      },
    ],
    from: {
      email: 'info@printandframeit.com',
      name: 'printAndFrameIt',
    },
    dynamic_template_data: {
      user: {
        firstName,
        orderId,
      },
    },
    tracking_settings: {
      click_tracking: {
        enable: true,
      },
      open_tracking: {
        enable: true,
      },
    },
    footer: {
      enable: false,
    },
    template_id: 'd-917c852d0b264f19941eb2ce7efa4a25',
  };
  sendEmail(params);
};

export const contactFormSubmission = async ({ name, email, category, message }: IContactForm): Promise<void> => {
  try {
    const masterEmail = await getMasterEmail();
    const params = {
      personalizations: [
        {
          to: [
            {
              email: masterEmail,
            },
          ],
          subject: 'Print and Frame it New Contact Form Submission',
        },
      ],
      reply_to: email,
      from: {
        email: masterEmail,
        name: 'printAndFrameIt Website',
      },
      dynamic_template_data: {
        name,
        email,
        category,
        message,
      },
      tracking_settings: {
        click_tracking: {
          enable: true,
        },
        open_tracking: {
          enable: true,
        },
      },
      footer: {
        enable: false,
      },
      template_id: 'd-b73745243c324648bd7667f29f7aee73',
    };
    sendEmail(params);
  } catch (e) {
    Sentry.captureException('master email not defined');
  }
};
export const newOrderCreatedAdmin = async ({ firstName, userEmail, invoiceUrl, orderId, ImageList }: INewOrder) => {
  try {
    const masterEmail = await getMasterEmail();
    const params = {
      personalizations: [
        {
          to: [
            {
              email: masterEmail,
            },
          ],
          subject: 'Print and Frame it New Order Created',
        },
      ],
      from: {
        email: 'info@printandframeit.com',
        name: 'printAndFrameIt',
      },
      dynamic_template_data: {
        orderId,
      },
      tracking_settings: {
        click_tracking: {
          enable: true,
        },
        open_tracking: {
          enable: true,
        },
      },
      attachments: [
        {
          content: invoiceUrl,
          filename: 'invoice.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
        {
          content: ImageList,
          filename: 'ImageList.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
      footer: {
        enable: false,
      },
      template_id: 'd-8b3c024b76b940f5807ee3e904d7c981',
    };
    sendEmail(params);
  } catch (e) {
    console.log('Email send failed', e);
  }
};
