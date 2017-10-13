const restify = require('restify');
const botbuilder = require('botbuilder');

let alarms = [];

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
server.post('/alarm', connector.listen());

// reply by echoing
let bot = new botbuilder.UniversalBot(connector, session => {
    session.send("Input not understood, did you meant \"help\" ?");
});

// Greeting message on user connection
bot.on('conversationUpdate', message => {
    if (message.membersAdded && message.membersAdded.length > 0) {
        message.membersAdded.map(x => {
            // Check if not a bot
            if (x.id != message.address.bot.id) {
                // User info
                const membersAdded = x.name || ' ' + '(Id=' + x.id + ' )';
                bot.send(new botbuilder.Message()
                    .address(message.address)
                    .text(`Welcome ${membersAdded}, this is your personnal alarm clock panel control.<br>Type "help" to display the help menu or the command you'd like to use to start.`)
                );
            }
        }).join(', ');
    }
});

// Load alarm library
bot.library(require('./dialogs/alarm'));

bot.dialog("help", session => {
    session.beginDialog("alarm:help");
}).triggerAction({
    matches: /help/i
});

bot.dialog('createAlarm', [
    (session, args) => {
        session.beginDialog('alarm:create');
    },
    (session, args) => {
        alarms.push(args);
        session.endDialog();
    }
]).triggerAction({
    matches: /^create/i
})

bot.dialog("showAlarm", [
    (session, args) => {
        const wordsThatArentShow = args.intent.matched.input.split(' ').slice(-1);
        const alarmsSize = alarms.length; // avoid recalculating the length of the array on every loop
        let matchingAlarm = null;
        console.log(wordsThatArentShow);
        for (let i = 0 ; i < alarmsSize ; i++) {
            if (wordsThatArentShow.includes(alarms[i].name)) {
                matchingAlarm = alarms[i];
            }
        }
        session.beginDialog("alarm:show", matchingAlarm);
    },
    (session, args) => {
        console.log("'''''''''''''''''''''''''''''''''''")
        console.log(args);
        console.log("'''''''''''''''''''''''''''''''''''")
    }
]).triggerAction({
    matches: /^show/i
});