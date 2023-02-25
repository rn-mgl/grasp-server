const db = require("../../db/connection");

class TaskFunctions {
  constructor() {}
  static async assignTask(task_id) {
    try {
      const assign = `INSERT INTO students_tasks (students_tasks.class_id, students_tasks.user_id, students_tasks.task_id)
                        SELECT assigned_tasks.class_id, students_class.user_id, assigned_tasks.task_id FROM assigned_tasks
                        JOIN students_class ON assigned_tasks.class_id = students_class.class_id
                        WHERE task_id = '${task_id}'`;
      const data = await db.query(assign);
      return data;
    } catch (error) {
      console.log(error + "-- assign task --");
      return;
    }
  }

  static async unassignTask(task_id) {
    try {
      const assign = `DELETE FROM students_tasks WHERE task_id = '${task_id}'`;
      const data = await db.query(assign);
      return data;
    } catch (error) {
      console.log(error + "-- unassign task --");
      return;
    }
  }

  static async assignAllTask(user_id, class_id) {
    try {
      const assign = `INSERT INTO students_tasks (class_id, user_id, task_id)
                        SELECT at.class_id, sc.user_id, at.task_id FROM assigned_tasks at
                        JOIN students_class sc ON at.class_id = sc.class_id
                        WHERE sc.user_id = '${user_id}' AND sc.class_id = '${class_id}';`;
      const data = await db.query(assign);
      return data;
    } catch (error) {
      console.log(error + "-- assign all task --");
      return;
    }
  }

  static async updateClassTasks(class_id, user_id) {
    const update_missing = `UPDATE students_tasks st
                              JOIN assigned_tasks at ON st.task_id = at.task_id
                              SET st.student_late = (CASE WHEN CAST(at.task_submission_date AS DATE) < CAST(NOW() AS DATE) THEN '1' ELSE '0' END)
                              WHERE st.user_id = '${user_id}' AND st.class_id = '${class_id}'`;
    await db.execute(update_missing);
  }

  static async updateGlobalTasks(user_id) {
    const update_missing = `UPDATE students_tasks st
                              JOIN assigned_tasks at ON st.task_id = at.task_id
                              SET st.student_late = CASE WHEN at.task_submission_date < CAST(NOW() AS DATE) THEN '1' ELSE '0' END
                              WHERE st.user_id = '${user_id}'`;
    await db.execute(update_missing);
  }

  static async getUpcomingTasksPreview(class_id, user_id) {
    const sql = `SELECT a.task_id, a.task_main_topic 
                FROM assigned_tasks a 
                JOIN students_tasks s 
                ON a.task_id = s.task_id
                WHERE s.user_id = '${user_id}' AND a.class_id='${class_id}' AND s.student_submitted = '0' AND a.task_open = '1'
                ORDER BY a.task_created DESC
                LIMIT 3`;
    const [data, _] = await db.execute(sql);
    return data;
  }
}

module.exports = TaskFunctions;
