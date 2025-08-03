const Article = require("./articles.schema");

class ArticleService {
  getAll() {
    return Article.find().populate("user", "-password");
  }
  
  get(id) {
    return Article.findById(id).populate("user", "-password");
  }
  
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true }).populate("user", "-password");
  }
  
  delete(id) {
    return Article.findByIdAndDelete(id);
  }
  
  getByUserId(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticleService(); 