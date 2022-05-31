const { default: axios } = require("axios");
const db = require("../database");

module.exports = {
    get: async (name) => {
        let querySearch = `https://www.freetogame.com/api/games?platform=pc`;
        let resultGet = await axios.get(querySearch);
        let data = resultGet.data;
        let arrdata = [];

        for (let i = 0; i < data.length; i++) {
            arrdata.push({
                id: data[i].id,
                title: data[i].title,
                genre: data[i].genre,
                harga: "Rp 20000.",
            });
        }

        if (name == "") {
            return arrdata;
        }
        else if (name != "") {
            for (let i = 0; i < arrdata.length; i++) {
                if(String(arrdata[i].title).toLowerCase().includes(String(name).toLowerCase()))
                    return arrdata[i];
            }
        }
    },
    detail: async (id) => {
        let querySearch = `https://www.freetogame.com/api/games?platform=pc`;
        let resultGet = await axios.get(querySearch);
        let data = resultGet.data;
        let arrdata = [];

        console.log(data);

        for (let i = 0; i < data.length; i++) {
            let deskripsi="";
            if(String(data[i].short_description).toLowerCase().includes("a free-to-play,"))
            { deskripsi=String(data[i].short_description).toLowerCase().replace('a free-to-play,',""); }
            else if(String(data[i].short_description).toLowerCase().includes("a free-to-play"))
            { deskripsi=String(data[i].short_description).toLowerCase().replace('a free-to-play',""); }
            else if(String(data[i].short_description).toLowerCase().includes("free-to-play"))
            { deskripsi=String(data[i].short_description).toLowerCase().replace('free-to-play',""); }
            else if(String(data[i].short_description).toLowerCase().includes("free to play"))
            { deskripsi=String(data[i].short_description).toLowerCase().replace('free to play',"");}
            else
            { deskripsi=String(data[i].short_description);}
            
            arrdata.push({
                id: data[i].id,
                title: data[i].title,
                descripsi: deskripsi,
                genre: data[i].genre,
                publisher:data[i].publisher,
                developer:data[i].developer,
                release_date:data[i].release_date,
                harga_game: "Rp 20000."
            });
        }

        if (id != "") {
            for (let i = 0; i < arrdata.length; i++) {
                if(String(arrdata[i].id).toLowerCase().includes(String(id).toLowerCase()))
                    return arrdata[i];
            }
        }
    }

    

    
}



