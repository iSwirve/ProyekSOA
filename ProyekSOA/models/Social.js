
const db = require("../database");


module.exports = {
    getFriendlist: async(email = "") => {
        let result = null;
        if (email !== "") result = await db.query("SELECT email_second,status FROM social_friend WHERE email_first = ?", email);
        return result;
    },
    addFriendlist: async (email,email_friend) =>{
        let result = null;
        let temp = await db.query("select * from users where email = ?",email_friend)
        if(temp.length > 0){
            let obj = {
                email_second : email_friend,
                email_first : email,
                status : 4
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

        }
        return result

    },
    getRequestFriendlist: async (username_friend)=>{

    },
    requestFriendlist: async (username_friend) =>{

    },
    deletedFriendlist:async (username_friend) =>{

    },
    giftGame : async (username_friend,name_game)=>{

    }
}