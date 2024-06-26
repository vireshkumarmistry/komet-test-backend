const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { default: axios } = require('axios');
const colors = require('colors')
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

app.use(cors());
io.on('connection', async (socket) => {
    console.log(colors.yellow('Backend connecting...'));
    console.log(colors.green('Backend connected...'));
    socket.on('disconnect', () => {
        console.log(colors.red('Backend disconnected...'));
    });
});

app.get('/get-trade-details', async (req, res) => {
    const connectionRes = await axios.get('https://3pmbgqbzpbuvr2gfkstiinblsm0pvpdh.lambda-url.ap-south-1.on.aws');
    if (connectionRes.status === 200) {
        io.emit('event', connectionRes.data);
        console.log(colors.red.bgYellow("Successfully Replicated Master Trade..."))
        res.status(200).json(
            {
                success: true,
                data: connectionRes.data
            }
        );
    }
    else {
        console.log(colors.yellow.bgRed("Failed to Replicate Master Trade..."))
        res.status(400).json({ success: false });
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});