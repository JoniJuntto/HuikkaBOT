import tmi from "tmi.js";
import AlertCorrectGuess from "./AlertCorrect.js";
import "dotenv/config";
import authKey from "./constants.js";
console.log(authKey);
import DrinkinGame from "./DrinkingGame.js";

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
  if (self || !message.startsWith("!")) {
    return;
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

  switch (command) {
    case "kanyeortrump":
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
      break;
    case "howold":
      const name = message.split(" ")[1].toLowerCase();
      const response = await fetch("https://api.agify.io/?name=" + name);
      const data = await response.json();
      if (data.age < 18) {
        client.timeout(channel, tags.username, 100, "Veetit pois chatista :)");
      }
      client.say(
        channel,
        `@${tags.username}, ${name} is ${data.age} years old.`
      );
      break;
    case "roullette":
      const random = Math.floor(Math.random() * 6) + 1;
      if (random === 1) {
        client.say(channel, `@${tags.username}, You died.`);
        client.timeout(channel, tags.username, 100, "Lol kuolit läppää");
      } else {
        client.say(channel, `@${tags.username}, You survived.`);
      }
      break;
    case "liima":
      client.say(
        channel,
        `@${tags.username}, Ite oon impannut yhteensä varmaan kymmeniä tunteja ja oon 100% kunnossa vaikka oon impaanut varmaan 100 tuntiakin impannut.`
      );
      break;
    case "guess":
      const quess = message.split(" ")[1].toLowerCase();
      if (quess === answer[tags.username]) {
        client.say(channel, `@${tags.username} you guessed correctly!`);
        AlertCorrectGuess(tags.username);
      } else {
        client.say(channel, `@${tags.username} you guessed wrong!`);
      }
      break;
    case "wadap":
      client.say(
        channel,
        `@${tags.username}, Koodataan chattibottia Nodella, tehdään Twitch chattiin juomapeli. huikka1HI`
      );
      break;
    case "ikea":
      client.say(
        channel,
        `@${tags.username},Tänään meillä onkin erittäin mielenkiintoinen peli testissä 🤩, sain nimittäin ennakkoon tämmöisen Ikea simulaattorin kokeiluun 🤯. Täältähän löyty Ikea Family Keycard😱. Kokeilaas tätä toista ovee😰. Hui vitsi mä pelästyin😳 Äkkii pois täältä pandat hyökkää🫣! Yks tehtävä cräftää tää tästä. Vaaaaaaaaau🥳! Oohohoho nyt on hiiri käsi upgradettu😎. Pikku aimbotti tohon noin😤. Nyt on eka leveli päästy läpi🤭.`
      );
      break;
    case "ilmoittaudu":
      client.say(channel, `@${tags.username}, Olet ilmoittautunut juomapeliin.`);
      DrinkinGame(tags.username);
      break;
    default:
      console.log("Unknown command");
      break;
  }
});
