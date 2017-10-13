const restify = require('restify');
const botbuilder = require('botbuilder');
const cognitiveservices = require('botbuilder-cognitiveservices');

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
let bot = new botbuilder.UniversalBot(connector);

let recognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: "5bbb7417-6f95-4e43-88e0-b788bca1eaa1",
    subscriptionKey: "a9340296dbd24b36a9950b994e6dd02b",
});

let qnaDialog = new cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    qnaThreshold: 0.3,
    defaultMessage: "Non trouvé"
});


bot.dialog("/", qnaDialog);