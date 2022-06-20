const db = require("../database");

module.exports = {
    get: async (email) =>{
        let result = await db.query("SELECT * FROM wishlist WHERE email_user = ?", [email]);
        return result;
    },
    add : async (email, game_id) =>{
        let obj = {
            email_user : email,
            game_id : game_id
        }
        let result = await db.query("INSERT INTO wishlist SET ?", obj);
    }
}