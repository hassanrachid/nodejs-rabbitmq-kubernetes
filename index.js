const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const amqp = require('amqplib/callback_api');
const queue = 'payload-queue';
const routes = require('./routes/v1');
const errorHandler = require('middleware/error-handler');

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use('/payload', require('./controllers/payload.controller'));

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8081;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});

 