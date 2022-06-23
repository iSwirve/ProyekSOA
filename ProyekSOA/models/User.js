const db = require("../database");

module.exports = {
    getall: async () => {
        let result = null;
        result = await db.query("SELECT * FROM users");
        return result;
    },
    get: async (email = "") => {
        let result = null;
        if (email !== "") result = await db.query("SELECT * FROM users WHERE email = ?", email);
        else result = await db.query("SELECT * FROM users");
        return result;
    },
    get2: async (email,username) => {
        let result = null;
        if (email !== "" && username !== "") result = await db.query("SELECT * FROM users WHERE email = ? and username = ?",  [email,username]);
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
        await db.query("DELETE FROM library WHERE email_user = ?", [email]);
        await db.query("DELETE FROM social_friend WHERE email_first = ? OR email_second = ?", [email, email]);
        await db.query("DELETE FROM social_friend WHERE email_first = ? OR email_second = ?", [email, email]);
        await db.query("DELETE FROM wishlist WHERE email_user = ? ", [email]);
        await db.query("UPDATE transaction SET email_user = ? WHERE email_user = ?", ["<<banned>>", email]);

        let result = await db.query("DELETE FROM users WHERE email = ? and username = ?", [email,username]);
        return result;
    },

}