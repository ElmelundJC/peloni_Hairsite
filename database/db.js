const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);


mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => console.log('DB connection successful!'));
