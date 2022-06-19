const db = require("../database");

module.exports = {
    get: async (email = "") => {
        let result = null;
        if (email !== "") result = await db.query("SELECT * FROM users WHERE email = ?", email);
        else result = await db.query("SELECT * FROM users");
        return result;
    },
    cek_username: async (username = "") => {
        let result = null;
        if (username !== "") result = await db.query("SELECT * FROM users WHERE username = ?", username);
        else result = await db.query("SELECT * FROM users");
        return result;
    },
    login: async (email,password) => {
        let result = await db.query(`SELECT * FROM users WHERE email = '${email}' and password = '${password}'`);
        return result;
    },
    add: async (users) => {
        let result = await db.query("INSERT INTO users SET ?", users);
        return result;
    },
    update: async (email, nama_user,no_telp) => {
        let result = await db.query("UPDATE users SET nama_user = ?,no_telp = ? WHERE email = ?", [nama_user,no_telp, email]);
        return result;
    },
    delete: async (email, username) => {
        let result = await db.query("DELETE FROM users WHERE email = ? and username = ?", [email,username]);
        return result;
    },

}