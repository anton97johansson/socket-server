const express = require('express');
// const { MongoClient } = require("mongodb");
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri);
const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/chat";
io.origins(['https://antonscript.me:443']);

io.on('connection', async function (socket) {
    var time = new Date().toLocaleString();
    console.info("User connected");
    io.emit('chat message', `[${time}] User connected`);
    // await insertToCol(`[${time}] User connected`).catch(console.dir);

    socket.on('chat message', async function (message) {
        message["time"] = new Date().toLocaleString();
        io.emit('chat message', `[${message["time"]}] ${message["nick"]}: ${message["msg"]}`);
        console.info(message);
        await insertToCol(`[${message["time"]}] ${message["nick"]}: ${message["msg"]}`).catch(console.dir);
    });
});

server.listen(8300);

async function insertToCol(msg) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection("messages");
    const result = await col.insertOne({ message: msg });
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
    await client.close();
}

