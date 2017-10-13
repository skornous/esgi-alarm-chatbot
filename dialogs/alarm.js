const botbuilder = require('botbuilder');
// Cards doesn't handle hours in the dates yet so we'll leave it here for now
// const createAlarmCard = require('./cards/alarm/create');
const displayAlarmCard = require('./cards/alarm/display');
const displaySmallAlarmCard = require('./cards/alarm/small-display');
const prettifyDate = require('../helpers/date-parser');

const lib = new botbuilder.Library('alarm');


lib.dialog('create', [
    // Ask alarm name
    (session, args) => {
        session.dialogData.alarm = {};
        botbuilder.Prompts.text(session, "How do you want to name you alarm ?");
    },
    // Ask alarm date
    (session, args) => {
        session.dialogData.alarm.name = args.response;
        botbuilder.Prompts.time(session, "When should it ring ?");
    },
    // Summary
    (session, args) => {
        session.dialogData.alarm.prog = botbuilder.EntityRecognizer.resolveTime([args.response]);
        session.dialogData.alarm.created_by = session.message.address.user;
        session.dialogData.alarm.created_on = Date.now();
        session.send(`Alarm registered as "${session.dialogData.alarm.name}" to ring on ${prettifyDate(session.dialogData.alarm.prog)}`);
        session.endDialogWithResult(session.dialogData.alarm);
    },
]).cancelAction(
    "cancelCreateAlarm",
    "Alarm registration cancelled.",
    {
        confirmPrompt: "Canceling your alarm creation will lose all information you've entered so far.<br>Are you that you don't want to create your alarm anymore ?",
        matches: /cancel/i
    }
);

lib.dialog('show', (session, args) => {
    if (args) {
        let card = displayAlarmCard(args);
        session.send(new botbuilder.Message(session).addAttachment(card));
    }
    session.endConversation();
});

lib.dialog('list', session => {
    if (!session.userData.alarms || session.userData.alarms.length === 0) {
        session.send("You've never created any alarms");
    } else {
        const alarms = session.userData.alarms;
        const alarmsSize = alarms.length;
        for (let i = 0 ; i < alarmsSize ; i++) {
            const alarmCard = displaySmallAlarmCard(alarms[i]);
            session.send(new botbuilder.Message(session).addAttachment(alarmCard));
        }
    }
    session.endConversation();
});

lib.dialog('help', session => {
    session.send(`You can type :<br>
        - "Create": to create a new alarm<br>
        - "List": to list the current actives alarms<br>
        - "Show": to display an alarm<br>
        - "Help": to display this help message`);
    session.endDialog();
});

module.exports = lib;