const db = require("../../db/connection");
const TaskFunctions = require("../MODEL FUNCTIONS/TaskFunctions");

class ActiveTask {
  constructor(
    class_id,
    assigned_by,
    task_main_topic,
    task_text,
    task_submission_date,
    task_points,
    task_open,
    task_file,
    file_name,
    task_created
  ) {
    this.class_id = class_id;
    this.assigned_by = assigned_by;
    this.task_main_topic = task_main_topic;
    this.task_text = task_text;
    this.task_submission_date = task_submission_date;
    this.task_points = task_points;
    this.task_open = task_open;
    this.task_file = task_file;
    this.file_name = file_name;
    this.task_created = task_created;
  }

  async createTask() {
    const date = new Date();
    try {
      const sql = `INSERT INTO assigned_tasks SET ?`;
      const post = {
        class_id: this.class_id,
        assigned_by: this.assigned_by,
        task_main_topic: this.task_main_topic,
        task_text: this.task_text,
        task_submission_date:
          this.task_submission_date === "" ? undefined : this.task_submission_date,
        task_points: this.task_points,
        task_open: this.task_open,
        task_file: this.task_file,
        file_name: this.file_name,
        task_created: date,
      };
      const data = await db.query(sql, post);

      if (data && this.task_open) {
        await TaskFunctions.assignTask(data[0].insertId);
      }

      return data;
    } catch (error) {
      console.log(error + "-- assign tasks --");
      return;
    }
  }

  static async updateTask(
    task_id,
    task_main_topic,
    task_text,
    task_submission_date,
    task_points,
    task_file,
    file_name
  ) {
    try {
      const sql = `UPDATE assigned_tasks SET ? WHERE task_id = '${task_id}'`;
      const post = {
        task_main_topic,
        task_text,
        task_submission_date,
        task_points,
        task_file,
        file_name,
      };

      const data = await db.query(sql, post);
      return data;
    } catch (error) {
      console.log(error + "-- update task --");
      return;
    }
  }

  static async archiveTask(task_id) {
    try {
      const sql = `UPDATE assigned_tasks SET task_open = '0' 
                  WHERE task_id = '${task_id}'`;
      // await TaskFunctions.unassignTask(task_id);
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getAllClassTasks(class_id, user_id) {
    try {
      await TaskFunctions.updateClassTasks(user_id);

      const sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname, c.class_handler, 0 AS is_archived,
                  st.student_id, st.class_id, st.student_submitted, st.student_late,
                  st.student_submission_date AS student_submission_date,
                  at.task_id, at.assigned_by, at.task_main_topic, at.task_submission_date AS task_submission_date, 
                  at.task_points, at.task_created
                  FROM students_tasks st
                  JOIN assigned_tasks at ON at.task_id = st.task_id
                  JOIN classes c ON c.class_id = at.class_id
                  JOIN users teach_u ON teach_u.user_id = at.assigned_by
                  JOIN users stud_u ON stud_u.user_id = st.user_id
                  WHERE st.class_id = '${class_id}' AND st.user_id = '${user_id}' AND at.task_open = '1'
                  ORDER BY at.task_submission_date DESC`;

      const sql_handler = `SELECT class_handler FROM classes WHERE class_id = '${class_id}' LIMIT 1`;

      const [handler, _] = await db.execute(sql_handler);
      const [task, _1] = await db.execute(sql);

      return { handler, task };
    } catch (error) {
      console.log(error + "-- get all class tasks --");
      return;
    }
  }

  static async getAllOngoingTasks(user_id) {
    try {
      await TaskFunctions.updateGlobalTasks(user_id);

      const ongoing_sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname,
      st.student_id, st.class_id, st.student_submitted, st.student_late, 
      at.task_id, at.assigned_by, at.task_main_topic, 
      at.task_submission_date AS task_submission_date, at.task_points, 
      at.task_open, at.task_created
      FROM students_tasks st
      JOIN assigned_tasks at ON at.task_id = st.task_id
      JOIN users teach_u ON teach_u.user_id = at.assigned_by
      JOIN users stud_u ON stud_u.user_id = st.user_id
      JOIN classes c ON st.class_id = c.class_id
      WHERE st.user_id = '${user_id}' AND (at.task_submission_date > CAST(NOW() AS DATE) OR at.task_submission_date IS NULL)
      AND st.student_submitted = '0' AND at.task_open = '1' AND c.class_handler <> '${user_id}'
      ORDER BY at.task_submission_date DESC`;

      const [data, _] = await db.execute(ongoing_sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all ongoing tasks --");
      return;
    }
  }

  static async getAllMissingTasks(user_id) {
    try {
      await TaskFunctions.updateGlobalTasks(user_id);

      const missing_sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname, 
      st.student_id, st.class_id, st.student_submitted, st.student_late,
      at.task_id, at.assigned_by, at.task_main_topic, 
      at.task_submission_date AS task_submission_date, 
      at.task_points, at.task_created
      FROM students_tasks st
      JOIN assigned_tasks at ON at.task_id = st.task_id
      JOIN users teach_u ON teach_u.user_id = at.assigned_by
      JOIN users stud_u ON stud_u.user_id = st.user_id
      JOIN classes c ON st.class_id = c.class_id
      WHERE st.user_id = '${user_id}' AND at.task_submission_date < CAST(NOW() AS DATE)
      AND st.student_submitted = '0' AND at.task_open = '1' AND c.class_handler <> '${user_id}'
      ORDER BY at.task_submission_date DESC`;

      const [data, _] = await db.execute(missing_sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all missing tasks --");
      return;
    }
  }

  static async getAllDoneTasks(user_id) {
    try {
      await TaskFunctions.updateGlobalTasks(user_id);

      const done_sql = `SELECT stud_u.user_id, teach_u.user_name AS assigned_by_name, teach_u.user_surname AS assigned_by_surname,
      st.student_id, st.class_id, st.student_submitted, st.student_late,
      at.task_id, st.task_id AS post_id, at.assigned_by, at.task_main_topic, 
      at.task_submission_date AS task_submission_date, 
      at.task_points, at.task_created
      FROM students_tasks st
      JOIN assigned_tasks at ON at.task_id = st.task_id
      JOIN users teach_u ON teach_u.user_id = at.assigned_by
      JOIN users stud_u ON stud_u.user_id = st.user_id
      JOIN classes c ON st.class_id = c.class_id
      WHERE st.user_id = '${user_id}' AND st.student_submitted = '1' AND at.task_open = '1' AND c.class_handler <> '${user_id}'
      ORDER BY at.task_submission_date DESC`;

      const [data, _] = await db.execute(done_sql);
      return data;
    } catch (error) {
      console.log(error + "-- get all done tasks --");
      return;
    }
  }

  static async getStudentTask(task_id, user_id, class_id) {
    try {
      const task_sql = `SELECT u.user_name AS assigned_by_name, u.user_surname AS assigned_by_surname, 0 AS is_archived,  
                        st.student_id, st.class_id, st.student_submitted, st.student_late, st.student_file, at.file_name, 
                        st.student_submission_date AS student_submission_date, 
                        st.user_id AS assigned_to,
                        at.task_id, st.task_id AS post_id, at.task_main_topic, at.task_text, at.task_submission_date AS task_submission_date, at.task_points, at.task_open, at.task_file,
                        at.task_created, at.assigned_by, st.student_task_points,
                        c.class_id, c.class_name, c.class_handler, c.class_is_ongoing
                        FROM students_tasks st
                        JOIN assigned_tasks at ON at.task_id = st.task_id
                        JOIN users u ON u.user_id = at.assigned_by
                        JOIN classes c ON at.class_id = c.class_id
                        WHERE st.class_id = '${class_id}'
                        AND st.user_id = '${user_id}'
                        AND st.task_id = '${task_id}'
                        AND at.task_open = 1;`;

      const [data, _] = await db.execute(task_sql);
      return data;
    } catch (error) {
      console.log(error + "-- get one task --");
      return;
    }
  }

  static async removeTask(task_id) {
    try {
      const sql = `DELETE FROM assigned_tasks WHERE task_id = '${task_id}';`;
      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- delete task --");
      return;
    }
  }
}

module.exports = ActiveTask;
