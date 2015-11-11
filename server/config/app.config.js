module.exports = {
    name: 'chatR',
    description: 'Chat application',
    secret: '4Kazpve42hjHB2HmYBqE',
    development: {
        port: 5676,
        database: 'mongodb://localhost/chatR'
    },
    production: {
        port: 5676,
        database: 'mongodb://localhost/chatR'
    }
};