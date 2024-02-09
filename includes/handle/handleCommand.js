const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stringSimilarity = require('string-similarity');

module.exports = function({ api, __GLOBAL, client, Users, Threads, Currencies, utils }) {
	return function({ event }) {
		console.log(event)
		//Xử lý sự kiện tin nhắn
		var timeStart = Date.now();
		let { body: contentMessage, senderID, threadID, messageID } = event;
		senderID = parseInt(senderID);
		threadID = parseInt(threadID);
		// if (client.userBanned.has(senderID) || client.threadBanned.has(threadID) || senderID == threadID) return;
		var threadSetting = client.threadSetting.get(threadID) || {};
		var prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX )})\\s*`);
		if (!prefixRegex.test(contentMessage)) return;
		console.log('Xử lý sự kiện tin nhắn')

		//=========Get command user use=========//

		var [matchedPrefix] = contentMessage.match(prefixRegex);
		var args = contentMessage.slice(matchedPrefix.length).trim().split(/ +/);
		var commandName = args.shift().toLowerCase();
		var command = client.commands.get(commandName);
		if (!command) {
			var allCommandName = [];
			var commandValues = client.commands.values();
			for (let cmd of commandValues) allCommandName.push(cmd.config.name);
			var checker = stringSimilarity.findBestMatch(commandName, allCommandName);
			if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
			else return api.setMessageReaction('❌', event.messageID, (err) => (err) ? console.log('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
		}

		//========= Check permssion =========//
		
		if (command.config.hasPermssion == 2 && !__GLOBAL.settings.ADMINBOT.includes(senderID)) return api.sendMessage(`❌ Bạn không đủ quyền hạn người điều hành bot đề sử dụng lệnh ${command.config.name}`, threadID, messageID);
		if (command.config.hasPermssion == 1 && !__GLOBAL.settings.ADMINBOT.includes(senderID) ) return api.sendMessage(`❌ Bạn không đủ quyền hạn đề sử dụng lệnh ${command.config.name}`, threadID, messageID);

		//=========Check cooldown=========//

		if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
		let now = Date.now();
		let timestamps = client.cooldowns.get(command.config.name);
		let cooldownAmount = (command.config.cooldowns || 1) * 1000;
		if (timestamps.has(senderID)) {
			let expirationTime = timestamps.get(senderID) + cooldownAmount;
			if (now < expirationTime) {
				let timeLeft = (expirationTime - now) / 1000;
				return api.setMessageReaction('⏱', event.messageID, (err) => (err) ? console.log('Đã có lỗi xảy ra khi thực thi setMessageReaction', 2) : '', true);
			}
		}
		timestamps.set(senderID, now);
		setTimeout(() => timestamps.delete(senderID), cooldownAmount)
	

		//========= Run command =========//
		try {
			command.run({ api, __GLOBAL, client, event, args, Users, Threads, Currencies, utils });
			console.log(command);
		}
		catch (error) {
			console.log(error + " tại lệnh: " + command.config.name, 2);
			api.sendMessage("Đã có lỗi xảy ra khi thực khi lệnh đó. Lỗi: " + error, threadID);
		}
		if (__GLOBAL.settings.DEVELOP_MODE == true) {
			const moment = require("moment");
			var time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
			console.log(`[ ${time} ] Command Executed: ${commandName} | User: ${senderID} | Arguments: ${args.join(" ")} | Group: ${threadID} | Process Time: ${(Date.now()) - timeStart}ms`, "[ DEV MODE ]");
		}
	}
}