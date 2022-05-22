const { default: axios } = require("axios");
const db = require("../database");

module.exports = {
    get: async (name) => {
        let querySearch = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json`;
        let resultGet = await axios.get(querySearch);
        let data = resultGet.data.applist;
        let arrdata = [];

        if (name == "") {
            for (let i = 0; i < data.apps.length; i++) {
                let result = String(data.apps[i].name).toLowerCase().includes("test");
                if (data.apps[i].name != "" && !result) {
                    arrdata.push({
                        id: data.apps[i].appid,
                        name: data.apps[i].name
                    });
                }
            }
            return arrdata;
        }
        else if (name != "") {
            let appid = -1;
            for (let i = 0; i < data.apps.length; i++) {
                if (String(data.apps[i].name).toLowerCase() == name.toLowerCase()) {
                    appid = data.apps[i].appid;
                }
            }
            let query = `https://store.steampowered.com/api/appdetails?appids=${appid}`;

            let result = await axios.get(query);
            let dataRet = result.data[appid];
            return dataRet;
        }
    }
}



