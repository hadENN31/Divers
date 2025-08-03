const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");
const User = require("../api/users/users.model");

describe("tester API articles", () => {
  let token;
  const USER_ID = "fake";
  const ARTICLE_ID = "article_fake";
  const MOCK_USER = {
    _id: USER_ID,
    name: "admin",
    email: "admin@test.com",
    password: "azertyuiop",
    role: "admin"
  };
  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "Test content",
    status: "draft",
    user: USER_ID
  };
  const MOCK_ARTICLE_CREATED = {
    title: "New Article",
    content: "New content",
    status: "published"
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    // Mock pour le middleware d'authentification
    const mockUserForAuth = {
      _id: USER_ID,
      name: "admin",
      email: "admin@test.com",
      password: "azertyuiop",
      role: "admin",
      age: 30
    };
    mockingoose(User).toReturn(mockUserForAuth, "findById");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findByIdAndUpdate");
    mockingoose(Article).toReturn(MOCK_ARTICLE, "findByIdAndDelete");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const updateData = {
      title: "Updated Article",
      content: "Updated content",
      status: "published"
    };
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(updateData)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updateData.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  test("Est-ce que articlesService.create est appelé", async () => {
    const spy = jest
      .spyOn(articlesService, "create")
      .mockImplementation(() => "test");
    await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("Est-ce que articlesService.update est appelé", async () => {
    const spy = jest
      .spyOn(articlesService, "update")
      .mockImplementation(() => "test");
    await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({ title: "Updated" })
      .set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("Est-ce que articlesService.delete est appelé", async () => {
    const spy = jest
      .spyOn(articlesService, "delete")
      .mockImplementation(() => "test");
    await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
}); 