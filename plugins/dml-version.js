const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: 'checkupdate',
    alias: ['cupdate', 'version'],
    react: '🚀',
    desc: "Check bot's version, system stats, and update info.",
    category: 'info',
    filename: __filename
}, async (_0, m, { from, sender, pushname, reply }) => {
    try {
        const versionFile = path.join(__dirname, '../data/version.json');
        let currentVersion = 'Unknown';
        let changelog = 'No changelog available.';

        if (fs.existsSync(versionFile)) {
            const localData = JSON.parse(fs.readFileSync(versionFile));
            currentVersion = localData.version;
            changelog = localData.changelog;
        }

        const versionUrl = 'https://raw.githubusercontent.com/young-dv/INFINITY1.0-MD/main/data/version.json';
        let latestVersion = 'Unknown';
        let latestChangelog = 'No changelog available.';
        try {
            const { data } = await axios.get(versionUrl);
            latestVersion = data.version;
            latestChangelog = data.changelog;
        } catch (e) {
            console.error("Error fetching version info:", e);
        }

        const pluginsDir = path.join(__dirname, '../plugins');
        const totalPlugins = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js')).length;
        const totalCommands = commands.length;
        const uptimeFormatted = runtime(process.uptime());
        const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
        const host = os.hostname();
        const lastUpdate = fs.statSync(versionFile).mtime.toString();

        const githubRepo = 'https://github.com/young-dv/INFINITY1.0-MD';
        let updateMessage = '*✅ YOUR INFINITY-MD IS UP-TO-DATE!*';
        if (currentVersion !== latestVersion) {
            updateMessage = `*😵‍💫 YOUR INFINITY-MD BOT IS OUTDATED!*\n🔹 *CURRENT VERSION:* ${currentVersion}\n🔹 *LATEST VERSION:* ${latestVersion}\n\n📑 *CHANGELOG:*\n${latestChangelog}\n\n*USE .update TO UPDATE.*`;
        }

        const greeting = `🌟 Good ${(new Date().getHours() < 12 ? 'Morning' : 'Night')}, ${pushname}!\n\n`;
        const caption =
            greeting +
            `🤖 *BOT NAME:* INFINITY-MD\n` +
            `🔖 *CURRENT VERSION:* ${currentVersion}\n` +
            `📢 *LATEST VERSION:* ${latestVersion}\n` +
            `📂 *TOTAL PLUGINS:* ${totalPlugins}\n` +
            `🔢 *TOTAL COMMANDS:* ${totalCommands}\n\n` +
            `💾 *SYSTEM INFO:*\n` +
            `⏰ *UPTIME:* ${uptimeFormatted}\n` +
            `📟 *RAM USAGE:* ${usedMem} MB / ${totalMem} MB\n` +
            `⚙️ *HOST NAME:* ${host}\n` +
            `📅 *LAST UPDATE:* ${lastUpdate}\n\n` +
            `📑 *CHANGELOG:*\n${latestChangelog}\n\n` +
            `⭐ *GITHUB REPO:* ${githubRepo}\n\n` +
            `${updateMessage}\n\n👋🏻 *HEY! DON'T FORGET TO FORK & STAR THE REPO!*`;

        await _0.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/rxuedn.jpg' },
            caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363328294650605@newsletter",
                    newsletterName: "☇ INFINITY-MD",
                    serverMessageId: 143
                }
            }
        }, { quoted: m });
    } catch (e) {
        console.error("❌ An error occurred while checking the bot version.", e);
        reply("❌ An error occurred while checking the bot version.");
    }
});