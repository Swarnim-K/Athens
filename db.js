const mongoose = require('mongoose');

// MongoDB Connection
const dbUrl = process.env.MONGODB_URI

main()
    .then(() => console.log("Connected successfully to Athens Database"))
    .catch(err => {
        console.log("Connected unsuccessful to Athens Database")
        console.log(err)
    });

async function main() {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

}