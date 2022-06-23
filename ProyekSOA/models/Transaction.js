const db = require("../database");

module.exports = {
    getInvoice: async () =>{
        let result = await db.query("SELECT (CAST(SUBSTRING(MAX(invoice),5, 3) AS INT) + 1) AS num FROM TRANSACTION");
        let invoice = "INV_" + (result[0].num.toString()).padStart(3, "0");
        return invoice;
    },
    checkTransaction: async (email, game_id)=>{
        let result = await db.query("SELECT * FROM TRANSACTION WHERE email_user = ? AND id_game = ? and (status = 0 or status = 1)", [email, game_id]);
        return result;
    },
    add : async (data) =>{
        await db.query("INSERT INTO TRANSACTION SET ?", [data]);
    }
}