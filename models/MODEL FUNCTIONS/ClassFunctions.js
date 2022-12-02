const db = require("../../db/connection");

class ClassFunctions {
  constructor() {}

  static async addClassCreator(user_id, class_id) {
    const add_creator_sql = `INSERT INTO students_class (class_id, user_id)
                              VALUES (${class_id}, ${user_id});`;
    const [data, _] = await db.execute(add_creator_sql);
    return data;
  }

  static async unenrollClass(user_id, class_id) {
    try {
      const sql = `DELETE FROM students_class WHERE class_id = '${class_id}' AND user_id = '${user_id}';`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- delete --");
      return;
    }
  }
}

module.exports = ClassFunctions;
