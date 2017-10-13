const botbuilder = require('botbuilder');

const lib = new botbuilder.Library('reservation'); 

lib.dialog('hotel', [
    // Greetings
    (session, args, next) => {
        session.send("Welcome to your hotel reservation chat !");
        next();
    },
    // Ask name
    (session, args) => {
        botbuilder.Prompts.text(session, "Under what name will your reservation be ?");
    },
    // Ask email
    (session, args) => {
        session.userData.name = args.response;
        botbuilder.Prompts.text(session, "With what email address would you like to do your reservation ?");
    },
    // Ask age
    (session, args) => {
        session.userData.email = args.response;
        botbuilder.Prompts.number(session, "How old are you ?");
    },
    // Ask destination
    (session, args) => {
        session.userData.age = args.response;
        botbuilder.Prompts.text(session, "What is your destination ?");
    },
    // Ask check-in date
    (session, args) => {
        session.userData.destination = args.response;
        botbuilder.Prompts.time(session, "When would you like to check in ?");
    },
    // Ask nb night stay
    (session, args) => {
        session.userData.checkIn = botbuilder.EntityRecognizer.resolveTime([args.response]);
        botbuilder.Prompts.number(session, "How long will you stay (in days) ?");
    },
    // Summary
    (session, args) => {
        session.userData.nbNights = args.response;
        session.send(
            `Let me sum it up :<br>`
            + `${session.userData.name}, ${session.userData.age} years old, will arrive on ${session.userData.checkIn} for ${session.userData.nbNights} days.<br>`
            + `Your destination is : "${session.userData.destination}".<br>`
            + `We can join you at ${session.userData.email}`
    );
        session.endDialogWithResult(session.userData);
    },
]).cancelAction(
    "cancelHotelRegistration",
    "Canceling your reservation will lose all information you've entered so far.",
    {
        matches: /cancel/
    }
);

module.exports = lib;