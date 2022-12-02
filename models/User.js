const db = require("../db/connection");
const TaskFunctions = require("../models/MODEL FUNCTIONS/TaskFunctions");

class User {
  constructor(user_name, user_surname, user_gender, user_email, user_password) {
    this.user_name = user_name;
    this.user_surname = user_surname;
    this.user_gender = user_gender;
    this.user_email = user_email;
    this.user_password = user_password;
  }

  async createUser() {
    const date = new Date();

    const sql = `INSERT INTO users SET ?`;
    const post = {
      user_name: this.user_name,
      user_surname: this.user_surname,
      user_gender: this.user_gender,
      user_email: this.user_email,
      user_password: this.user_password,
      user_created: date,
    };

    const [data, _] = await db.query(sql, post);

    return data;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE user_email = '${email}'`;

    const [data, _] = await db.execute(sql);

    return data[0];
  }

  static async getUser(user_id) {
    try {
      await TaskFunctions.updateGlobalTasks(user_id);

      const user_sql = `SELECT * FROM users u
                      WHERE u.user_id = '${user_id}';`;

      const [data, _] = await db.execute(user_sql);
      return data;
    } catch (error) {
      console.log(error + "-- get user --");
      return;
    }
  }

  static async updateUser(user_id, user_image, user_name, user_surname, user_gender) {
    const profile_image =
      user_image === null || user_image === undefined
        ? "user_image = NULL"
        : `user_image = '${user_image}'`;
    try {
      const sql = `UPDATE users SET ${profile_image}, user_name = '${user_name}', user_surname = '${user_surname}', user_gender = '${user_gender}'
                  WHERE user_id = '${user_id}'`;

      const [data, _] = await db.execute(sql);
      return data;
    } catch (error) {
      console.log(error + "-- update user --");
    }
  }
}

module.exports = User;
