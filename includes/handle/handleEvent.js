module.exports = function({ api, __GLOBAL, client, Users, Threads, Currencies }) {
	return async function({ event }) {

		let timeStart = Date.now();
		let { senderID, threadID } = event;
		senderID = parseInt(senderID);
		threadID = parseInt(threadID);
		// if (client.userBanned.has(senderID) || client.threadBanned.has(threadID)) return;
		for (let [key, value] of client.events.entries()) {
			if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
				const eventRun = client.events.get(key);
				try {
					eventRun.run({ api,event, __GLOBAL, client, Users, Threads, Currencies });
					if (__GLOBAL.settings.DEVELOP_MODE == true) {
						const moment = require("moment");
						var time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
						console.log(`[ ${time} ] Event Executed: ${eventRun.config.name} | Group: ${threadID} | Process Time: ${(Date.now()) - timeStart}ms`, "[ DEV MODE ]");
					}
				}
				catch (error) {
					console.log(error + " at event: " + eventRun.config.name , 2);
				}
				return;
			};
		}
	}
}