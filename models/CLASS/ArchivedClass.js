const db = require("../../db/connection");

class ArchivedClass {
  constructor() {}

  static async getAllArchivedClass(user_id) {
    const sql = `SELECT u.user_name, u.user_surname, u.user_email, u.user_image, u.user_gender,
                c.class_id, c.class_code, c.class_handler, c.class_name, c.class_section, c.class_subject, 
                c.class_is_ongoing, c.class_image, c.class_created FROM classes c
                JOIN students_class sc ON sc.class_id = c.class_id
                JOIN users u ON c.class_handler = u.user_id
                WHERE sc.user_id = ${user_id} AND c.class_is_ongoing = '0';`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async deleteClass(class_id) {
    try {
      const sql = `DELETE FROM classes WHERE class_id = '${class_id}';`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- delete --");
      return;
    }
  }

  static async restoreClass(class_id) {
    const sql = `UPDATE classes SET class_is_ongoing = '1'
                  WHERE class_id = '${class_id}'`;
    const [data, _] = await db.execute(sql);
    return data;
  }
}

module.exports = ArchivedClass;
