module.exports = {
    name: 'chatR',
    description: 'Chat application',
    development: {
        port: 5676,
        database: 'mongodb://localhost/chatR'
    },
    production: {
        port: 5676,
        database: 'mongodb://localhost/chatR'
    }
};