const db = require("../../db/connection");
const ClassFunctions = require("../MODEL FUNCTIONS/ClassFunctions");
const TaskFunctions = require("../MODEL FUNCTIONS/TaskFunctions");

class Class {
  constructor(
    class_handler,
    class_code,
    class_name,
    class_subject,
    class_section,
    class_is_ongoing,
    class_image,
    file_name
  ) {
    this.class_handler = class_handler;
    this.class_code = class_code;
    this.class_name = class_name;
    this.class_subject = class_subject;
    this.class_section = class_section;
    this.class_is_ongoing = class_is_ongoing;
    this.class_image = class_image;
    this.file_name = file_name;
  }

  async createClass() {
    const date = new Date();
    try {
      const sql = `INSERT INTO classes SET ?;`;
      const post = {
        class_code: this.class_code,
        class_name: this.class_name,
        class_subject: this.class_subject,
        class_section: this.class_section,
        class_is_ongoing: this.class_is_ongoing,
        class_handler: this.class_handler,
        class_image: this.class_image,
        file_name: this.file_name,
        class_created: date,
      };
      const data = await db.query(sql, post);
      if (data) {
        await ClassFunctions.addClassCreator(this.class_handler, data[0].insertId);
      }
      return data;
    } catch (error) {
      console.log(error + "-- create --");
      return;
    }
  }

  static async updateClass(
    class_id,
    class_name,
    class_subject,
    class_section,
    class_image,
    file_name
  ) {
    try {
      const sql = `UPDATE classes SET 
                  class_name = '${class_name}', 
                  class_subject = '${class_subject}', 
                  class_section = '${class_section}', 
                  class_image = '${class_image}',
                  file_name = '${file_name === null ? null : file_name}'
                  WHERE class_id = '${class_id}';`;
      const data = await db.execute(sql);

      return data;
    } catch (error) {
      console.log(error + "-- update class --");
      return;
    }
  }

  static async archiveClass(class_id) {
    const sql = `UPDATE classes SET class_is_ongoing = '0'
                  WHERE class_id = '${class_id}'`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getAllClass(user_id) {
    const sql = `SELECT u.user_name, u.user_surname, u.user_email, u.user_gender, u.user_image,
                c.class_id, c.class_code, c.class_handler, c.class_name, c.class_section, c.class_subject, 
                c.class_is_ongoing, c.class_image, c.file_name, c.class_created FROM classes c
                JOIN students_class sc ON sc.class_id = c.class_id
                JOIN users u ON c.class_handler = u.user_id
                WHERE sc.user_id = ${user_id} AND c.class_is_ongoing = '1';`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getClass(class_id, user_id) {
    try {
      const class_sql = `SELECT u.user_name, u.user_surname, u.user_email, u.user_gender, u.user_image,
                        c.class_id, c.class_code, c.class_handler, c.class_name, c.class_section, c.class_subject, 
                        c.class_is_ongoing, c.class_image, c.file_name, c.class_created
                        FROM classes c
                        JOIN users u ON c.class_handler = u.user_id
                        WHERE class_id = '${class_id}';`;

      const [class_data, _] = await db.execute(class_sql);
      const upcoming_tasks_data = await TaskFunctions.getUpcomingTasksPreview(class_id, user_id);
      return { class_data, upcoming_tasks_data };
    } catch (error) {
      console.log(error + "-- single class --");
      return;
    }
  }
}

module.exports = Class;
