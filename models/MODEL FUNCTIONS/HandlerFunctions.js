const db = require("../../db/connection");

class HandlerFunctions {
  constructor() {}

  static async getStudentOngoingTasks(class_id, user_id) {
    const sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname, 
                        st.student_id, st.class_id, st.student_submitted, st.student_late, st.student_file, 
                        st.student_submission_date AS student_submission_date,
                        at.task_id, at.assigned_by, at.task_main_topic, c.class_handler,
                        at.task_submission_date AS task_submission_date, 
                        at.task_points, at.task_open, at.task_file,
                        at.task_created, st.student_task_points
                        FROM students_tasks st
                        JOIN assigned_tasks at ON at.task_id = st.task_id
                        JOIN users teach_u ON teach_u.user_id = at.assigned_by
                        JOIN users stud_u ON stud_u.user_id = at.assigned_by
                        JOIN classes c ON st.class_id = c.class_id
                        WHERE st.class_id = '${class_id}' AND st.user_id = '${user_id}' AND at.task_submission_date > CAST(NOW() AS DATE)
                        AND st.student_submitted = '0'
                        ORDER BY at.task_submission_date DESC`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getStudentMissingTasks(class_id, user_id) {
    const sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname,
                        st.student_id, st.class_id, st.student_submitted, st.student_late, st.student_file, 
                        st.student_submission_date AS student_submission_date,
                        at.task_id, at.assigned_by, at.task_main_topic, c.class_handler,
                        at.task_submission_date AS task_submission_date, 
                        at.task_points, at.task_open, at.task_file,
                        at.task_created, st.student_task_points
                        FROM students_tasks st
                        JOIN assigned_tasks at ON at.task_id = st.task_id
                        JOIN users teach_u ON teach_u.user_id = at.assigned_by
                        JOIN users stud_u ON stud_u.user_id = at.assigned_by
                        JOIN classes c ON st.class_id = c.class_id
                        WHERE st.class_id = '${class_id}' AND st.user_id = '${user_id}' AND at.task_submission_date < CAST(NOW() AS DATE)
                        AND st.student_submitted = '0'
                        ORDER BY at.task_submission_date DESC`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getStudentDoneTasks(class_id, user_id) {
    const sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname, 
                        st.student_id, st.class_id, st.student_submitted, st.student_late, st.student_file, 
                        st.student_submission_date AS student_submission_date,
                        at.task_id, at.assigned_by, at.task_main_topic, c.class_handler,
                        at.task_submission_date AS task_submission_date, 
                        at.task_points, at.task_open, at.task_file,
                        at.task_created, st.student_task_points
                        FROM students_tasks st
                        JOIN assigned_tasks at ON at.task_id = st.task_id
                        JOIN users teach_u ON teach_u.user_id = at.assigned_by
                        JOIN users stud_u ON stud_u.user_id = st.user_id
                        JOIN classes c ON st.class_id = c.class_id
                        WHERE st.class_id = '${class_id}' AND st.user_id = '${user_id}' AND st.student_submitted = '1'
                        ORDER BY at.task_submission_date DESC`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async findById(user_id, class_code) {
    try {
      const find_sql = `SELECT * FROM classes c
                      JOIN students_class sc ON c.class_id = sc.class_id
                      WHERE c.class_code = '${class_code}' AND sc.user_id = '${user_id}'`;
      const [data, _] = await db.execute(find_sql);

      return data;
    } catch (error) {
      console.log(error + "-- find by id --");
      return;
    }
  }
}

module.exports = HandlerFunctions;
