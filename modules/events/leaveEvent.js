module.exports.config = {
	name: "leaveEvents",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

module.exports.run =  function({ api, event, Users, Threads, client }) {
	let name, msg, formPush
	// const { createReadStream, existsSync, mkdirSync } = require("fs-extra");;
	// let settings = client.threadSetting.get(event.threadID) || {};//(await Threads.getData(event.threadID)).settings;
	// try {
	// 	name = ( Users.getData(event.logMessageData.leftParticipantFbId)).name;
	// 	if (typeof name == "undefined") throw Error();	
	// }
	// catch {
	// 	name = ( api.getUserInfo(event.logMessageData.leftParticipantFbId))[event.logMessageData.leftParticipantFbId].name;
	// }
	api.getUserInfo(event.logMessageData['leftParticipantFbId'], (err, info) => {

	// let settings = client.threadSetting.get(event.threadID) || {};//(await Threads.getData(event.threadID)).settings;
	console.log(settings);
	name = info[event.logMessageData['leftParticipantFbId']].name;//[event.logMessageData.leftParticipantFbId].name
	console.log(name);
	let type = (event.author == event.logMessageData.leftParticipantFbId) ? "tự rời" : "bị quản trị viên đá";
	(typeof settings.customLeave == "undefined") ? msg = "{name} Đã {type} khỏi nhóm" : msg = settings.customLeave;
	msg = msg
	.replace(/\{name}/g, name)
	.replace(/\{type}/g, type);

	

	// let dirGif = __dirname + `/cache/leaveGif/`;
	// if (existsSync(dirGif)) mkdirSync(dirGif, { recursive: true })
	// if (existsSync(dirGif + `${event.threadID}.gif`)) formPush = { body: msg, attachment: createReadStream(dirGif + `${event.threadID}.gif`) }
	// else formPush = { body: msg }
	formPush = { body: msg }
	return api.sendMessage(formPush, event.threadID);
	});
}