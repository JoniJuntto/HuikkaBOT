import dotenv from "dotenv";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";
import { promises as fs } from "fs";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { playAudioFile } from "audic";

dotenv.config();
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const userId = process.env.userId;

const authProvider = new RefreshingAuthProvider({
  clientId,
  clientSecret,
});
authProvider.onRefresh(
  async (userId, newTokenData) =>
    await fs.writeFile(
      `./tokens/tokens.${userId}.json`,
      JSON.stringify(newTokenData, null, 4),
      "UTF-8"
    )
);

const tokenData = JSON.parse(
  await fs.readFile(`./tokens/tokens.${userId}.json`, "UTF-8")
);

await authProvider.addUserForToken(tokenData, ["chat"]);

await authProvider.addIntentsToUser(userId, [
  "channel:manage:redemptions",
  "channel:read:redemptions",
  "chat:edit",
  "chat:read",
]);

const bot = new Bot({
  authProvider,
  channels: ["huikkakoodaa"],
  commands: [
    createBotCommand("liimaa", (params, { reply }) => {
      reply(
        `@${tags.username}, Ite oon impannut yhteensä varmaan kymmeniä tunteja ja oon 100% kunnossa vaikka oon impaanut varmaan 100 tuntiakin impannut.`
      );
    }),
    createBotCommand("ikea", (params, { reply }) => {
      reply(
        `@${tags.username}, Tänään meillä onkin erittäin mielenkiintoinen peli testissä...`
      );
    }),
    createBotCommand("discord", (params, { reply }) => {
      reply(`@${tags.username}, Discord: https://discord.gg/TBEwYKK82b .`);
    }),
    createBotCommand("tilaapenispilleri", (params, { reply }) => {
      reply(
        `Moro! 😎 Se ois Ville tästä penispitkäksi Oy:stä.🤭 Meillä ois tarjota sulle tällänen penispidentäjä 😎. Vaan kuukauden käytön jälkeen saat 3x pidemmän peniksen jos käytät sitä 2 viikkoa ja käytät kanssa viikon ja se kerrottuna 3x1x0 ja siihen plussataan sun peniksen pituus 🥳 Miltä kuulostaa? Joo eiköhän laiteta pakettiin! 🤪`
      );
    }),
    createBotCommand("github", (params, { reply }) => {
      reply(`https://github.com/jonijuntto`);
    }),
    createBotCommand("koodannut", (params, { reply }) => {
      reply(
        `ite oon koodannu yhteensä varmaan kymmeniä tunteja ja oon 100% ammattilainen vaikka oon koodannu varmaan 100 tuntiakin koodannu.`
      );
    }),
    createBotCommand("teini", (params, { reply }) => {
      reply(
        `❗️❗️❗️HUOMIO 2005 SYNTYNEET❗️❗️❗️!!! Tämä 👇 On teidän viimeinen vuosi lapsina 😔👦👧! Koska SEURAAVANA 👉 VUONNA! Teistä tulee T31N3JÄ 💁🙅💅!! BILETTÄMISTÄ 🎉💃 RYYPPÄÄMISTÄ 🍻🍸🍹🍷 NUOLEMISTA JA SEKSIÄ 👅💦😳 KUUKAUTISIA 😩🍫 SYDÄNSURUJA 💔😪 YLÄASTELAISIA (7️ LUOKKA)`
      );
    }),
    createBotCommand("riina", (params, { reply }) => {
      reply(
        `Uusi harrastus mielessä? Miten olisi kielitaidon harjoittaminen? Tanskalaisen seksologin Paprika Noelin mielestä peniksen lutkutusta pitäisi harrastaa vähintään kaksi minuuttia joka päivä. Tällä tummasuklaanmakuisella tikkunekkukikkelillä uuden harrastuksen aloittaminen on nyt helpompaa kuin koskaan aiemmin! Vihdoinkin kunnon jättitikkari, jota kelpaa lutkuttaa! 17 senttiä täyttä herkkua - sen pituinen se. Sopii niin aloittelijalle kuin kokeneemmallekin. Tämä on se juttu, jota olet aina halunnut kokeilla!`
      );
    }),
  ],
});

const apiClient = new ApiClient({ authProvider });
const listener = new EventSubWsListener({ apiClient });

listener.start();

const redeemSubscription = listener.onChannelRedemptionAdd(userId, (e) => {
  playAudioFile(`./audio/${e.rewardTitle}.mp3`);
});

const onChannelRaidFrom = listener.onChannelRaidFrom(userId, (e) => {
  playAudioFile(`./audio/persereikaa.mp3`);
});
