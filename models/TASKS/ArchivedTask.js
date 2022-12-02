const db = require("../../db/connection");
const TaskFunctions = require("../MODEL FUNCTIONS/TaskFunctions");
const PublicTaskComments = require("../COMMENTS/PublicTaskComments");
const PrivateTaskComments = require("../COMMENTS/PrivateTaskComments");

class ArchivedTask {
  constructor() {}
  static async openTask(task_id) {
    try {
      const sql = `UPDATE assigned_tasks SET task_open = '1' 
                  WHERE task_id = '${task_id}'`;
      // await TaskFunctions.assignTask(task_id);
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getAllArchivedTasks(class_id) {
    try {
      const sql = `SELECT teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname, c.class_handler, at.class_id, 1 AS is_archived,
                  at.task_id, at.assigned_by, at.task_main_topic, DATE_FORMAT(at.task_submission_date, "%m/%d/%Y | %l:%i %p") AS task_submission_date, 
                  at.task_points, at.task_created
                  FROM assigned_tasks at
                  JOIN classes c ON c.class_id = at.class_id
                  JOIN users teach_u ON teach_u.user_id = at.assigned_by
                  WHERE at.class_id = '${class_id}' AND at.task_open = '0'
                  ORDER BY at.task_submission_date DESC`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getArchivedTask(task_id, user_id, class_id, comment_from, comment_to) {
    try {
      const task_sql = `SELECT u.user_name AS assigned_by_name, u.user_surname AS assigned_by_surname, 1 AS is_archived,  
                        at.task_id, at.task_main_topic, at.task_text, 
                        DATE_FORMAT(at.task_submission_date, "%m/%d/%Y | %l:%i %p") AS task_submission_date, 
                        at.task_points, at.task_open, at.task_file,
                        at.task_created, at.assigned_by,
                        c.class_id, c.class_name, c.class_handler
                        FROM assigned_tasks at
                        JOIN users u ON u.user_id = at.assigned_by
                        JOIN classes c ON at.class_id = c.class_id
                        WHERE at.class_id = '${class_id}'
                        AND at.assigned_by = '${user_id}'
                        AND at.task_id = '${task_id}'
                        AND at.task_open = 0;`;

      const [task_data, _1] = await db.execute(task_sql);
      const public_comment_data = await PublicTaskComments.getAllPublicComments(task_id, class_id);
      const private_comment_data = await PrivateTaskComments.getAllPrivateComments(
        task_id,
        class_id,
        comment_from,
        comment_to
      );
      return { task_data, public_comment_data, private_comment_data };
    } catch (error) {
      console.log(error + "-- get archived task --");
      return;
    }
  }
}

module.exports = ArchivedTask;
