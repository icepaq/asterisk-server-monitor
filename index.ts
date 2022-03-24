import express from "express"
const exec = require('child-process-promise').exec;

const app = express()
const port = 3001

app.get('/asteriskcheck', async (req: express.Request, res: express.Response) => {
    const command = 'asterisk -x "core show channels"';
    const output = await exec(command);
    
    if (output.stderr) {
        res.json({status: 400, message: "Asterisk Service is Down"});
        return;
    }

    const split = output.stdout.split("\n");
    const info = {
        calls: split[2].split(" ")[0],
        processed: split[3].split(" ")[0],
    }

    const message = "Asterisk Service is Running | " + info.calls + " active calls | " + info.processed + " calls processed";

    console.log(message);
    res.json({status: 200, message: message});


    // const output = "Channel              Location             State   Application(Data)\n" +
    // "0 active channels\n" +
    // "0 active calls\n" +
    // "22 calls processed\n" +
    // "Asterisk ending (0).";
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})