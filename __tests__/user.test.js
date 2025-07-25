const request = require('supertest');
const app = require("../servers/Index");
const jwt = require('jsonwebtoken');
const db = require('../models/Index');

require("dotenv").config();

beforeAll(async () => {
	await db.sequelize.sync();
});

afterAll(async () => {
	jest.setTimeout(10000);
	await db.sequelize.close();
});

describe('unit testing for endpoint users', () => {
	it('should return a response with a success message when successful login', async () => {

		const email = "abiyu@gmail.com";
		const password = "1234567890";

		try {
			const response = await request(app)
				.post('/api/login')
				.set("Accept", "application/json")
				.send({ email: email, password: password })
				.expect(200);

			expect(response.status).toBe(200);

			expect(response.body).toMatchObject({
				status: expect.any(String),
				code: expect.any(Number),
				message: expect.any(String),
				results: expect.objectContaining({
					token: expect.any(String),
				}),
			});

			expect(response.body.status).toBe('success');

			expect(response.body.code).toBe(200);

			expect(response.body.message).toBe('message from backend');

			const decoded = jwt.verify(response.body.results.token, process.env.TOKEN_KEY);

			expect(decoded).toHaveProperty('user_id');
			expect(decoded).toHaveProperty('iat');
			expect(decoded).toHaveProperty('exp');
		} catch (error) {
			expect(error).toBe(error);
		}
	});

	it('should return a response with a error message because token is expired / token invalid', async () => {
		const mockUser = { id: 1, name: 'John Doe' };

		try {
			const expiredToken = jwt.sign({ user: mockUser }, process.env.TOKEN_KEY, { expiresIn: '1h' });

			const response = await request(app)
				.get('/products')
				.set("Accept", "application/json")
				.set('Authorization', `Bearer ${expiredToken}`)
				.expect(401);

			expect(response.status).toBe(401);

			expect(response.body).toMatchObject({
				status: expect.any(String),
				code: expect.any(Number),
				message: expect.any(String)
			});
		} catch (error) {
			expect(error).toBe(error);
		}
	});

	it('should return a response with a error message jwt when access protected route without token', async () => {
		try {
			const response = await request(app)
				.get('/api/jokosu10')
				.set("Accept", "application/json")
				.expect(401);

			expect(response.status).toBe(401);

			expect(response.body).toMatchObject({
				status: expect.any(String),
				code: expect.any(Number),
				message: expect.any(String)
			});

		} catch (error) {
			expect(error).toBe(error);
		}
	});

	it('should return a response with a success message for authenticated users when accessing a protected route', async () => {
		const mockUser = { id: 1, name: 'John Doe' };

		try {
			const testToken = jwt.sign({ user: mockUser }, process.env.TOKEN_KEY, { expiresIn: '1h' });

			const response = await request(app)
				.get('/api/jokosu10')
				.set("Accept", "application/json")
				.set('Authorization', `Bearer ${testToken}`)
				.expect(200);

			expect(response.status).toBe(200);

			expect(response.body).toMatchObject({
				status: expect.any(String),
				code: expect.any(Number),
				message: expect.any(String)
			});

		} catch (error) {
			expect(error).toBe(error);
		}
	});

	it('should respond with a success message for public route', async () => {
		try {
			const response = await request(app)
				.get('/api/test')
				.set("Accept", "application/json")
				.expect(200);

			expect(response.status).toBe(200);

			expect(response.body).toMatchObject({
				status: expect.any(String),
				code: expect.any(Number),
				message: expect.any(String)
			});

		} catch (error) {
			expect(error).toBe(error);
		}
	});
});
