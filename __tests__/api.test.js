const request = require("supertest");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const endpointData = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET: 200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("when given incorrect api endpoint, will respond with a 404 error and message of route not found", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api", () => {
  test("GET 200, responds with an object describing the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const endpoints = res.body.endpointData;
        expect(endpoints).toEqual(endpointData);
        for (const key in endpoints) {
          expect(endpoints[key]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            exampleResponse: expect.any(Object),
          });
        }
      });
  });
  test("When given incorrect api endpoint, will respond with 404 error with message route not found", () => {
    return request(app)
      .get("/apy")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});
