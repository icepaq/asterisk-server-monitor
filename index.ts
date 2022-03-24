import express from "express"
const { exec } = require('child_process');

const app = express()
const port = 3001

app.get('/asteriskcheck', (req: express.Request, res: express.Response) => {
    const command = 'asterisk -x "core show channels"';
    const output = exec(command, (err: any, stdout: any, stderr: any) => {
        if (err) {
            return "Error";
        }
        
        return stdout;
    });

    // const output = "Channel              Location             State   Application(Data)\n" +
    // "0 active channels\n" +
    // "0 active calls\n" +
    // "22 calls processed\n" +
    // "Asterisk ending (0).";

    if (output === "Error") {
        res.json({status: 400, message: "Asterisk Service is Down"});
        return;
    }

    const split = output.split("\n");
    const info = {
        calls: split[2].split(" ")[0],
        processed: split[3].split(" ")[0],
    }

    const message = "Asterisk Service is Running | " + info.calls + " active calls | " + info.processed + " calls processed";

    res.json({status: 200, message: message});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})