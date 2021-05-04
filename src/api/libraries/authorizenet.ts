const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
import { IAcceptPaymentConfig, IItem } from './../generalInterfaces';
import * as Sentry from '@sentry/browser';
export const createAnAcceptPaymentTransaction = (config: IAcceptPaymentConfig) => {
  return new Promise((resolve, reject) => {
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.AUTHORIZE_NET_ID);
    merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_NET_TRANSACTION);

    const opaqueData = new ApiContracts.OpaqueDataType();
    opaqueData.setDataDescriptor('COMMON.ACCEPT.INAPP.PAYMENT');
    opaqueData.setDataValue(config.token);

    const paymentType = new ApiContracts.PaymentType();
    paymentType.setOpaqueData(opaqueData);

    const orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber(config.invoiceNumber);
    orderDetails.setDescription(config.generalProductDescription);

    const tax = new ApiContracts.ExtendedAmountType();
    tax.setAmount(config.taxAmount);
    tax.setName(config.taxName);
    tax.setDescription(config.taxDescription);

    const shipping = new ApiContracts.ExtendedAmountType();
    shipping.setAmount(config.shippingAmount);
    shipping.setName(config.shippingService);
    shipping.setDescription(config.shippingDescription);

    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(config.billingAddress.name);
    billTo.setAddress(
      config.billingAddress.street1 + (config.billingAddress.street2 ? ' ' + config.billingAddress.street2 : ''),
    );

    billTo.setCity(config.billingAddress.city);
    billTo.setState(config.billingAddress.state);
    billTo.setZip(config.billingAddress.zip);
    billTo.setCountry(config.billingAddress.country);
    config.billingAddress.phone ? billTo.setPhoneNumber(config.billingAddress.phone) : null;

    const shipTo = new ApiContracts.CustomerAddressType();
    shipTo.setFirstName(config.shippingAddress.name);
    shipTo.setAddress(
      config.shippingAddress.street1 + (config.shippingAddress.street2 ? ' ' + config.shippingAddress.street2 : ''),
    );
    shipTo.setCity(config.shippingAddress.city);
    shipTo.setState(config.shippingAddress.state);
    shipTo.setZip(config.shippingAddress.zip);
    shipTo.setCountry(config.shippingAddress.country);

    const lineItemList: IItem[] = [];

    config.items.forEach((item: IItem) => {
      const lineItem = new ApiContracts.LineItemType();
      lineItem.setItemId(item.id);
      lineItem.setName(item.name);
      lineItem.setDescription(item.description);
      lineItem.setQuantity(item.quantity);
      lineItem.setUnitPrice(item.unitPrice);

      lineItemList.push(lineItem);
    });

    const lineItems = new ApiContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    const userField_a = new ApiContracts.UserField();
    userField_a.setName('customer message');
    userField_a.setValue(config.customerMessage);

    const userFieldList: any = [];
    userFieldList.push(userField_a);

    const userFields = new ApiContracts.TransactionRequestType.UserFields();
    userFields.setUserField(userFieldList);

    const transactionSetting1 = new ApiContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    const transactionSetting2 = new ApiContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    const transactionSettingList: any = [];
    transactionSettingList.push(transactionSetting1);
    transactionSettingList.push(transactionSetting2);

    const transactionSettings = new ApiContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);

    const transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(config.total);
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setUserFields(userFields);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setTax(tax);
    transactionRequestType.setShipping(shipping);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setShipTo(shipTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    const createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    //pretty print request
    // Sentry.captureException(JSON.stringify(createRequest.getJSON(), null, 2));

    const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

    //TODO:change this to production
    //Defaults to sandbox
    if (process.env.NODE_ENV === 'production') {
      // ctrl.setEnvironment(SDKConstants.endpoint.production);
    }

    ctrl.execute(function() {
      const apiResponse = ctrl.getResponse();

      const response = new ApiContracts.CreateTransactionResponse(apiResponse);

      //pretty print response
      Sentry.captureException(JSON.stringify(response, null, 2));

      if (response != null) {
        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
          if (response.getTransactionResponse().getMessages() != null) {
            Sentry.captureException(
              'Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId(),
            );
            Sentry.captureException('Response Code: ' + response.getTransactionResponse().getResponseCode());
            Sentry.captureException(
              'Message Code: ' +
                response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getCode(),
            );
            Sentry.captureException(
              'Description: ' +
                response
                  .getTransactionResponse()
                  .getMessages()
                  .getMessage()[0]
                  .getDescription(),
            );
          } else {
            if (response.getTransactionResponse().getErrors() != null) {
              reject(
                'Error message: ' +
                  response
                    .getTransactionResponse()
                    .getErrors()
                    .getError()[0]
                    .getErrorText(),
              );
            }
          }
        } else {
          if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
            reject(
              'Error Code: ' +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode(),
            );
          } else {
            reject(
              'Error Code: ' +
                response
                  .getMessages()
                  .getMessage()[0]
                  .getCode(),
            );
          }
        }
      } else {
        reject('Null Response.');
      }

      resolve(response);
    });
  });
};

// const paymenObj: IAcceptPaymentConfig = {
//   token:
//     "eyJjb2RlIjoiNTBfMl8wNjAwMDUzODdGODg5M0I5NzlDN0Y0MzZBOUE4MThFMUY0RTNERjMzOTFBNkJEQjU3RkVCRDc4QjNFMEI1ODdDOTk3NTMzOEQxMTI1RjVERTYxRjgxRDhDRUVENzQwQ0FEMUMxQTQ4IiwidG9rZW4iOiI5NTc1NDMwOTAxMDQ0ODcyOTAzNjAxIiwidiI6IjEuMSJ9",
//   invoiceNumber: "dsaf",
//   generalProductDescription: "dsaf",
//   taxAmount: 123,
//   taxName: "ca tax",
//   taxDescription: "pay it",
//   shippingAmount: 14,
//   shippingService: "fex",
//   shippingDescription: "nac",
//   billingAddress: {
//     name: "otherHamid",
//     street1: "68207 verano pl",
//     city: "irvine",
//     state: "ca",
//     country: "usa",
//     zip: "92612",
//     phone: "949-389-7692"
//   },
//   shippingAddress: {
//     name: "otherHamid",
//     street1: "68207 verano pl",
//     city: "irvine",
//     state: "ca",
//     country: "usa",
//     zip: "92612",
//     phone: "949-389-7692"
//   },
//   customerMessage: "test message",
//   items: [
//     {
//       id: "1234",
//       name: "testItem",
//       description: "This is a test item",
//       quantity: 3,
//       unitPrice: 4.33
//     }
//   ],
//   total: 134,
// };

// const test = async () => {
//   try {
//     const val = await createAnAcceptPaymentTransaction(paymenObj);
//     Sentry.captureException("response is");
//     Sentry.captureException(JSON.stringify(val));
//   } catch (e) {
//     Sentry.captureException("There is an error");
//     Sentry.captureException(e);
//     Sentry.captureException(JSON.stringify(e));
//   }
// };
// test();
