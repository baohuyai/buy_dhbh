// module.exports.config = {
// 	name: "ping",
// 	version: "0.0.1",
// 	hasPermssion: 1,
// 	credits: "SpermLord",
// 	description: "tag toàn bộ thành viên",
// 	commandCategory: "Group",
// 	usages: "ping [Text]",
// 	cooldowns: 70,
// 	info: [
// 		{
// 			key: 'Text',
// 			prompt: 'Nội dung để ping, có thể để trống',
// 			type: 'Văn Bản',
// 			example: 'Mọi người ơi'
// 		}
// 	]
// };

// module.exports.run =  function({ api, event, args }) {
// 	let threadInfo =  api.getThreadInfo(event.threadID);
// 	let all = threadInfo.participantIDs;
// 	all.splice(all.indexOf(api.getCurrentUserID()), 1);
// 	all.splice(all.indexOf(event.senderID), 1);
// 	var body = args.join(" ") || '@everyone', mentions = [];
// 	for (let i = 0; i < all.length; i++) {
// 		if (i == body.length) body += body.charAt(body.length - 1);
// 		mentions.push({
// 			tag: body[i],
// 			id: all[i],
// 			fromIndex: i - 1
// 		});
// 	}
// 	api.sendMessage({ body: `‎${body}`, mentions }, event.threadID,  (err, info) => {
// 		 new Promise(resolve => setTimeout(resolve, 2 * 1000));
// 		api.deleteMessage(info.messageID);
// 	}, event.messageID);
// }