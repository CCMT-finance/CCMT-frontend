// server.js
import next from "next";
import express from "express";
import {JSONFile, Low} from 'lowdb'
// import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

(async () => {
    const dev = process.env.NODE_ENV !== 'production'
    const port = 3000
// when using middleware `hostname` and `port` must be provided below
    const nextApp = next({dev, port})
    const handle = nextApp.getRequestHandler()
    const adapter = new JSONFile(path.resolve("db.json"))
    const db = new Low(adapter)

    await db.read()
    db.data ||= {propositions: []}

    const app = express()
    // app.use(cors())
    app.use(bodyParser.json())

    // https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png
    const apiRouter = express.Router();
    apiRouter.get("/list", (req, res) => {
        res.send(JSON.stringify(db.data))
    })
    apiRouter.put("/add", async (req, res) => {
        try {
            const data = req.body
            db.data.propositions.push({...data, id: db.data.propositions.length})
            await db.write()
            res.send("OK")
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    })
    apiRouter.delete("/remove", async (req, res) => {
        try {
            const data = req.body
            db.data.propositions.splice(data.id, 1)
            await db.write()
            res.send("OK")
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    })
    apiRouter.post("/setdata", async (req, res) => {
        try {
            const data = req.body
            const proposition = db.data.propositions.find(proposition => proposition.id === data.id)
            db.data.propositions = [
                ...db.data.propositions.filter(proposition => proposition.id !== data.id),
                {
                    ...proposition,
                    ...data,
                    id: proposition.id
                }
            ].sort((a,b) => a.id - b.id)
            await db.write()
            res.send("OK")
        } catch (e) {
            console.error(e)
            res.sendStatus(500)
        }
    })
    app.use("/api", apiRouter)
    app.all("*", (req, res) => {
        return handle(req, res, undefined)
    })

    await nextApp.prepare();
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})();