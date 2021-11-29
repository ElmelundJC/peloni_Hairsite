const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
// const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful!'));
