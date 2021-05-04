"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = require("./product.model");
const tests_1 = require("../../../../tests");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
describe('Product', () => {
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
        Models: { productModel: product_model_1.productModel },
    });
    it('should get all', async () => {
        const products = [
            {
                productName: 'Fancy Brown Frame',
                productSku: '200',
                uri: 'fancy-brown',
                productDescription: 'This is a fancy brown frame ',
                Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                images: [
                    {
                        imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                    },
                    {
                        imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                    },
                ],
                sizes: [
                    {
                        width: 20,
                        height: 24,
                        price: 60,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 16,
                        height: 20,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 18,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 16,
                        price: 40,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 14,
                        price: 35,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 11,
                        height: 14,
                        price: 25,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 8,
                        height: 10,
                        price: 15,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                ],
            },
            {
                productName: 'Fancy Black Frame',
                productSku: '300',
                uri: 'fancy-black',
                productDescription: 'This is a fancy black frame ',
                Thumbnail: 'printAndFrameIt/Frames/Black_white.jpg',
                images: [
                    {
                        imageUrl: 'printAndFrameIt/Frames/Black_white.jpg',
                    },
                    {
                        imageUrl: 'printAndFrameIt/Frames/fancy_black_pedestal_t0y3c0.jpg',
                    },
                ],
                sizes: [
                    {
                        width: 20,
                        height: 24,
                        price: 60,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 16,
                        height: 20,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 18,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 16,
                        price: 40,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 14,
                        price: 35,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 11,
                        height: 14,
                        price: 25,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 8,
                        height: 10,
                        price: 15,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                ],
            },
            {
                productName: 'Rustic Brown Frame',
                productSku: '400',
                uri: 'rustic-brown',
                productDescription: 'This is a rustic brown frame ',
                Thumbnail: 'printAndFrameIt/Frames/rustic_brown_WB_r966jd.jpg',
                images: [
                    {
                        imageUrl: 'printAndFrameIt/Frames/rustic_brown_WB_r966jd.jpg',
                    },
                    {
                        imageUrl: 'printAndFrameIt/Frames/rustic_brown_bench_yj5hro.jpg',
                    },
                ],
                sizes: [
                    {
                        width: 20,
                        height: 24,
                        price: 60,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 16,
                        height: 20,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 18,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 16,
                        price: 40,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 14,
                        price: 35,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 11,
                        height: 14,
                        price: 25,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 8,
                        height: 10,
                        price: 15,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                ],
            },
            {
                productName: 'Rustic Gray Frame',
                productSku: '500',
                uri: 'rustic-gray',
                productDescription: 'This is a rustic gray frame ',
                Thumbnail: 'printAndFrameIt/Frames/rustuc_grey_WB_jb3uas.jpg',
                images: [
                    {
                        imageUrl: 'printAndFrameIt/Frames/rustuc_grey_WB_jb3uas.jpg',
                    },
                    {
                        imageUrl: 'printAndFrameIt/Frames/rustic_white_bench_kojmla.jpg',
                    },
                ],
                sizes: [
                    {
                        width: 20,
                        height: 24,
                        price: 60,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 16,
                        height: 20,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 18,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 16,
                        price: 40,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 14,
                        price: 35,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 11,
                        height: 14,
                        price: 25,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 8,
                        height: 10,
                        price: 15,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                ],
            },
            {
                productName: 'Plain Black Frame',
                productSku: '600',
                uri: 'plain-black',
                productDescription: 'This is a plain black frame ',
                Thumbnail: 'printAndFrameIt/Frames/plain_black_WB_upnsgx.jpg',
                images: [
                    {
                        imageUrl: 'printAndFrameIt/Frames/plain_black_WB_upnsgx.jpg',
                    },
                    {
                        imageUrl: 'printAndFrameIt/Frames/simple_black_pedestal_apah0f.jpg',
                    },
                ],
                sizes: [
                    {
                        width: 20,
                        height: 24,
                        price: 60,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 16,
                        height: 20,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 18,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 16,
                        price: 40,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 14,
                        price: 35,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 11,
                        height: 14,
                        price: 25,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 8,
                        height: 10,
                        price: 15,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                ],
            },
            {
                productName: 'Plain white Frame',
                productSku: '700',
                uri: 'plain-white',
                productDescription: 'This is a plain white frame ',
                Thumbnail: 'printAndFrameIt/Frames/plain_white_BB_otjr8g.jpg',
                images: [
                    {
                        imageUrl: 'printAndFrameIt/Frames/plain_white_BB_otjr8g.jpg',
                    },
                    {
                        imageUrl: 'printAndFrameIt/Frames/pain_white_pedestal_hh1g1k.jpg',
                    },
                ],
                sizes: [
                    {
                        width: 20,
                        height: 24,
                        price: 60,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 24,
                        price: 50,
                        shippingWidth: 24,
                        shippingHeight: 30,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 16,
                        height: 20,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 18,
                        price: 45,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 12,
                        height: 16,
                        price: 40,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 14,
                        height: 14,
                        price: 35,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 11,
                        height: 14,
                        price: 25,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                    {
                        width: 8,
                        height: 10,
                        price: 15,
                        shippingWidth: 24,
                        shippingHeight: 18,
                        shippingLength: 5,
                        shippingWeight: 8,
                    },
                ],
            },
        ];
        await product_model_1.productModel.create(products);
        const GET_ALL_PRODUCTS = graphql_tag_1.default `
      {
        getAllProducts(input: { offset: 0, limit: 10 }) {
          total
          products {
            productDescription
            productName
            productSku
            Thumbnail
            uri
            images {
              imageUrl
            }
            sizes {
              width
              height
              price
              shippingWidth
              shippingHeight
              shippingLength
              shippingWeight
            }
          }
        }
      }
    `;
        const { data, errors } = await query({ query: GET_ALL_PRODUCTS });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getAllProducts.products).toEqual(expect.arrayContaining(products));
    });
    it('should create one product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const CREATE_ONE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: [NewProduct!]) {
        createProduct(input: $input) {
          productDescription
          productName
          productSku
          Thumbnail
          uri
          images {
            imageUrl
          }
          sizes {
            width
            height
            price
            shippingWidth
            shippingHeight
            shippingLength
            shippingWeight
          }
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_PRODUCT,
            variables: {
                input: product,
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.createProduct).toEqual(expect.arrayContaining([product]));
    });
    it('should get one', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const GET_ONE_PRODUCT = graphql_tag_1.default `
      query usr($input: ProductIdInput!) {
        getProduct(input: $input) {
          productName
          Thumbnail
          productSku
          productDescription
          uri
          images {
            imageUrl
          }
          sizes {
            width
            height
            price
            shippingWidth
            shippingHeight
            shippingLength
            shippingWeight
          }
        }
      }
    `;
        const { data, errors } = await query({
            query: GET_ONE_PRODUCT,
            variables: { input: { id: val.id } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.getProduct).toEqual(product);
    });
    it('should update one product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const updatedSize = [
            {
                width: 20,
                height: 24,
                price: 80,
                shippingWidth: 24,
                shippingHeight: 30,
                shippingLength: 80,
                shippingWeight: 8,
            },
            {
                width: 14,
                height: 24,
                price: 50,
                shippingWidth: 24,
                shippingHeight: 30,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 12,
                height: 24,
                price: 50,
                shippingWidth: 24,
                shippingHeight: 30,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 16,
                height: 20,
                price: 45,
                shippingWidth: 24,
                shippingHeight: 18,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 14,
                height: 18,
                price: 45,
                shippingWidth: 24,
                shippingHeight: 18,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 12,
                height: 16,
                price: 40,
                shippingWidth: 24,
                shippingHeight: 18,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 14,
                height: 14,
                price: 35,
                shippingWidth: 24,
                shippingHeight: 18,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 11,
                height: 14,
                price: 25,
                shippingWidth: 24,
                shippingHeight: 18,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 8,
                height: 10,
                price: 15,
                shippingWidth: 24,
                shippingHeight: 18,
                shippingLength: 5,
                shippingWeight: 8,
            },
        ];
        const updateName = 'NameUpdated';
        const updateDescription = 'updated';
        const UPDATE_ONE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: UpdateProduct!) {
        updateProduct(input: $input) {
          productName
          productDescription
          images {
            imageUrl
          }
          sizes {
            width
            height
            price
            shippingWidth
            shippingHeight
            shippingLength
            shippingWeight
          }
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: UPDATE_ONE_PRODUCT,
            variables: {
                input: {
                    id: val.id,
                    productName: updateName,
                    productDescription: updateDescription,
                    sizes: [
                        {
                            id: val.sizes[0].id,
                            width: 20,
                            height: 24,
                            price: 80,
                            shippingWidth: 24,
                            shippingHeight: 30,
                            shippingLength: 80,
                            shippingWeight: 8,
                        },
                    ],
                },
            },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.updateProduct.productName).toEqual(updateName);
        expect(data.updateProduct.productDescription).toEqual(updateDescription);
        expect(data.updateProduct.sizes).toEqual(expect.arrayContaining(updatedSize));
    });
    it('should fail to  update one product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const updateName = 'NameUpdated';
        const updateDescription = 'updated';
        const FAIL_UPDATE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: UpdateProduct!) {
        updateProduct(input: $input) {
          productName
          productDescription
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: FAIL_UPDATE_PRODUCT,
            variables: {
                input: {
                    id: val.id + '456',
                    productName: updateName,
                    productDescription: updateDescription,
                },
            },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should delete one product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const DELETE_ONE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: DeleteProduct!) {
        deleteProduct(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: DELETE_ONE_PRODUCT,
            variables: { input: { id: val._id + '' } },
        });
        expect(errors).toBeUndefined();
        expect(data).tobeobject;
        expect(data.deleteProduct).toEqual(true);
    });
    it('should fail to delete one product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const FAIL_DELETE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: DeleteProduct!) {
        deleteProduct(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: FAIL_DELETE_PRODUCT,
            variables: { input: { id: val.id + 'i234' } },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it('should fail to create product with duplicate size', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 20,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const FAIL_DELETE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: DeleteProduct!) {
        deleteProduct(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: FAIL_DELETE_PRODUCT,
            variables: { input: { id: val.id + 'i234' } },
        });
        expect(data).tobeNull;
        expect(errors).toBeDefined();
    });
    it('should fail to delete one product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 16,
                    height: 20,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 18,
                    price: 45,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 12,
                    height: 16,
                    price: 40,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 14,
                    height: 14,
                    price: 35,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 11,
                    height: 14,
                    price: 25,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 8,
                    height: 10,
                    price: 15,
                    shippingWidth: 24,
                    shippingHeight: 18,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const val = await product_model_1.productModel.create(product);
        const FAIL_DELETE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: DeleteProduct!) {
        deleteProduct(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: FAIL_DELETE_PRODUCT,
            variables: { input: { id: val.id + 'i234' } },
        });
        expect(errors).toBeDefined();
        expect(data).tobeNull;
    });
    it.skip('should fail to create one product with duplicate sizes', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 20,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
                {
                    width: 20,
                    height: 24,
                    price: 50,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const CREATE_ONE_PRODUCT = graphql_tag_1.default `
      mutation usr($input: [NewProduct!]) {
        createProduct(input: $input) {
          productDescription
          productName
          productSku
          Thumbnail
          uri
          images {
            imageUrl
          }
          sizes {
            width
            height
            price
            shippingWidth
            shippingHeight
            shippingLength
            shippingWeight
          }
        }
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_PRODUCT,
            variables: {
                input: [product],
            },
        });
        tests_1.logger(data);
        expect(errors).not.toBeNull();
        expect(data).toBeNull();
    });
    it('should add one size to product', async () => {
        const product = {
            productName: 'Fancy Brown Frame',
            productSku: '200',
            uri: 'fancy-brown',
            productDescription: 'This is a fancy brown frame ',
            Thumbnail: 'printAndFrameIt/Frames/Brown_white_1.jpg',
            images: [
                {
                    imageUrl: 'printAndFrameIt/Frames/Brown_white_1.jpg',
                },
                {
                    imageUrl: '/printAndFrameIt/Frames/fancy_brown_pedestal_gddbzn.jpg',
                },
            ],
            sizes: [
                {
                    width: 20,
                    height: 24,
                    price: 60,
                    shippingWidth: 24,
                    shippingHeight: 30,
                    shippingLength: 5,
                    shippingWeight: 8,
                },
            ],
        };
        const newSize = [
            {
                width: 40,
                height: 34,
                price: 60,
                shippingWidth: 24,
                shippingHeight: 30,
                shippingLength: 5,
                shippingWeight: 8,
            },
            {
                width: 90,
                height: 34,
                price: 60,
                shippingWidth: 24,
                shippingHeight: 30,
                shippingLength: 5,
                shippingWeight: 8,
            },
        ];
        const res = await product_model_1.productModel.create(product);
        const CREATE_ONE_PRODUCT_SIZE = graphql_tag_1.default `
      mutation usr($input: CreateProductSizeInput!) {
        createProductSizes(input: $input)
      }
    `;
        const { data, errors } = await mutate({
            mutation: CREATE_ONE_PRODUCT_SIZE,
            variables: {
                input: {
                    id: res.id + '',
                    sizes: newSize,
                },
            },
        });
        expect(errors).toBeUndefined();
        expect(data.createProductSizes).toEqual(true);
    });
});
//# sourceMappingURL=product.spec.js.map