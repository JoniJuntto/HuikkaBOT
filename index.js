const tmi = require("tmi.js");
require("dotenv").config();
authKey = process.env.authkey;

const reputation = {};
const answer = {};
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "huikkakoodaa",
    password: authKey,
  },
  channels: ["huikkakoodaa"],
});

client.connect();

client.on("message", async (channel, tags, message, self) => {
  const reputationRegex = /(\+\+|--)/g;

  if (reputationRegex.test(message)) {
    const [user, operator] = message.split(reputationRegex);

    if (!(user in reputation)) {
      reputation[user] = 0;
    }

    if (operator === "++") {
      reputation[user]++;
    } else {
      reputation[user]--;
    }
    client.say(
      channel,
      `@${tags.username}, ${user} now has a reputation of ${reputation[user]}`
    );
    return;
  }

  if (self || !message.startsWith("!")) {
    return;
  }

  if (message.startsWith("!guess")) {
    const quess = message.split(" ")[1].toLowerCase();
    const user = tags.username;
    if (quess === answer[tags.username]) {
      client.say(channel, `@${tags.username} you guessed correctly!`);
      return;
    }
  }

  

  const args = message.slice(1).split(" ");
  const command = args.shift().toLowerCase();

  const fetchKanye = async () => {
    const response = await fetch("https://api.kanye.rest");
    const data = await response.json();
    return data.quote;
  };
  const fetchTrump = async () => {
    const response = await fetch(
      "https://api.whatdoestrumpthink.com/api/v1/quotes/random"
    );
    const data = await response.json();
    return data.message;
  };

  if (command === "echo") {
    client.say(channel, `@${tags.username}, you said: "${args.join(" ")}"`);
  } else if (command === "kanyeortrump") {
    const result = Math.floor(Math.random() * 2) + 1;
    console.log(result);
    if (result === 1) {
      answer[tags.username] = "kanye";
      const quote = await fetchKanye();
      client.say(channel, `Kanye or Trump: ${quote}`);
    } else {
      answer[tags.username] = "trump";
      const quote = await fetchTrump();
      client.say(channel, `Kanye or Trump: ${quote}`);
    }
  } else if (command === "howold") {
    const name = message.split(" ")[1].toLowerCase();
    const response = await fetch("https://api.agify.io/?name=" + name);
    const data = await response.json();
    if (data.age < 18) {
      client.timeout(channel, tags.username,100, "Veetit pois chatista :)");
    }
    client.say(channel, `@${tags.username}, ${name} is ${data.age} years old.`);
  } else if (command === "unban") {
    const name = message.split(" ")[1].toLowerCase();
    client.unban(channel, name);
    client.say(channel, `@${tags.username}, ${name} has been unbanned.`);
  } else if (command === "roulette") {
    const result = Math.floor(Math.random() * 6) + 1;
    if (result === 1) {
      client.say(channel, `@${tags.username}, You died.`);
      client.timeout(channel, tags.username,100, "Lol kuolit läppää");
    } else {
      client.say(channel, `@${tags.username}, You survived.`);
    }
  }
  else if (command === 'bits'){
    client.say(channel, `@${tags.username}, you have ${tags.bits} bits.`);
  }
});
