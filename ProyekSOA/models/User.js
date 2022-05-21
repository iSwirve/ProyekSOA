const db = require("../database");

module.exports = {
    get: async (username = "") => {
        let result = null;
        if (username !== "") result = await db.query("SELECT * FROM users WHERE email = ?", email);
        else result = await db.query("SELECT * FROM users");
        return result;
    },
    add: async (users) => {
        let result = await db.query("INSERT INTO users SET ?", users);
        return result;
    },
    update: async (username, change) => {
        // ini query cepat buat ngupdate :)
        let result = await db.query("UPDATE users SET ? WHERE username = ?", [change, username]);
        return result;
    },
}