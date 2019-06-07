const mongoose = require('mongoose');
const dbPath = require('./conf').dbPath;

module.export = database = () => {
    mongoose.set('debug', false);

    mongoose.connect(dbPath, { useNewUrlParser: true});

    mongoose.connection.on('disconnected', () => {
        mongoose.connect(dbPath);
    });

    mongoose.connection.on('error', err => console.log(err));

    mongoose.connection.on('open', async () => console.log('mongo:', dbPath));
}