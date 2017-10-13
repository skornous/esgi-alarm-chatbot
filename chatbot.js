const restify = require('restify');
const botbuilder = require('botbuilder');

// restify server setup
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function(){
    console.log(`${server.name} bot started at ${server.url}`);
});

// create chat connector
let connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// listening for user inputs
server.post('/api/messages', connector.listen());

// reply by echoing
let bot = new botbuilder.UniversalBot(connector, [
    function(session) {
        session.beginDialog('reservation:hotel');
    },
    function(session, args) {
        session.endConversation("See you soon!");
    }
]);

// bot.on('conversationUpdate', e => {
//     if (e.membersAdded[0].name === "User") {
        
//     }
// });

bot.on('conversationUpdate', message => {
    if (message.membersAdded && message.membersAdded.length > 0) {
        message.membersAdded.map(x => {
            // Check if not a bot
            if (x.id != message.address.bot.id) {
                // User info
                const membersAdded = x.name || ' ' + '(Id=' + x.id + ' )';
                bot.send(new botbuilder.Message()
                    .address(message.address)
                    .text('Welcome to the hotel reservation ' + membersAdded)
                );
            }
        }).join(', ');
    }
});

bot.library(require('./dialogs/hotel'));
