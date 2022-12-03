const db = require("../../db/connection");

class PostComments {
  constructor(post_id, class_id, comment_from, post_comment_text) {
    this.post_id = post_id;
    this.class_id = class_id;
    this.comment_from = comment_from;
    this.post_comment_text = post_comment_text;
  }

  async createComment() {
    try {
      const date = new Date();
      const sql = `INSERT INTO post_comments SET ?;`;
      const post = {
        post_id: this.post_id,
        class_id: this.class_id,
        comment_from: this.comment_from,
        post_comment_text: this.post_comment_text,
        post_comment_created: date,
      };
      const [data, _] = await db.query(sql, post);
      return data;
    } catch (error) {
      console.log(error + "--create class post comment--");
      return;
    }
  }

  static async getAllPostComments(class_id) {
    const sql = `SELECT c.post_comment_id AS comment_id, c.post_id, c.comment_from, c.class_id,
                  c.post_comment_created AS comment_created, 
                  c.post_comment_text AS comment_text, u.user_name, u.user_surname, u.user_image FROM post_comments c
                  JOIN users u ON c.comment_from = u.user_id 
                  WHERE class_id = '${class_id}'
                  ORDER BY c.post_comment_created DESC`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getComment(post_id, comment_id, comment_from) {
    const sql = `SELECT c.post_comment_id AS comment_id, c.post_id, c.comment_from, c.class_id, c.post_comment_text AS comment_text, 
                c.post_comment_created AS comment_created, 
                u.user_name, u.user_surname
                FROM post_comments c
                JOIN users u ON c.comment_from = u.user_id
                WHERE post_id = '${post_id}' AND post_comment_id = '${comment_id}' AND c.comment_from = '${comment_from}'`;

    const [data, _] = await db.execute(sql);
    return data;
  }

  static async updateComment(comment_id, comment_from, post_id, class_id, post_comment_text) {
    try {
      const sql = `UPDATE post_comments SET 
      post_comment_text = '${post_comment_text}'
      WHERE post_comment_id = '${comment_id}' 
      AND class_id = '${class_id}'
      AND comment_from = '${comment_from}' 
      AND post_id = '${post_id}';`;
      const data = await db.query(sql);
      return data[0];
    } catch (error) {
      console.log(error + "--update class post comment--");
      return;
    }
  }

  static async deleteComment(user_id, comments_id, post_id) {
    try {
      const sql = `DELETE FROM post_comments 
        WHERE post_comment_id = '${comments_id}' 
        AND comment_from = '${user_id}' 
        AND post_id = '${post_id}';`;
      const data = await db.execute(sql);
      return data[0];
    } catch (error) {
      console.log(error + "-- delete class post comment --");
      return;
    }
  }
}

module.exports = PostComments;
