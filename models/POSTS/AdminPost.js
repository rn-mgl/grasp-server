const db = require("../../db/connection");

class AdminPost {
  constructor(user_id, post_main_topic, post_text, post_file, file_name) {
    this.user_id = user_id;
    this.post_main_topic = post_main_topic;
    this.post_text = post_text;
    this.post_file = post_file;
    this.file_name = file_name;
  }

  async createPost() {
    const date = new Date();

    const sql = `INSERT INTO admin_posts SET ?;`;
    const post = {
      user_id: this.user_id,
      post_main_topic: this.post_main_topic,
      post_text: this.post_text,
      post_file: this.post_file,
      file_name: this.file_name,
      post_created: date,
    };

    const [data, _] = await db.query(sql, post);

    return data;
  }

  static async updatePost(id, post_main_topic, post_text, post_file, file_name) {
    const sql = `UPDATE admin_posts SET ? WHERE post_id = '${id}';`;
    const post = {
      post_main_topic,
      post_text,
      post_file,
      file_name,
    };
    const data = await db.query(sql, post);
    return data[0];
  }

  static async getAllPost() {
    try {
      const sql = `SELECT DATE_FORMAT(p.post_created, "%m/%d/%Y | %l:%i %p") AS post_created, 
        p.post_file, p.file_name, p.post_id, p.post_main_topic, 'post' as post_type,
        p.post_text, u.user_name, u.user_surname, u.user_id AS posted_by, u.user_image
        FROM admin_posts p
        JOIN users u ON p.user_id = u.user_id
        ORDER BY p.post_created DESC;`;
      const [data, _] = await db.execute(sql);

      return data;
    } catch (error) {
      console.log(error + "-- get all admin post --");
      return;
    }
  }

  static async getPost(id) {
    try {
      const sql = `SELECT * FROM admin_posts WHERE post_id = '${id}'`;
      const [post, _] = await db.execute(sql);

      return post;
    } catch (error) {
      console.log(error + "-- get admin post --");
      return;
    }
  }

  static async deletePost(id) {
    try {
      const sql = `DELETE FROM admin_posts WHERE post_id ='${id}' RETURNING *`;
      const data = await db.execute(sql);

      return data[0];
    } catch (error) {
      console.log(error + "-- delete admin post --");
      return;
    }
  }
}

module.exports = AdminPost;
