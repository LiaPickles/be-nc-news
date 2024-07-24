const request = require("supertest");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const endpointData = require("../endpoints.json");
const jestSorted = require("jest-sorted");

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
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET 404: sends appropriate status and error message when given incorrect api endpoint", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api", () => {
  test("GET 200, responds with an object describing the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpointData).toEqual(endpointData);
      });
  });
  test("GET 404: sends appropriate status and error message when given incorrect api endpoint", () => {
    return request(app)
      .get("/apy")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET 200, responds with an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET 404: sends appropriate status and error message when given incorrect api endpoint", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("GET 200: will return the articles sorted by created at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
test("GET 200: will return the articles sorted by any valid column in default descending order", () => {
  return request(app)
    .get("/api/articles?sort_by=votes&order=asc")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toBeSortedBy("votes", { descending: false });
    });
});

describe("GET /api/articles/:article_id", () => {
  test("GET 200, responds with the correct article object when given and article id endpoint", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({body}) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET 404: sends appropriate status and error message when given a valid but non-existent article ID", () => {
    return request(app)
      .get("/api/articles/333")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET 400: send appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/0L")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET 200: article response object should now also include comment_count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "2",
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET 200: responds with array of comments for given article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("GET 200: responds with array of comments ordered by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200: responds with an empty array when requested an article with no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET 404: sends appropriate status and error message when given a valid but non-existent article ID", () => {
    return request(app)
      .get("/api/articles/333/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET 400: send appropriate status and error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/0L/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201: when given appropriate username and body, will respond with comment body", () => {
    const newComment = {
      username: "butter_bridge",
      body: "great article!",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBe("great article!");
      });
  });
  test("POST 400: when given no comment body, will respond with correct error message", () => {
    const newComment = {
      username: "butter_bridge",
      body: "",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect username or no comment");
      });
  });
  test("POST 400: when invalid username given, will respond with correct error message", () => {
    const newComment = {
      username: "",
      body: "awful article!",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect username or no comment");
      });
  });
  test("POST 400: when given an invalid article_id will respond with correct error message", () => {
    const newComment = {
      username: "butter_bridge",
      body: "great article!",
    };
    return request(app)
      .post("/api/articles/0L/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 404: when given an invalid article_id will respond with correct error message", () => {
    const newComment = {
      username: "butter_bridge",
      body: "great article!",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH 200, /api/articles/:article_id", () => {
  test("when given appropriate votes object, will respond with updated article", () => {
    const votes = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/7")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "icellusedkars",
          title: "Z",
          article_id: 7,
          topic: "mitch",
          body: "I was hungry.",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 5,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 400: will return correct error message when given invalid votes object", () => {
    const votes = { inc_votes: "X" };
    return request(app)
      .patch("/api/articles/7")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: will return correct error message when given invalid article id", () => {
    const votes = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/XX")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404: will return correct error message when given invalid article id", () => {
    const votes = { inc_votes: 7 };
    return request(app)
      .patch("/api/articles/999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  describe("GET /api/articles?topics=:topic", () => {
    test("GET 200: responds with articles filtered by given topic", () => {
      return request(app)
        .get("/api/articles?topics=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(12);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("GET 404: responds with correct error message when incorrect topic is queried", () => {
      return request(app)
        .get("/api/articles?topics=flowers")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE 204: will return correct error message and no body when given valid comment id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  });
  test("DELETE 400: will return correct error message if given invalid comment id", () => {
    return request(app)
      .delete("/api/comments/XX")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("DELETE 404: will return correct error message if given invalid comment id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("GET 200: responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
