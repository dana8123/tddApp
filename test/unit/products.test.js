const productController = require("../../controller");
const productModel = require("../../models/product");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();

const productId = "542121543dfsdf";

let req, res, next;
beforeEach(() => {
	req = httpMocks.createRequest();
	res = httpMocks.createResponse();
	next = jest.fn();
});

describe("product controller create", () => {
	beforeEach(() => {
		req.body = newProduct;
	});
	"should have a createProduct function",
		() => {
			expect(typeof productController.createProduct).toBe("function");
		};

	it("should call productModel.create", () => {
		productController.createProduct(req, res, next);
		expect(productModel.create).toBeCalledWith(newProduct);
	});

	it("should return 201 response code", async () => {
		await productController.createProduct(req, res, next);
		expect(res.statusCode).toBe(201);
		expect(res._isEndCalled()).toBeTruthy();
	});

	it("should return json body in response", async () => {
		productModel.create.mockReturnValue(newProduct);
		await productController.createProduct(req, res, next);
		expect(res._getJSONData()).toStrictEqual(newProduct);
	});

	it("should handle errors", async () => {
		const errorMessage = { message: "description property missing" };
		const rejectPromise = Promise.reject(errorMessage);
		productModel.create.mockReturnValue(rejectPromise);
		await productController.createProduct(req, res, next);
		expect(next).toBeCalledWith(errorMessage);
	});
});

describe("Product Controller Get", () => {
	it("should have a getProducts function", () => {
		expect(typeof productController.getProducts).toBe("function");
	});

	it("should call productModel.find({})", async () => {
		await productController.getProducts(req, res, next);
		expect(productModel.find).toHaveBeenCalledWith({});
	});

	it("should return 200 status code", async () => {
		await productController.getProducts(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled).toBeTruthy();
	});

	it("should return json body in response", async () => {
		productModel.find.mockReturnValue(allProducts);
		await productController.getProducts(req, res, next);
		expect(res._getJSONData()).toStrictEqual(allProducts);
	});

	it("should handle error", async () => {
		const errorMessage = { message: "Error finding product data" };
		const rejectedPromise = Promise.reject(errorMessage);
		productModel.find.mockReturnValue(rejectedPromise);
		await productController.getProducts(req, res, next);
		expect(next).toHaveBeenCalledWith(errorMessage);
	});
});

describe("Product controller GetById", () => {
	it("should have a getProductById", () => {
		expect(typeof productController.getProductById).toBe("function");
	});
	it("should call productModle.findById", async () => {
		req.params.productId = productId;
		await productController.getProductById(req, res, next);
		expect(productModel.findById).toBeCalledWith(productId);
	});
	it("should return json body and response code 200", async () => {
		productModel.findById.mockReturnValue(newProduct);
		await productController.getProductById(req, res, next);
		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toStrictEqual(newProduct);
		expect(res._isEndCalled()).toBeTruthy();
	});

	it("should return 404 when item doesn't exist", async () => {
		productModel.findById.mockReturnValue(null);
		await productController.getProductById(req, res, next);
		expect(res.statusCode).toBe(404);
		expect(res._isEndCalled()).toBeTruthy();
	});

	it("should handle error", async () => {
		const errorMessage = { message: "error" };
		const rejectPromise = Promise.reject(errorMessage);
		productModel.findById.mockReturnValue(rejectPromise);
		await productController.getProductById(req, res, next);
		expect(next).toHaveBeenCalledWith(errorMessage);
	});
});
