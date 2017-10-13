const createCard = {
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Create a new alarm",
                        "weight": "bolder",
                        "size": "medium"
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "id": "name",
                        "placeholder": "Alarm name",
                        "type": "Input.Text"
                    },
                    {
                        "id": "prog",
                        "type": "Input.Date"
                    }
                ]
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Create"
            }
        ]
    }
}

module.exports = createCard;