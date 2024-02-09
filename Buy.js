//=========Call Variable =========//

const { readdirSync, readFileSync, writeFileSync, existsSync, copySync } = require("fs");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const semver = require('semver');
const login = require('facebook-chat-api')
const keep_alive = require('./keep_alive.js')

const client = new Object({
	commands: new Map(),
	events: new Map(),
	cooldowns: new Map(),
	threadSetting: new Map(),
	globalConfig: ""
});

const __GLOBAL = new Object({
	settings: new Array()
})


//check argv
let argv = process.argv.slice(2);

if (argv.length !== 0) client.globalConfig = argv[0];
else client.globalConfig = "./config.json";


//set config to __GLOBAL
 let config = require(`./${client.globalConfig}`);
if (!config || config.length == 0) return;
try {
	for (let [name, value] of Object.entries(config)) {
		__GLOBAL.settings[name] = value;
	}
}
catch (error) {
	return console(error);
}


//========= Get all command files =========//

const commandFiles = readdirSync(join(__dirname, "/modules/commands")).filter((file) => file.endsWith(".js") && !file.includes('example'));
for (const file of commandFiles) {
	var command = require(join(__dirname, "/modules/commands", `${file}`));
	try {
		if (!command.config || !command.run || !command.config.commandCategory) throw new Error(`Sai format!`);
		if (client.commands.has(command.config.name)) throw new Error('Bị trùng!');
		if (command.config.dependencies) {
			try {
				for (const i of command.config.dependencies) require.resolve(i);
			}
			catch (e) {
				console.log(`Không tìm thấy gói phụ trợ cho module ${command.config.name}, tiến hành cài đặt: ${command.config.dependencies.join(", ")}!`, "[ LOADER ]");
				execSync('npm install -s ' + command.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./modules/commands/${file}`)];
				console.log(`Đã cài đặt thành công toàn bộ gói phụ trợ cho module ${command.config.name}`, "[ LOADER ]");
			}
		}
        if (command.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(command.config.envConfig)) {
                    if (typeof __GLOBAL[command.config.name] == "undefined") __GLOBAL[command.config.name] = new Object();
                    if (typeof config[command.config.name] == "undefined") config[command.config.name] = new Object();
                    if (typeof config[command.config.name][key] !== "undefined") __GLOBAL[command.config.name][key] = config[command.config.name][key]
                    else __GLOBAL[command.config.name][key] = value || "";
                    if (typeof config[command.config.name][key] == "undefined") config[command.config.name][key] = value || "";
                }
                console.log(`Loaded config module ${command.config.name}`, "[ LOADER ]")
            } catch (error) {
                console.log(error);
                console.log(`Không thể tải config module ${command.config.name}`, "[ LOADER ]");
            }
        }
		client.commands.set(command.config.name, command);
		console.log(`Loaded command ${command.config.name}!`, "[ LOADER ]");
	}
	catch (error) {
		console.log(`Không thể load module command ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}


//========= Get all event files =========//

const eventFiles = readdirSync(join(__dirname, "/modules/events")).filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	var event = require(join(__dirname, "/modules/events", `${file}`));
	try {
		if (!event.config || !event.run) throw new Error(`Sai format!`);
		if (client.events.has(event.config.name)) throw new Error('Bị trùng!');
		if (event.config.dependencies) {
			try {
				for (let i of event.config.dependencies) require.resolve(i);
			}
			catch (e) {
				console.log(`Không tìm thấy gói phụ trợ cho module ${event.config.name}, tiến hành cài đặt: ${event.config.dependencies.join(", ")}!`, "[ LOADER ]");
				execSync('npm install -s ' + event.config.dependencies.join(" "));
				delete require.cache[require.resolve(`./modules/events/${file}`)];
				console.log(`Đã cài đặt thành công toàn bộ gói phụ trợ cho event module ${event.config.name}`, "[ LOADER ]");
			}
		}
        if (event.config.envConfig) {
            try {
                for (const [key, value] of Object.entries(event.config.envConfig)) {
                    if (typeof __GLOBAL[event.config.name] == "undefined") __GLOBAL[event.config.name] = new Object();
                    if (typeof config[event.config.name] == "undefined") config[event.config.name] = new Object();
                    if (typeof config[event.config.name][key] !== "undefined") __GLOBAL[event.config.name][key] = config[event.config.name][key]
                    else __GLOBAL[event.config.name][key] = value || "";
                    if (typeof config[event.config.name][key] == "undefined") config[event.config.name][key] = value || "";
                }
                console.log(`Loaded config event module ${event.config.name}`, "[ LOADER ]")
            } catch (error) {
                console.log(`Không thể tải config event module ${event.config.name}`, "[ LOADER ]");
            }
        }
		client.events.set(event.config.name, event);
		console.log(`Loaded event ${event.config.name}!`, "[ LOADER ]");
	}
	catch (error) {
		console.log(`Không thể load module event ${file} với lỗi: ${error.message}`, "[ LOADER ]");
	}
}

console.log(`Load thành công: ${client.commands.size} module commands | ${client.events.size} module events`, "[ LOADER ]")
writeFileSync(client.globalConfig, JSON.stringify(config, null, 4));


//========= Start Bot =========//

loginPath ={appState: JSON.parse(readFileSync(__dirname + "/appsate.json", 'utf8'))}
login(loginPath, (err, api) => {
    if (err) return console.log(err);

    let listen = require("./includes/listen")({ api, event,  client, __GLOBAL });
    api.setOptions({ listenEvents: true });
    let onListen = () => api.listenMqtt(listen);

    api.setOptions({
        forceLogin: true,
        listenEvents: true,
        logLevel: "error",
        updatePresence: false,
        selfListen: false
    });
    try {
        onListen();
        setInterval(() => {
            api.listenMqtt().stopListening();
            setTimeout(() => onListen(), 2000);
            if (__GLOBAL.settings.DEVELOP_MODE == true) {
                const moment = require("moment");
                var time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
                console.log(`[ ${time} ] Listen restarted`, "[ DEV MODE ]");
            }
        }, 1800000);
    }
    catch(e) {
        console.log(`${e.name}: ${e.message}`, "[ LISTEN ]")
    }
});

//THIZ BOT WAS MADE BY ME(BUY) - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯

