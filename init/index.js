// save all the data into the wanderlust Data base kuch nhi bus hm isme sara data apne dataBase meh store kr rhe hai only

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listen = require("../models/listening.js");

main()
    .then(res => {
        console.log("connected to DB");
    })
    .catch(err => {
        console.log("errer is formed");
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wenderlust');
}

const initDB = async () => {
    await Listen.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: '6736f31704d6b6b36ba51c93',
    }));
    await Listen.insertMany(initData.data);
    console.log("data was saved");
};
initDB();