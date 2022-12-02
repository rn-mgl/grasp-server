const db = require("../../db/connection");

class ClassPost {
  constructor(class_id, posted_by, post_main_topic, post_text, post_file, file_name) {
    this.class_id = class_id;
    this.posted_by = posted_by;
    this.post_main_topic = post_main_topic;
    this.post_text = post_text;
    this.post_file = post_file;
    this.file_name = file_name;
  }

  async createPost() {
    try {
      const date = new Date();
      const sql = `INSERT INTO class_posts SET ?;`;
      const post = {
        class_id: this.class_id,
        posted_by: this.posted_by,
        post_main_topic: this.post_main_topic,
        post_text: this.post_text,
        post_file: this.post_file,
        file_name: this.file_name,
        post_created: date,
      };

      const [data, _] = await db.query(sql, post);
      return data;
    } catch (error) {
      console.log(error + "-- create class posts --");
      return;
    }
  }

  static async updatePost(id, post_main_topic, post_text, post_file, file_name) {
    try {
      const sql = `UPDATE class_posts SET ? WHERE post_id = '${id}';`;
      const post = {
        post_main_topic,
        post_text,
        post_file,
        file_name,
      };
      const data = await db.query(sql, post);
      return data;
    } catch (error) {
      console.log(error + "-- update class post --");
      return;
    }
  }

  static async deletePost(id) {
    try {
      const sql = `DELETE FROM class_posts WHERE post_id = '${id}' RETURNING *;`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- delete class post --");
      return;
    }
  }

  static async getAllClassPostAndTaskPost(class_id, user_id) {
    const sql = `SELECT u.user_name, u.user_surname, 'task' as post_type, u.user_image,
                        st.task_id AS post_id, st.class_id, 
                        at.assigned_by AS posted_by, at.task_main_topic AS post_main_topic, at.task_text AS post_text, at.task_file AS post_file, at.file_name,
                        DATE_FORMAT(at.task_created, "%m/%d/%Y | %l:%i %p") AS post_created
                        FROM students_tasks st
                        JOIN assigned_tasks at ON st.task_id = at.task_id
                        JOIN users u ON at.assigned_by = u.user_id
                        WHERE st.class_id = '${class_id}' AND st.user_id = '${user_id}' AND at.task_open = '1'

                        UNION ALL

                        SELECT u.user_name, u.user_surname, 'post' as post_type, u.user_image,
                        c.post_id, c.class_id, c.posted_by, c.post_main_topic, c.post_text, c.post_file, c.file_name, 
                        DATE_FORMAT(c.post_created, "%m/%d/%Y | %l:%i %p") AS post_created
                        FROM class_posts c 
                        JOIN users u ON c.posted_by = u.user_id
                        WHERE class_id = '${class_id}'
                        
                        ORDER BY post_created DESC`;

    const [post, _] = await db.execute(sql);
    return post;
  }

  static async getPost(class_id, post_id, user_id) {
    try {
      const sql = `SELECT u.user_name, u.user_surname, u.user_email, u.user_gender, u.user_image,
                  c.post_id, c.class_id, c.posted_by, c.post_main_topic, c. post_text, c.post_file, c.file_name, DATE_FORMAT(c.post_created, "%m/%d/%Y | %l:%i %p") AS post_created
                  FROM class_posts c 
                  JOIN users u ON c.posted_by = u.user_id
                  WHERE c.class_id = '${class_id}' AND c.post_id = '${post_id}' AND c.posted_by = '${user_id}'
                  ORDER BY post_created DESC`;
      const [post, _] = await db.execute(sql);
      return post;
    } catch (error) {
      console.log(error + "-- get single class post --");
      return;
    }
  }
}

module.exports = ClassPost;
