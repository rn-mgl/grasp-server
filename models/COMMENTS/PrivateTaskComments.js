const db = require("../../db/connection");

class PrivateTaskComments {
  constructor(task_id, class_id, comment_from, comment_to, private_comment_text) {
    this.task_id = task_id;
    this.class_id = class_id;
    this.comment_from = comment_from;
    this.comment_to = comment_to;
    this.private_comment_text = private_comment_text;
  }

  async createPrivateComment() {
    const date = new Date();
    try {
      const sql = `INSERT INTO private_tasks_comments SET ?`;
      const post = {
        task_id: this.task_id,
        class_id: this.class_id,
        comment_from: this.comment_from,
        comment_to: this.comment_to,
        private_comment_text: this.private_comment_text,
        private_comment_created: date,
      };
      const data = await db.query(sql, post);
      return data;
    } catch (error) {
      console.log(error + "-- create task comment --");
      return;
    }
  }

  static async updatePrivateComment(
    comment_from,
    class_id,
    private_comment_id,
    task_id,
    private_comment_text
  ) {
    try {
      const sql = `UPDATE private_tasks_comments SET 
        private_comment_text = '${private_comment_text}'
        WHERE private_comment_id = '${private_comment_id}' 
        AND task_id = '${task_id}' 
        AND comment_from = '${comment_from}'
        AND class_id = '${class_id}';`;
      const data = await db.query(sql);
      return data;
    } catch (error) {
      console.log(error + "-- update task comment --");
      return;
    }
  }

  static async getAllPrivateComments(task_id, class_id, comment_from, comment_to) {
    try {
      const sql = `SELECT c.private_comment_id AS comment_id, c.task_id AS post_id, c.comment_from, c.comment_to, c.class_id, c.private_comment_text AS comment_text, 
                    c.private_comment_created AS comment_created, 
                    u.user_name, u.user_surname, u.user_image FROM private_tasks_comments c
                    JOIN users u ON c.comment_from = u.user_id 
                    WHERE c.task_id = '${task_id}' 
                    AND c.class_id = '${class_id}'
                    AND ((c.comment_from = '${comment_from}' AND c.comment_to = '${comment_to}') 
                    OR (c.comment_from = '${comment_to}' AND c.comment_to = '${comment_from}'))
                    ORDER BY c.private_comment_created DESC;`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all task comments --");
      return;
    }
  }

  static async getPrivateComment(class_id, task_id, comment_id, comment_from) {
    try {
      const sql = `SELECT c.private_comment_id AS comment_id, c.task_id AS post_id, c.comment_from, c.comment_to, c.class_id, c.private_comment_text AS comment_text, 
                  c.private_comment_created AS comment_created, 
                  u.user_name, u.user_surname, u.user_image FROM private_tasks_comments c
                  JOIN users u ON c.comment_from = u.user_id 
                  WHERE c.class_id = '${class_id}' 
                  AND c.task_id = '${task_id}' 
                  AND c.private_comment_id = '${comment_id}' 
                  AND c.comment_from = '${comment_from}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get task comment --");
      return;
    }
  }

  static async deletePrivateComment(comment_from, class_id, private_comment_id, task_id) {
    try {
      const sql = `DELETE FROM private_tasks_comments 
        WHERE private_comment_id = '${private_comment_id}' 
        AND task_id = '${task_id}' 
        AND comment_from = '${comment_from}'
        AND class_id = '${class_id}';`;
      const data = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- delete task comment --");
      return;
    }
  }
}

module.exports = PrivateTaskComments;
