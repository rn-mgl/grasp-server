const db = require("../db/connection");
const HandlerFunctions = require("./MODEL FUNCTIONS/HandlerFunctions");
const TaskFunctions = require("../models/MODEL FUNCTIONS/TaskFunctions");

class Student {
  constructor() {}

  static async getAllStudents(class_id) {
    try {
      const sql = `SELECT u.user_id, u.user_name, u.user_surname, u.user_email, u.user_image, c.class_handler FROM users  u
      JOIN students_class sc ON u.user_id = sc.user_id
      JOIN classes c ON sc.class_id = c.class_id
      WHERE c.class_id = ${class_id}
      ORDER BY sc.student_joined DESC;`;
      const [data] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all students --");
      return;
    }
  }

  static async getStudent(user_id, class_id) {
    try {
      const sql = `SELECT u.user_name, u.user_surname, u.user_email, u.user_image, u.user_created, u.user_image,
                        sc.class_id, 
                        sc.student_joined AS student_joined
                        FROM users u 
                        INNER JOIN students_class sc ON sc.user_id = u.user_id
                        WHERE sc.class_id = '${class_id}' AND sc.user_id = '${user_id}' AND u.user_id = '${user_id}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get student --");
      return;
    }
  }

  static async removeStudents(students, class_id) {
    try {
      students.forEach(async (student) => {
        const sql = `DELETE FROM students_class 
        WHERE user_id = '${student}' AND class_id = '${class_id}'`;
        await db.execute(sql);
      });
    } catch (error) {
      console.log(error + "-- remove students --");
      return;
    }
    return "deleted";
  }

  static async submitTask(user_id, task_id, class_id, student_file, file_name) {
    const student_submission_date = new Date();
    try {
      const sql = `UPDATE students_tasks SET ? 
                  WHERE user_id = '${user_id}' AND task_id = '${task_id}' AND class_id = '${class_id}'`;
      const patch = { student_file, file_name, student_submitted: 1, student_submission_date };

      const [data, _] = await db.query(sql, patch);

      return data;
    } catch (error) {
      console.log(error + "-- submit task --");
      return;
    }
  }

  static async unsubmitTask(user_id, task_id, class_id) {
    try {
      const sql = `UPDATE students_tasks SET ? 
                  WHERE user_id = '${user_id}' AND task_id = '${task_id}' AND class_id = '${class_id}'`;
      const patch = {
        student_file: null,
        file_name: null,
        student_submitted: 0,
        student_submission_date: null,
      };
      const [data, _] = await db.query(sql, patch);
      return data;
    } catch (error) {
      console.log(error + "-- submit task --");
      return;
    }
  }

  static async joinClass(user_id, class_code) {
    try {
      const if_exist = await HandlerFunctions.findById(user_id, class_code);

      if (if_exist.length > 0) {
        return "already in class";
      }

      const join_sql = `INSERT INTO students_class (class_id, user_id, student_joined)
                          SELECT class_id, '${user_id}', CAST(NOW() AS DATE)
                          FROM classes
                          WHERE class_code = '${class_code}'`;
      const class_id_sql = `SELECT class_id FROM classes WHERE class_code = '${class_code}'`;
      const [joined, _] = await db.execute(join_sql);
      const [data, _1] = await db.execute(class_id_sql);

      if (joined) {
        await TaskFunctions.assignAllTask(user_id, data[0].class_id);
      }

      return joined;
    } catch (error) {
      console.log(error + "-- join class --");
      return;
    }
  }
}

module.exports = Student;
