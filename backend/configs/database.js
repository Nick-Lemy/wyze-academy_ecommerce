import { connect } from "mongoose"
import { MONGODB_URL } from "./variables.js";
connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log(`DB CONNECTED SUCCESSFULLY`))
    .catch(err => {
        console.log(`DB CONNECTION FAILED`)
        console.log(err)
        process.exit(1)
    })