import tmi from "tmi.js";
import AlertCorrectGuess from "./AlertCorrect.js";
import "dotenv/config";
import authKey from "./constants.js";
console.log(authKey);
import DrinkinGame from "./DrinkingGame.js";
import localStorage from "local-storage";

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
  const pollResult = []; //array for poll results

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
        `@${tags.username}, Koodataan yhteiskäyttökahvipaketti-sivusto ja sille bäkkäri. huikka1Moi`
      );
      break;
    case "ikea":
      client.say(
        channel,
        `@${tags.username},Tänään meillä onkin erittäin mielenkiintoinen peli testissä 🤩, sain nimittäin ennakkoon tämmöisen Ikea simulaattorin kokeiluun 🤯. Täältähän löyty Ikea Family Keycard😱. Kokeilaas tätä toista ovee😰. Hui vitsi mä pelästyin😳 Äkkii pois täältä pandat hyökkää🫣! Yks tehtävä cräftää tää tästä. Vaaaaaaaaau🥳! Oohohoho nyt on hiiri käsi upgradettu😎. Pikku aimbotti tohon noin😤. Nyt on eka leveli päästy läpi🤭.`
      );
      break;
    case "osallistu":
      client.say(channel, `@${tags.username}, Olet osallistunut arvontaan!`);
      DrinkinGame(tags.username);
      break;
    case "discord":
      client.say(
        channel,
        `@${tags.username}, Discord: https://discord.gg/TBEwYKK82b .`
      );
      break;
    case "tilaapenispilleri":
      client.say(
        channel,
        `Moro! 😎 Se ois Ville tästä penispitkäksi Oy:stä.🤭 Meillä ois tarjota sulle tällänen penispidentäjä 😎. Vaan kuukauden käytön jälkeen saat 3x pidemmän peniksen jos käytät sitä 2 viikkoa ja käytät kanssa viikon ja se kerrottuna 3x1x0 ja siihen plussataan sun peniksen pituus 🥳 Miltä kuulostaa? Joo eiköhän laiteta pakettiin! 🤪`
      );
      break;
    case "koulutus":
      client.say(
        channel,
        `@${tags.username}, Informaatioteknologian tradenomi Haaga-Helia .`
      );
      break;
    case "opettele":
      client.say(channel, `@${tags.username}, https://www.codecademy.com/.`);
      break;
    case "komennot":
      client.say(
        channel,
        `@${tags.username}, !github !koulutus !opettele !tilaapenispilleri !discord !komennot !guess !roullette !howold !liima !kanyeortrump !wadap !ikea !osallistu !koodannut`
      );
      break;
    case "github":
      client.say(
        channel,
        `@${tags.username}, Github:
        https://github.com/jonijuntto
        `
      );
      break;
    case "koodannut":
      client.say(
        channel,
        `@${tags.username}, ite oon koodannu yhteensä varmaan kymmeniä tunteja ja oon 100% ammattilainen vaikka oon koodannu varmaan 100 tuntiakin koodannu.`
      );
      case "poll":
        const answer = message.split(" ")[1].toLowerCase();
        if (answer === "1"){
          client.say(channel, `@${tags.username}, voted for 1`);
          localStorage.setItem("pollResult", JSON.stringify(pollResult));
        }else if (answer === "2"){
          client.say(channel, `@${tags.username}, voted for 2`);
          localStorage.setItem("pollResult", JSON.stringify(pollResult));
        } else{
          client.say(channel, `@${tags.username}, You can only vote for 1 or 2`);
        }
        break;
      case "results":
        console.log("in poll result");
        const result1 = [];
        const result2 = [];
        const pollResult = JSON.parse(localStorage.getItem("pollResult"));
        pollResult.forEach((answer) => {
          if (answer === "1"){
            result1.push(answer);
          }else if (answer === "2"){
            result2.push(answer);
          }
        });
        client.say(channel, `@${tags.username}, 1: ${result1.length} 2: ${result2.length}`);
      break;
    default:
      console.log("Unknown command");
      break;
  }
});
