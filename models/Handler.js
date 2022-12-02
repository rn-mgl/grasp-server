const db = require("../db/connection");

class Handler {
  constructor() {}

  static async getAllAssignedTasks(class_id, user_id) {
    try {
      const sql = `SELECT * FROM assigned_tasks at 
                    JOIN classes c ON at.class_id = c.class_id
                    WHERE at.class_id = '${class_id}' AND at.assigned_by = '${user_id}' `;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all assigned task --");
      return;
    }
  }

  static async getHandlerTask(task_id, class_id) {
    try {
      const task_sql = `SELECT at.task_id, at.task_main_topic, at.task_text, DATE_FORMAT(at.task_submission_date, '%Y-%m-%dT%H:%i') AS task_submission_date, 
                          at.task_points, at.task_open, at.task_file, at.task_created, at.assigned_by
                          FROM assigned_tasks at
                          WHERE at.class_id = ${class_id}
                          AND at.task_id = ${task_id};`;
      const [task_data, _] = await db.execute(task_sql);
      return { task_data };
    } catch (error) {
      console.log(error + "-- get handler task --");
      return;
    }
  }
}

module.exports = Handler;
