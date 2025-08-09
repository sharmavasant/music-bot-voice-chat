require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
// const { Tgcalls, Stream } = require("node-tgcalls");
const ytdlp = require("yt-dlp-exec");
// const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { GramTGCalls, gramjs } = require("tgcalls-gramjs");
const axios = require("axios");
const child_process = require("child_process");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
// const tgcalls = new Tgcalls(process.env.SESSION_ID); // Telegram session string

//Global stream state
let streamState = {
    tg: null,
    playing: false
}

let tg = null;

async function initTG() {
    if (!tg) {
        const client = await gramjs(
            parseInt(process.env.API_ID),
            process.env.API_HASH,
            process.env.SESSION_STRING
        );
        tg = new GramTGCalls(client, "nomadic_tetris");
        console.log("✅ TG instance created");
    } else {
        console.log("ℹ️ TG instance already exists");
    }
}

// const client = await gramjs(parseInt(process.env.API_ID), process.env.API_HASH, process.env.SESSION_STRING);
// // console.log(client.session.save()); // run once to generate

// const tg = new GramTGCalls(client, "nomadic_tetris");

async function ytSearch(query) {
    const apiKey = process.env.GOOGLE_DATA_API_KEY;
    const apiUrl = "https://www.googleapis.com/youtube/v3/search";

    const response = await axios.get(apiUrl, {
        params: {
            part: "snippet",
            q: query,
            key: apiKey,
            maxResults: 1,
            type: "video"
        }
    });

    const items = response.data.items;

    if (items.length === 0) {
        return null;
    }

    const videoId = items[0].id.videoId;
    const title = items[0].snippet.title;

    return {
        videoId,
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`
    };
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "🎶 Send me a song name or YouTube link to get audio! with command /play <song_name>");
})

bot.onText(/\/play (.+)/, async (msg, match) => {
    const song_name = match[1];

    bot.sendMessage(msg.chat.id, `Searching ${song_name} on youtube...`);

    const youtubeSearchResults = await ytSearch(song_name);

    console.log(youtubeSearchResults);

    if (!youtubeSearchResults) {
        bot.sendMessage(msg.chat.id, "Sorry no results available for your song");
    }

    const videoUrl = youtubeSearchResults.url;
    const fileName = `${song_name}-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, fileName);
    const webmFileName = `${song_name}-${Date.now()}.webm`;
    const webmFilePath = path.join(__dirname, webmFileName);

    bot.sendMessage(msg.chat.id, "Downloading your song please wait...");

    child_process.execFile("yt-dlp", [
        "-x", "--audio-format", "mp3",
        "--ffmpeg-location", "C:\\Users\\user\\Downloads\\ffmpeg-7.1.1-full_build\\ffmpeg-7.1.1-full_build\\bin", // <-- Adjust if your path differs
        "-o", filePath,
        videoUrl
    ], async (error, stdout, stderr) => {

        if (error) {
            console.error("yt-dlp error:", error);
            return bot.sendMessage(msg.chat.id, "❌ Failed to download audio.");
        }

        try {
            await bot.sendAudio(msg.chat.id, filePath, {
                title: youtubeSearchResults.title
            });

            (async () => {
                // const client = await gramjs(parseInt(process.env.API_ID), process.env.API_HASH, process.env.SESSION_STRING);
                // // console.log(client.session.save()); // run once to generate

                // let tg = new GramTGCalls(client, "nomadic_tetris");

                await initTG();

                const stream = tg.streamAudio(filePath);

                //Managing global state
                streamState.tg = tg;
                streamState.playing = true;

                // Listen for end of playback
                await tg.streamAudio(filePath);

                const checkInterval = setInterval(() => {
                    if (tg.audioFinished) {
                        clearInterval(checkInterval);
                        console.log("✅ Stream finished, deleting file...");
                        fs.unlink(filePath, err => {
                            if (err) console.error("Error deleting file:", err);
                        });
                    }
                }, 1000);

                bot.sendMessage(msg.chat.id, `▶️ Started Streaming\n\n🎵 Title: ${youtubeSearchResults.title}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "⏯️", callback_data: "pause" }, // Play/Pause toggle
                                { text: "⏭️", callback_data: "skip" },  // Next / Skip
                                { text: "⏹️", callback_data: "stop" },   // Stop
                                { text: "▶️", callback_data: "play" },  // Play
                            ],
                            [
                                { text: "Close", callback_data: "close" }
                            ]
                        ]
                    }
                });

            })();


            // Delete file after sending
            // fs.unlink(filePath, (err) => {
            //     if (err) console.error("Error deleting file:", err);
            // });

        } catch (err) {
            console.error("Telegram sendAudio error:", err);
            bot.sendMessage(msg.chat.id, "❌ Failed to send audio.");
        }
    });
})

bot.on("callback_query", async (query) => {
    const data = query.data;
    const chatId = query.message.chat.id;

    if (data === "play") {
        if (!tg.pauseAudio) {
            try {
                await tg.resumeAudio();
                console.log("resumed");
            } catch (err) {
                console.error("resume failed:", err);
            }
        }
    }

    if (data === "pause") {
        if (!tg.audioStopped) {
            try {
                await tg.pauseAudio();
                console.log("paused");
            } catch (err) {
                console.error("pause failed:", err);
            }
        }
    }

    if (data === "skip") {
        // Skip ka code yahan

    }

    if (data === "stop") {
        // Stop ka code yahan
        await tg.stop();
    }

    if (data === "close") {
        await bot.deleteMessage(chatId, query.message.message_id);
    }

    bot.answerCallbackQuery(query.id);
});
