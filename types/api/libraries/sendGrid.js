"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = require("@sendgrid/mail");
const config_1 = require("../../config");
mail_1.default.setApiKey(config_1.default.secrets.SENDGRID_API_KEY);
/**
 *
 * @param args
 */
exports.sendEmail = async (args) => {
    try {
        const mail = await mail_1.default.send(args);
        return mail;
    }
    catch (e) {
        console.error(e);
    }
};
//TODO:correct the template id
//TODO: add the right template id and emails in here
exports.forgotPassword = ({ userName, userEmail, resetLink }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: "Print and Frame it Account Recovery"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                userName: userName,
                passwordLink: resetLink
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    exports.sendEmail(params);
};
exports.newAccountSignUp = ({ firstName, userEmail }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: "Print and Frame it New Account creation"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                firstName
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    exports.sendEmail(params);
};
exports.newOrderCreatedClient = ({ firstName, userEmail, invoiceUrl, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: "Print and Frame it New Order Created"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                firstName,
                invoiceUrl,
                orderId
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    exports.sendEmail(params);
};
exports.orderShipped = ({ firstName, userEmail, invoiceUrl, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: "Print and Frame it New Order Created"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                firstName,
                invoiceUrl,
                orderId
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    exports.sendEmail(params);
};
exports.cancelOrder = ({ firstName, userEmail, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: "Print and Frame it New Order Created"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                firstName,
                orderId
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    exports.sendEmail(params);
};
exports.contactFormSubmission = ({ name, email, category, message }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: email
                    }
                ],
                subject: "Print and Frame it New Order Created"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                name,
                category,
                message
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    // sendEmail(params);
};
exports.newOrderCreatedAdmin = ({ firstName, userEmail, invoiceUrl, orderId }) => {
    const params = {
        personalizations: [
            {
                to: [
                    {
                        email: userEmail
                    }
                ],
                subject: "Print and Frame it New Order Created"
            }
        ],
        from: {
            email: "info@printandframeit.com",
            name: "printAndFrameIt"
        },
        dynamic_template_data: {
            user: {
                firstName,
                invoiceUrl,
                orderId
            }
        },
        tracking_settings: {
            click_tracking: {
                enable: true
            },
            open_tracking: {
                enable: true
            }
        },
        footer: {
            enable: false
        },
        template_id: "d-917c852d0b264f19941eb2ce7efa4a25"
    };
    exports.sendEmail(params);
};
//# sourceMappingURL=sendGrid.js.map