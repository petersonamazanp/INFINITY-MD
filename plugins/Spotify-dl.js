const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "sptdl",
    alias: ["spotifydl", "spotidown"],
    desc: "Download Spotify music as MP3",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, pushname }) => {
    try {
        if (!q) return reply("*Please provide a Spotify link.*");
        if (!q.includes("spotify.com")) return reply("*Invalid Spotify link provided.*");

        reply("⏳ *Fetching Spotify track... Please wait!*");

        const { data } = await axios.get(`https://api.siputzx.my.id/api/d/spotify`, {
            params: { url: q }
        });

        if (!data.status || !data.data) return reply("*Failed to fetch Spotify track. Please try again later.*");

        const {
            title,
            type,
            artis,
            durasi,
            image,
            download
        } = data.data;

        // Convert duration from milliseconds to MM:SS format
        const durationSec = Math.floor(durasi / 1000);
        const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
        const seconds = (durationSec % 60).toString().padStart(2, '0');
        const duration = `${minutes}:${seconds}`;

        const caption = `
*⫷⦁ 𝐒𝐏𝐎𝐓𝐈𝐅𝐘 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑 ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artis}
🎶 *Type:* ${type}
⏱️ *Duration:* ${duration}

> *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃 𝐁𝐘 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐘 𝐌𝐃*
> 𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐘-𝐌𝐃 🧃
`.trim();

        // Send cover image with track info
        await conn.sendMessage(from, {
            image: { url: image },
            caption: caption
        }, { quoted: mek });

        // Send the MP3 file
        await conn.sendMessage(from, {
            audio: { url: download },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        console.error("Spotify Download Error:", e);
        reply("*Oops! An error occurred while downloading the Spotify track.*");
    }
});
