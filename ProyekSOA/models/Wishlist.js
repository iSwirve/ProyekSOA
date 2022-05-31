const db = require("../database");

module.exports = {
    get: async () =>{
        
    },
    add : async (email, game_id) =>{
        let obj = {
            email_user : email,
            game_id : game_id
        }
        let result = await db.query("INSERT INTO wishlist SET ?", obj);
    }
}