const db = require("../db/connection");
const PrivateTaskComments = require("../models/COMMENTS/PrivateTaskComments");

class ToGrade {
  constructor() {}

  static async getAllStudentsTasks(class_id, task_id) {
    try {
      const students_sql = `SELECT st.student_id, st.class_id, st.user_id, st.task_id, st.student_submitted, st.student_late, st.student_file,
                  st.file_name, st.student_task_points,
                  st.student_submission_date AS student_submission_date,
                  c.class_handler, c.class_name,
                  u.user_name AS student_name, u.user_surname AS student_surname, u.user_email AS student_email, u.user_image AS student_image,
                  at.task_points
                  FROM students_tasks st
                  JOIN classes c ON st.class_id = c.class_id
                  JOIN users u ON st.user_id = u.user_id
                  JOIN assigned_tasks at ON st.task_id = at.task_id
                  WHERE st.class_id = '${class_id}' AND st.task_id = '${task_id}'`;

      const sql_handler = `SELECT c.class_handler FROM classes c
                  JOIN students_tasks st ON st.class_id = c.class_id
                  WHERE st.class_id = '${class_id}' AND st.task_id = '${task_id}' AND c.class_id = '${class_id}' LIMIT 1`;

      const [handler, _1] = await db.execute(sql_handler);
      const [students, _] = await db.execute(students_sql);
      return { students, handler };
    } catch (error) {
      console.log(error + "-- get all students task --");
      return;
    }
  }

  static async gradeTask(class_id, task_id, student_user_id, points) {
    try {
      const sql = `UPDATE students_tasks SET student_task_points = '${points}'
                  WHERE class_id = '${class_id}' AND task_id = '${task_id}' AND user_id = '${student_user_id}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async removeGradeTask(class_id, task_id, student_user_id) {
    try {
      const sql = `UPDATE students_tasks SET student_task_points = NULL
                  WHERE class_id = '${class_id}' AND task_id = '${task_id}' AND user_id = '${student_user_id}'`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getStudentTaskToGrade(class_id, task_id, student_id) {
    try {
      const sql = `SELECT st.student_id, st.class_id, st.user_id, st.task_id AS post_id, st.student_submitted, st.student_late, st.student_file, st.file_name,
                    st.student_task_points, 
                    st.student_submission_date AS student_submission_date,
                    at.task_points, at.task_id, c.class_handler
                    FROM students_tasks st
                    JOIN classes c ON st.class_id
                    JOIN assigned_tasks at ON st.task_id = at.task_id
                    WHERE st.class_id = '${class_id}' AND st.task_id = '${task_id}' AND st.user_id = '${student_id}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get student task to grade --");
      return;
    }
  }
}

module.exports = ToGrade;
