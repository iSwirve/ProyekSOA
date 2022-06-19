
const db = require("../database");

module.exports = {
    getFriendlist: async(email = "") => {
        let result = null;
        if (email !== "") result = await db.query("SELECT email_second,status FROM social_friend WHERE email_first = ? and status = 1", email);
        return result;
    },
    addFriendlist: async (email,email_friend) =>{
        let result = null;
        if(email == email_friend){
            result = {"Message " : "Cant Added"}
            return result
        }
        let temp = await db.query("select * from users where email = ?",email_friend)
        if(temp.length > 0){
            let obj = {
                email_second : email_friend,
                email_first : email,
                status : 2
            }

            let temp_main = await db.query(`SELECT * FROM social_friend WHERE email_first = '${email_friend}' and email_second = '${email}' and status = 2 or status = 1`)
            if(temp_main.length > 0){
                result = {"Meesage" : "User ini sudah ditambahkan oleh " + email_friend + " ,Mohon untuk melihat Request Friend"}
                return result
            }
            let temp_friend = await db.query(`SELECT * FROM social_friend WHERE email_first = '${email}' and email_second = '${email_friend}'`)
            if(temp_friend.length > 0){
                result = {"Message" : "User Added Before"}
                return result
            }else{
                if(email_friend !== "") result = await db.query("insert into social_friend set ?",obj)
                result = {"Message" : "User Added"}
                return result
            }

        }else{
            result = {"Message" : "User Not Found"}
        }
        return result

    },
    getRequestFriendlist: async (email)=>{
        let result = null;
        if (email !== "") result = await db.query("SELECT * FROM social_friend WHERE email_second = ? and status = 2", email);
        return result;
    },
    requestFriendlist: async (email,email_friend,request) =>{
        let result = null;
        let temp_main = await db.query(`SELECT * FROM social_friend WHERE email_first = '${email_friend}' and email_second = '${email}' and status = 2`)
        if(temp_main.length < 1){
            result = {"Message" : "User Not Found"}
            return result
        }
        if(request == 1){
            console.log(email)
            if(email_friend !== "") result = await db.query(`update social_friend set status = 1 where email_first = '${email_friend}' and email_second = '${email}' and status = 2`)
            result = {"Message" : "User Accepted"}
            return result
        }else{
            if(email_friend !== "") result = await db.query(`Delete from social_friend where email_first = '${email_friend}' and email_second = '${email}'`)
            result = {"Message" : "User Declined"}
            return result
        }
    },
    deletedFriendlist:async (username_friend) =>{

    },
    giftGame : async (username_friend,name_game)=>{

    }
}