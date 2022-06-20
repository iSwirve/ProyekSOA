const db = require("../database");

module.exports = {
    add: async (data) => {
        await db.query("INSERT INTO library SET ?", [data]);
    }
}