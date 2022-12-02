const db = require("../../db/connection");

class PublicTaskComments {
  constructor(comment_from, task_id, class_id, public_comment_text) {
    this.comment_from = comment_from;
    this.task_id = task_id;
    this.class_id = class_id;
    this.public_comment_text = public_comment_text;
  }

  async createPublicComment() {
    const date = new Date();
    try {
      const sql = `INSERT INTO public_tasks_comments SET ?`;
      const post = {
        task_id: this.task_id,
        comment_from: this.comment_from,
        class_id: this.class_id,
        public_comment_text: this.public_comment_text,
        public_comment_created: date,
      };
      const data = await db.query(sql, post);
      return data;
    } catch (error) {
      console.log(error + "-- create task comment --");
      return;
    }
  }

  static async updatePublicComment(
    comment_from,
    class_id,
    public_comment_id,
    task_id,
    public_comment_text
  ) {
    try {
      const sql = `UPDATE public_tasks_comments SET 
        public_comment_text = '${public_comment_text}'
        WHERE public_comment_id = '${public_comment_id}' 
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

  static async getAllPublicComments(task_id, class_id) {
    try {
      const sql = `SELECT c.public_comment_id AS comment_id, c.task_id AS post_id, c.comment_from, c.class_id, c.public_comment_text AS comment_text, 
                   DATE_FORMAT(c.public_comment_created, "%m/%d/%Y | %l:%i %p") AS comment_created, 
                    u.user_name, u.user_surname, u.user_image FROM public_tasks_comments c
                    JOIN users u ON c.comment_from = u.user_id 
                    WHERE task_id = '${task_id}' 
                    AND class_id = '${class_id}'
                    ORDER BY c.public_comment_created DESC;`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all task comments --");
      return;
    }
  }

  static async getPublicComment(class_id, task_id, public_comment_id, comment_from) {
    try {
      const sql = `SELECT c.public_comment_id AS comment_id, c.task_id AS post_id, c.comment_from, c.class_id, c.public_comment_text AS comment_text, 
                  DATE_FORMAT(c.public_comment_created, "%m/%d/%Y | %l:%i %p") AS comment_created, 
                  u.user_name, u.user_surname, u.user_image FROM public_tasks_comments c
                  JOIN users u ON c.comment_from = u.user_id 
                  WHERE class_id = '${class_id}' AND task_id = '${task_id}' AND public_comment_id = '${public_comment_id}' AND c.comment_from = '${comment_from}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get task comment --");
      return;
    }
  }

  static async deletePublicComment(comment_from, class_id, public_comment_id, task_id) {
    try {
      const sql = `DELETE FROM public_tasks_comments 
        WHERE public_comment_id = '${public_comment_id}' 
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

module.exports = PublicTaskComments;
