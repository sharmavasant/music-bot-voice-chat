<!-- Banner -->
<p align="center">
  <img src="https://github.com/sharmavasant/music-bot-voice-chat/blob/main/photo_6086851755703912865_c.jpg" alt="Music Bot Banner" width="100%">
</p>

<!-- Title -->
<h1 align="center">🎵 Telegram Music Bot — Voice Chat Streaming</h1>
<p align="center">
  <b>Play YouTube songs directly into Telegram Voice Chats — Powered by Node.js & GramTGCalls 🎧</b>
</p>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24.x-green?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Telegram%20Bot-API-blue?style=for-the-badge&logo=telegram">
  <img src="https://img.shields.io/badge/YouTube-DL-red?style=for-the-badge&logo=youtube">
  <img src="https://img.shields.io/badge/FFmpeg-7.1.1-orange?style=for-the-badge&logo=ffmpeg">
</p>

---

## 🚀 Features
✅ Play songs directly from **YouTube**  
✅ Stream audio in **Telegram Voice Chat**  
✅ Control with **inline buttons** (⏮ ⏯ ⏭ ⏹)  
✅ Supports **pause/resume/stop/skip**  
✅ Fast downloads using **yt-dlp + FFmpeg**

---

## 🛠 Tech Stack
- **Node.js**
- **Telegram Bot API** (node-telegram-bot-api)
- **GramTGCalls** for streaming
- **yt-dlp** for downloading
- **FFmpeg** for audio conversion

---

## 📦 Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/music-bot-voice-chat.git
cd music-bot-voice-chat

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run the bot
npm start
```
---

## ⚙️ Environment Variables
Create a .env file in the root folder:
TELEGRAM_BOT_TOKEN=your_bot_token_here
API_ID=your_telegram_api_id
API_HASH=your_telegram_api_hash
SESSION_STRING=your_session_string
GOOGLE_DATA_API_KEY=your_youtube_data_api_key

---

## 🎯 Usage
/play <song_name> → Play song from YouTube

Inline buttons for controlling playback

/stop to end streaming

---

## 📸 Demo
<p align="center"> <img src="https://your-demo-gif-or-screenshot-link.gif" width="80%"> </p>

---

## 📜 License
This project is licensed under the MIT License.

<p align="center"> Made with ❤️ by <a href="https://github.com/sharmavasant">Vasant Kumar Sharma</a> </p> 
