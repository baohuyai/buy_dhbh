// module.exports.config = {
// 	name: "sim",
// 	version: "1.0.0",
// 	hasPermssion: 0,
// 	credits: "CatalizCS",
// 	description: "Trò chuyện cùng con sim mất dạy nhất quả đất",
// 	commandCategory: "Chatbot",
// 	usages: "sim [Text]",
// 	cooldowns: 5,
// 	dependencies: ["request"],
// 	info: [
// 		{
// 			key: "Text",
// 			prompt: "Lời muốn nói chuyện với em ấy",
// 			type: 'Văn bản',
// 			example: 'Hello Em'
// 		}
// 	]
// };

// module.exports.run = async ({ api, event, args }) => {
// 	return require("request")(`http://api.simsimi.tk/sim/${encodeURIComponent(args.join(" "))}`, (err, response, body) => api.sendMessage(JSON.parse(body).out, event.threadID, event.messageID));
// }