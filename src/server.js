const mongoose = require("mongoose")
const config = require("./config")
const app = require("./app")



async function bootstrap() {
    try {
        mongoose.connect(config.database_url)
        console.log(`Database Connected`)
        app.listen(config.port, () => {
            console.log(`KinbaaNaki Website listening on port ${config.port}`)
        })
    } catch (err) {
        console.log(`Error occured`, err)
    }
}

bootstrap().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello From KinbaaNaki Server');
});
