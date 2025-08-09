// generate_session.js
require("dotenv").config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input'); // npm install input

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(''); // empty string

(async () => {
    console.log('Generating new session...');
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: async () => await input.text('Phone number: '),
        password: async () => await input.text('2FA password (if any): '),
        phoneCode: async () => await input.text('Code from Telegram: '),
        onError: err => console.error(err)
    });
    console.log('Your session string:');
    console.log(client.session.save()); // <-- copy this string into your .env
})();
