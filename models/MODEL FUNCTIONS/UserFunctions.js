const db = require("../../db/connection");

class UserFunctions {
  constructor() {}
  static async getAllMyClasses(user_id) {
    const sql = `SELECT sc.student_joined, sc.class_id, sc.user_id,
                c.class_handler, c.class_name, c.class_section, c.class_subject, c.class_is_ongoing, c.class_image,
                uch.user_name AS class_handler_name, uch.user_surname AS class_handler_surname, uch.user_email AS class_handler_email FROM students_class sc
                JOIN users u ON sc.user_id = u.user_id
                JOIN classes c ON c.class_id = sc.class_id
                JOIN users uch ON c.class_handler = uch.user_id
                WHERE u.user_id = '${user_id}' AND sc.user_id = '${user_id}' AND c.class_is_ongoing = '1'`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getAllMyTasks(user_id) {
    const sql = `SELECT c.class_name, c.class_handler,
                        st.student_id, st.class_id, st.task_id, st.student_submitted, st.student_late, st.student_task_points, 
                        DATE_FORMAT(st.student_submission_date, "%m/%d/%Y | %l:%i %p") AS student_submission_date, 
                        at.task_main_topic, 
                        DATE_FORMAT(at.task_submission_date, "%m/%d/%Y | %l:%i %p") AS task_submission_date, u.user_name, u.user_surname
                        FROM students_tasks st
                        JOIN classes c ON st.class_id = c.class_id
                        JOIN assigned_tasks at ON at.task_id = st.task_id
                        JOIN users u ON at.assigned_by = u.user_id
                        WHERE st.user_id = '${user_id}' AND at.task_open = '1'`;
    const [data, _] = await db.execute(sql);
    return data;
  }

  static async getMyClassAndTaskCount(user_id) {
    const sql = ` SELECT
                    COUNT(CASE WHEN (st.student_submitted = '0' AND st.student_late = '0') THEN 1 ELSE NULL END) AS ongoing_count, 
                    COUNT(CASE WHEN (st.student_submitted = '0' AND st.student_late = '1') THEN 1 ELSE NULL END) AS late_count,
                    COUNT(CASE WHEN st.student_submitted = '1' THEN 1 ELSE NULL END) AS done_count
                    FROM students_tasks st
                    WHERE st.user_id = '${user_id}'`;
    const [data, _] = await db.execute(sql);
    return data;
  }
}

module.exports = UserFunctions;
