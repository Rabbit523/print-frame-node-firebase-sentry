"use strict";
if (process.env.NODE_ENV !== "test") {
    const path = require("path");
    const pdfMakePrinter = require("pdfmake/src/printer");
    const fs = require("fs");
    const JsBarcode = require("jsbarcode");
    const { createCanvas, loadImage } = require("canvas");
    // https://gist.github.com/maxkostinevich/c26bfb09450341ad37c1bd6c2cc51bb2
    // Invoice markup
    // Author: Max Kostinevich
    // BETA (no styles)
    // http://pdfmake.org/playground.html
    // playground requires you to assign document definition to a variable called dd
    // CodeSandbox Example: https://codesandbox.io/s/pdfmake-invoice-oj81y
    function makePdf() {
        const fonts = {
            Roboto: {
                normal: path.join(__dirname, "/fonts/Roboto-Regular.ttf"),
                bold: path.join(__dirname, "/fonts/Roboto-Medium.ttf"),
                italics: path.join(__dirname, "/fonts/Roboto-Italic.ttf"),
                bolditalics: path.join(__dirname, "/fonts/Roboto-MediumItalic.ttf")
            }
        };
        const printer = new pdfMakePrinter(fonts);
        const doc = printer.createPdfKitDocument(generateInvoiceTemplate());
        doc.end();
        doc.pipe(fs.createWriteStream("newInvoice.pdf"));
        const second = printer.createPdfKitDocument(generatePictureList());
        second.end();
        second.pipe(fs.createWriteStream("pictures.pdf"));
    }
    function generateInvoiceTemplate() {
        const canvas = createCanvas(200, 200);
        JsBarcode(canvas, 15654647);
        const barcodeImg = canvas.toDataURL("image/png");
        return {
            content: [
                {
                    columns: [
                        {
                            image: path.resolve(__dirname, "./fonts/logo.jpg"),
                            width: 100
                        },
                        [
                            {
                                text: "Receipt",
                                color: "#333333",
                                width: "*",
                                fontSize: 28,
                                bold: true,
                                alignment: "right",
                                margin: [0, 0, 0, 15]
                            },
                            {
                                stack: [
                                    {
                                        columns: [
                                            {
                                                text: "Order No.",
                                                color: "#aaaaab",
                                                bold: true,
                                                width: "*",
                                                fontSize: 12,
                                                alignment: "right"
                                            },
                                            {
                                                text: "00001",
                                                bold: true,
                                                color: "#333333",
                                                fontSize: 12,
                                                alignment: "right",
                                                width: 100
                                            }
                                        ]
                                    },
                                    {
                                        columns: [
                                            {
                                                text: "Date Issued",
                                                color: "#aaaaab",
                                                bold: true,
                                                width: "*",
                                                fontSize: 12,
                                                alignment: "right"
                                            },
                                            {
                                                text: "June 01, 2016",
                                                bold: true,
                                                color: "#333333",
                                                fontSize: 12,
                                                alignment: "right",
                                                width: 100
                                            }
                                        ]
                                    },
                                    {
                                        columns: [
                                            {
                                                text: "Status",
                                                color: "#aaaaab",
                                                bold: true,
                                                fontSize: 12,
                                                alignment: "right",
                                                width: "*"
                                            },
                                            {
                                                text: "PAID",
                                                bold: true,
                                                fontSize: 14,
                                                alignment: "right",
                                                color: "green",
                                                width: 100
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    ]
                },
                {
                    columns: [
                        {
                            text: "To",
                            color: "#aaaaab",
                            bold: true,
                            fontSize: 14,
                            alignment: "left",
                            margin: [0, 20, 0, 5]
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: "Client Name \n Client Company",
                            bold: true,
                            color: "#333333",
                            alignment: "left"
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: "Address",
                            color: "#aaaaab",
                            bold: true,
                            margin: [0, 7, 0, 3]
                        }
                    ]
                },
                {
                    columns: [
                        {
                            text: "Plaza Bonita Rd #2070, \n National City, CA 91950 \n   USA  800-XXXX",
                            style: "invoiceBillingAddress"
                        }
                    ]
                },
                "\n\n",
                {
                    layout: {
                        defaultBorder: false,
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            if (i === 1 || i === 0) {
                                return "#bfdde8";
                            }
                            return "#eaeaea";
                        },
                        vLineColor: function (i, node) {
                            return "#eaeaea";
                        },
                        hLineStyle: function (i, node) {
                            // if (i === 0 || i === node.table.body.length) {
                            return null;
                            //}
                        },
                        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                        paddingLeft: function (i, node) {
                            return 10;
                        },
                        paddingRight: function (i, node) {
                            return 10;
                        },
                        paddingTop: function (i, node) {
                            return 2;
                        },
                        paddingBottom: function (i, node) {
                            return 2;
                        },
                        fillColor: function (rowIndex, node, columnIndex) {
                            return "#fff";
                        }
                    },
                    table: {
                        headerRows: 1,
                        widths: ["*", 80],
                        body: [
                            [
                                {
                                    text: "ITEM DESCRIPTION",
                                    fillColor: "#eaf2f5",
                                    border: [false, true, false, true],
                                    margin: [0, 5, 0, 5],
                                    textTransform: "uppercase"
                                },
                                {
                                    text: "ITEM TOTAL",
                                    border: [false, true, false, true],
                                    alignment: "right",
                                    fillColor: "#eaf2f5",
                                    margin: [0, 5, 0, 5],
                                    textTransform: "uppercase"
                                }
                            ],
                            [
                                {
                                    text: "Item 1",
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: "left"
                                },
                                {
                                    border: [false, false, false, true],
                                    text: "$999.99",
                                    fillColor: "#f5f5f5",
                                    alignment: "right",
                                    margin: [0, 5, 0, 5]
                                }
                            ],
                            [
                                {
                                    text: "Item 2",
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: "left"
                                },
                                {
                                    text: "$999.99",
                                    border: [false, false, false, true],
                                    fillColor: "#f5f5f5",
                                    alignment: "right",
                                    margin: [0, 5, 0, 5]
                                }
                            ],
                            [
                                {
                                    text: "Item 2",
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5],
                                    alignment: "left"
                                },
                                {
                                    text: "$999.99",
                                    border: [false, false, false, true],
                                    fillColor: "#f5f5f5",
                                    alignment: "right",
                                    margin: [0, 5, 0, 5]
                                }
                            ]
                        ]
                    }
                },
                "\n",
                "\n\n",
                {
                    layout: {
                        defaultBorder: false,
                        hLineWidth: function (i, node) {
                            return 1;
                        },
                        vLineWidth: function (i, node) {
                            return 1;
                        },
                        hLineColor: function (i, node) {
                            return "#eaeaea";
                        },
                        vLineColor: function (i, node) {
                            return "#eaeaea";
                        },
                        hLineStyle: function (i, node) {
                            // if (i === 0 || i === node.table.body.length) {
                            return null;
                            //}
                        },
                        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                        paddingLeft: function (i, node) {
                            return 10;
                        },
                        paddingRight: function (i, node) {
                            return 10;
                        },
                        paddingTop: function (i, node) {
                            return 3;
                        },
                        paddingBottom: function (i, node) {
                            return 3;
                        },
                        fillColor: function (rowIndex, node, columnIndex) {
                            return "#fff";
                        }
                    },
                    table: {
                        headerRows: 1,
                        widths: ["*", "auto"],
                        body: [
                            [
                                {
                                    text: "Payment Subtotal",
                                    border: [false, true, false, true],
                                    alignment: "right",
                                    margin: [0, 5, 0, 5]
                                },
                                {
                                    border: [false, true, false, true],
                                    text: "$999.99",
                                    alignment: "right",
                                    fillColor: "#f5f5f5",
                                    margin: [0, 5, 0, 5]
                                }
                            ],
                            [
                                {
                                    text: "Payment Processing Fee",
                                    border: [false, false, false, true],
                                    alignment: "right",
                                    margin: [0, 5, 0, 5]
                                },
                                {
                                    text: "$999.99",
                                    border: [false, false, false, true],
                                    fillColor: "#f5f5f5",
                                    alignment: "right",
                                    margin: [0, 5, 0, 5]
                                }
                            ],
                            [
                                {
                                    text: "Total Amount",
                                    bold: true,
                                    fontSize: 20,
                                    alignment: "right",
                                    border: [false, false, false, true],
                                    margin: [0, 5, 0, 5]
                                },
                                {
                                    text: "USD $999.99",
                                    bold: true,
                                    fontSize: 20,
                                    alignment: "right",
                                    border: [false, false, false, true],
                                    fillColor: "#f5f5f5",
                                    margin: [0, 5, 0, 5]
                                }
                            ]
                        ]
                    }
                },
                "\n\n",
                {
                    text: "NOTES",
                    style: "notesTitle"
                },
                {
                    text: "Some notes goes here \n Notes second line",
                    style: "notesText"
                },
                {
                    image: barcodeImg,
                    alignment: "center",
                    width: 200
                }
            ],
            styles: {
                // Document Header
                documentHeaderLeft: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: "left"
                },
                documentHeaderCenter: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: "center"
                },
                documentHeaderRight: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: "right"
                },
                // Document Footer
                documentFooterLeft: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: "left"
                },
                documentFooterCenter: {
                    fontSize: 10,
                    margin: [5, 5, 5, 50],
                    alignment: "center"
                },
                documentFooterRight: {
                    fontSize: 10,
                    margin: [5, 5, 5, 5],
                    alignment: "right"
                },
                // Invoice Title
                invoiceTitle: {
                    fontSize: 22,
                    bold: true,
                    alignment: "right",
                    margin: [0, 0, 0, 15]
                },
                // Invoice Details
                invoiceSubTitle: {
                    fontSize: 12,
                    alignment: "right"
                },
                invoiceSubValue: {
                    fontSize: 12,
                    alignment: "right"
                },
                // Billing Headers
                invoiceBillingTitle: {
                    fontSize: 14,
                    bold: true,
                    alignment: "left",
                    margin: [0, 20, 0, 5]
                },
                // Billing Details
                invoiceBillingDetails: {
                    alignment: "left"
                },
                invoiceBillingAddressTitle: {
                    margin: [0, 7, 0, 3],
                    bold: true
                },
                invoiceBillingAddress: {},
                // Items Header
                itemsHeader: {
                    margin: [0, 5, 0, 5],
                    bold: true
                },
                // Item Title
                itemTitle: {
                    bold: true
                },
                itemSubTitle: {
                    italics: true,
                    fontSize: 11
                },
                itemNumber: {
                    margin: [0, 5, 0, 5],
                    alignment: "center"
                },
                itemTotal: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: "center"
                },
                // Items Footer (Subtotal, Total, Tax, etc)
                itemsFooterSubTitle: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: "right"
                },
                itemsFooterSubValue: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: "center"
                },
                itemsFooterTotalTitle: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: "right"
                },
                itemsFooterTotalValue: {
                    margin: [0, 5, 0, 5],
                    bold: true,
                    alignment: "center"
                },
                signaturePlaceholder: {
                    margin: [0, 70, 0, 0]
                },
                signatureName: {
                    bold: true,
                    alignment: "center"
                },
                signatureJobTitle: {
                    italics: true,
                    fontSize: 10,
                    alignment: "center"
                },
                notesTitle: {
                    fontSize: 10,
                    bold: true,
                    margin: [0, 50, 0, 3]
                },
                notesText: {
                    fontSize: 10
                },
                center: {
                    alignment: "center"
                }
            },
            defaultStyle: {
                columnGap: 20
            }
        };
    }
    function generatePictureList() {
        let imgArray = [];
        for (let i = 0; i < 3; i++) {
            let temp = {};
            temp.columns = [];
            for (let j = 0; j < 3; j++) {
                let img = [
                    {
                        image: path.resolve(__dirname, "./fonts/logo.jpg"),
                        width: 150,
                        margin: [0, 5, 0, 5]
                    },
                    {
                        text: Number(i) + Number(j),
                        alignment: "center"
                    }
                ];
                temp.columns.push(img);
            }
            // console.log(JSON.stringify(imgArray, null, 4));
            imgArray.push({ columns: temp.columns });
            imgArray.push({ text: "\n\n" });
        }
        // console.log(JSON.stringify(imgArray, null, 4));
        const canvas = createCanvas(200, 200);
        JsBarcode(canvas, 15654647);
        const barcodeImg = canvas.toDataURL("image/png");
        const list = {
            content: [
                {
                    image: barcodeImg,
                    alignment: "center",
                    width: 200
                },
                ...imgArray
            ]
        };
        // console.log(JSON.stringify(list, null, 4));
        return list;
    }
    makePdf();
    generatePictureList();
}
//# sourceMappingURL=pdfGenerator.js.map