module.exports = function({ api, event, client, __GLOBAL  }) {

	console.log(__GLOBAL.settings.PREFIX || "[none]", "[ PREFIX ]");
	console.log(`${api.getCurrentUserID()} - [ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "This bot was made by Buy (ĐHBH)" : __GLOBAL.settings.BOTNAME}`, "[ UID ]");
	console.log("Connected to Messenger\nThis source code was made by Buy(ĐHBH) , please do not delete this credits!", "[ SYSTEM ]");
	
	const Users = '100038896995918',
				Threads = '100038896995918',
				Currencies = ''
	
	const utils = require("../utils/funcs.js")({ api, __GLOBAL, client });
	const handleCommand = require("./handle/handleCommand.js")({ api, __GLOBAL, client,  Users, Threads, Currencies, utils });
	const handleEvent = require("./handle/handleEvent")({ api, __GLOBAL, client, Users, Threads, Currencies });
	const handleChangeName = require("./handle/handleChangeName")({ api, __GLOBAL, client });

	//console.log(api)
	// console.log(client)
	// console.log('================================')
	// console.log(__GLOBAL)


	return (error, event) => {
		
		if (error) console.log(JSON.stringify(error), 2);
		// if (client.event && JSON.stringify(client.event) == JSON.stringify(event) || event.messageID && client.messageID == event.messageID || typeof event.messageID == "undefined") ""
		else {
			client.event = event;
			client.messageID = event.messageID;
			try {
				switch (event.type) {
					case "message":
					case "message_reply": 
						
						handleCommand({ event })
						handleChangeName({ event })
						break;
					case "event":
						
						handleEvent({ event })
						break;
					default:
						break;
				}
			}
			catch (e) {
				""
			}
			if (__GLOBAL.settings.DEVELOP_MODE == true) console.log(event);
		}
	}
}
//THIZ BOT WAS MADE BY ME(BUY) - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯