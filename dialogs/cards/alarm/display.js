const prettifyDate = require('../../../helpers/date-parser');

const displayCard = ({name, prog, created_on, created_by}) => ({
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
						"text": name,
						"weight": "bolder",
						"size": "medium"
					}
				]
			},
			{
				"type": "Container",
				"items": [
					{
						"type": "FactSet",
						"facts": [
							{
								"title": "Set to ring on:",
								"value": prettifyDate(prog)
							},
							{
								"title": "Created on:",
								"value": prettifyDate(new Date(created_on))
							},
							{
								"title": "Created by:",
								"value": created_by.name
							}
						]
					}
				]
			}
		]
	}
});

module.exports = displayCard;