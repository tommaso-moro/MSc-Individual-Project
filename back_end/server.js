const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const db_address = process.env.MONGO_DB_ADDRESS
const db_name = encodeURIComponent(process.env.MONGO_DB_NAME)
const db_username = encodeURIComponent(process.env.MONGO_DB_USERNAME)
const db_password = encodeURIComponent(process.env.MONGO_DB_PASSWORD)
const auth_mechanism = "SCRAM-SHA-1";

app.use(cors());
app.use(express.json());

const uri = 'mongodb://' + db_username + ':' + db_password + '@' + db_address + '/' + db_name 

mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
})

const monthlyBatchesRouter = require('./routes/monthly_batches')
app.use('/monthly_batches', monthlyBatchesRouter);

app.listen(port, () => {
    console.log('Server is running on port', port);
});

