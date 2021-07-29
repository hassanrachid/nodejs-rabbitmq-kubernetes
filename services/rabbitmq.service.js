import amqp from 'amqplib/callback_api';

const url = 'amqp://guest:guest@rabbitmq-0.rabbitmq.default.svc.cluster.local:5672';
let ch = null;

amqp.connect(CONN_URL, function (err, conn) {
   conn.createChannel(function (err, channel) {
      ch = channel;
   });
});

export const publishToQueue = async (queueName, data) => {
   ch.sendToQueue(queueName, new Buffer(data));
}

process.on('exit', (code) => {
   ch.close();
   console.log(`Closing channel...`);
});