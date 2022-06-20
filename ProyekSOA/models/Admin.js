const { default: axios } = require("axios");
const db = require("../database");

module.exports = {
    getTransaction: async (invoice = "") => {
        let result;
        if(invoice == "")
        {
            result = await db.query("SELECT * FROM transaction");
        }
        else{
            result = await db.query("SELECT * FROM transaction WHERE invoice = ?", [invoice]);
        }
        return result;
    },
    verifyTransaction : async (invoice) =>{
        let inv = await db.query("SELECT * FROM transaction WHERE invoice = ?", [invoice]);
        if(inv[0].status == 1)
        {
            return "0"
        }

        await db.query("UPDATE transaction SET status = 1 WHERE invoice = ?", [invoice]);
        return "1";
    }
}





