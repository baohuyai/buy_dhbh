module.exports.config = {
	name: "joinEvents",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events",
	dependencies: ["request"]
};

module.exports.run =  function({ api, event, __GLOBAL, client }) {
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`[ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "Bot của cu Lô (ĐHBH)" : __GLOBAL.settings.BOTNAME}`, event.threadID, api.getCurrentUserID());
		api.sendMessage(`Gia nhập thành công! Bot này được làm bởi cu Lô\nCảm ơn vì đã mời, chúc mộ ngày vui vẻ UwU <3`, event.threadID);
	}
	else {
		api.getThreadInfo(event.threadID, (err, info) => {

			// Lấy thông tin nhóm và thiết lập
			threadName = info.threadName
			settings = client.threadSetting.get(event.threadID) || {}
			// dirGif = __dirname + `/cache/joinGif/`
			let msg, formPush

			// Duyệt qua danh sách thành viên mới
			var mentions = [], nameArray = [], memLength = [];
			for (var i = 0; i < event.logMessageData.addedParticipants.length; i++) {
			let id = event.logMessageData.addedParticipants[i].userFbId;
			let userName = event.logMessageData.addedParticipants[i].fullName;
			nameArray.push(userName);
			mentions.push({ tag: userName, id });
			memLength.push(info.participantIDs.length - i);
			}
			

		// Sắp xếp thứ tự tham gia theo giảm dần (thành viên mới nhất ở đầu)
		memLength.sort((a, b) => a - b);
		
		(typeof settings.customJoin == "undefined") ? msg = "Queo Com {name}.\nChào mừng đã đến với {threadName}.\n{type} là thành viên thứ {soThanhVien} của nhóm 🥳" : msg = settings.customJoin;
		msg = msg
		.replace(/\{name}/g, nameArray.join(', '))
		.replace(/\{type}/g, (memLength.length > 1) ?  'các bạn' : 'bạn')
		.replace(/\{soThanhVien}/g, memLength.join(', '))
		.replace(/\{threadName}/g, threadName);
		// if (existsSync(dirGif)) mkdirSync(dirGif, { recursive: true });
		// if (existsSync(dirGif + `${event.threadID}.gif`)) formPush = { body: msg, attachment: createReadStream(dirGif + `${event.threadID}.gif`), mentions }
		// else formPush = { body: msg, mentions }
		formPush = { body: msg, mentions }
		return api.sendMessage(formPush, event.threadID);


		});

		 
	}
}