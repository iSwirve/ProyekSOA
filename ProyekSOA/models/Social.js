
const db = require("../database");


module.exports = {
    getFriendlist: async() => {
        let result = null;
        // if (email !== "") result = await db.query("SELECT * FROM users WHERE username = ?", email);
        // else result = await db.query("SELECT * FROM users");
        return result;
    },
    addFriendlist: async (username_friend) =>{

    },
    deleteFriendlist: async (username_friend) =>{

    },
    giftGame : async (username_friend,name_game)=>{

    }
}