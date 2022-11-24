import { downloadExecutable } from "./yt-dlp-utils";
import { existsSync, readFileSync, writeFileSync, rmSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";
import { Server } from "https";
import module from "module";

const ensureEnv = arr => arr.every(x => process.env[x] !== undefined);

const isGlitch = ensureEnv([
    "PROJECT_DOMAIN",
    "PROJECT_INVITE_TOKEN",
    "API_SERVER_EXTERNAL",
    "PROJECT_REMIX_CHAIN"
]);

const isReplit = ensureEnv([
    "REPLIT_DB_URL",
    "REPL_ID",
    "REPL_IMAGE",
    "REPL_LANGUAGE",
    "REPL_OWNER",
    "REPL_PUBKEYS",
    "REPL_SLUG"
]);

const isGitHub = ensureEnv([
    "GITHUB_ENV",
    "GITHUB_REPOSITORY_OWNER",
    "GITHUB_HEAD_REF",
    "GITHUB_API_URL",
    "GITHUB_REPOSITORY",
    "GITHUB_SERVER_URL"
]);

function npmInstall(deleteDir = false, forceInstall = false, additionalArgs = []) {
    if (deleteDir) {
        const modulesPath = resolve(process.cwd(), "node_modules");

        if (existsSync(modulesPath)) {
            rmSync(modulesPath, {
                recursive: true,
                force: true
            });
        }
    }

    execSync(`npm install${isGlitch ? " --only=prod" : ""}${forceInstall ? " --force" : ""} ${additionalArgs.join(" ")}`);
}

if (isGlitch) {
    const gitIgnorePath = resolve(process.cwd(), ".gitignore");
    try {
        const data = readFileSync(gitIgnorePath, "utf8").toString();
        if (data.includes("dev.env")) {
            writeFileSync(gitIgnorePath, data.replace("\ndev.env", ""));
            console.info("Removed dev.env from .gitignore");
        }
    } catch {
        console.error("Failed to remove dev.env from .gitignore");
    }

    try {
        console.info("[INFO] Trying to re-install modules...");
        npmInstall();
        console.info("[INFO] Modules successfully re-installed.");
    } catch (err) {
        console.info("[INFO] Failed to re-install modules, trying to delete node_modules and re-install...");
        try {
            npmInstall(true);
            console.info("[INFO] Modules successfully re-installed.");
        } catch {
            console.info("[INFO] Failed to re-install modules, trying to delete node_modules and install modules forcefully...");
            try {
                npmInstall(true, true);
                console.info("[INFO] Modules successfully re-installed.");
            } catch {
                console.warn("[WARN] Failed to re-install modules, please re-install manually.");
            }
        }
    }
}

if (isGitHub) {
    console.warn("[WARN] Running this bot using GitHub is not recommended.");
}

const require = module.createRequire(import.meta.url);

if (!isGlitch && !isReplit) {
    try {
        require("ffmpeg-static");
    } catch {
        console.info("[INFO] This bot is not running on Glitch, trying to install ffmpeg-static...");
        npmInstall(false, false, ["--no-save", "ffmpeg-static"]);
        console.info("[INFO] ffmpeg-static has been installed.");
    }
}

if (isGlitch || isReplit) {
    new Server((req, res) => {
        const now = new Date().toLocaleString("en-US");
        res.end(`OK (200) - ${now}`);
    }).listen(Number(process.env.PORT || 3000) || 3000);

    console.info(`[INFO] ${isGlitch ? "Glitch" : "Replit"} environment detected, trying to compile...`);
    execSync(`npm run compile`);
    console.info("[INFO] Compiled.");
}

const streamStrategy = process.env.STREAM_STRATEGY;
if (streamStrategy !== "play-dl") await downloadExecutable();
if (streamStrategy === "play-dl") {
    try {
        require("play-dl");
    } catch {
        console.info("[INFO] Installing play-dl...");
        npmInstall(false, false, ["play-dl"]);
        console.info("[INFO] Play-dl has been installed.");
    }
}
console.info("[INFO] Starting the bot...");
import("./dist/index.js");


import express from 'express'

const app = express()
app.get('/', (req, res) => {
    res.send('Odd is better.');
  });

const port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});

# This is your bot's configuration file, control your bot's environment here. Every value must contains a string ("")
# Note: if you're looking for the dev options, please go to the dev.env file

#==============================================================================
# OPTIONAL = This value is optional, and can be left blank.
# IMPORTANT = It is recommended that you pay attention to the value.
# MULTIPLE - This value can be multiple string, each value splitted with comma or semi-colon. You can use single-quote (') to escape whether you have any comma or semicolon in the value.

#==============================================================================
# IMPORTANT - What is your Discord bot's token?
# Example: DISCORD_TOKEN="NTE5NjQ2MjIxNTU2Nzc2OTcw.XAcEQQ.0gjhNbGeWBsKP6FVuIyZWlG2cMd"
DISCORD_TOKEN="OTk1Njc1MDU2MTExODg2Mzg2.GM8G7Z.LRp7S2l5v4ooHiuR37T86LUBXnpF93MyCwAJr8"

#==============================================================================
# IMPORTANT - What should be the main prefix of your bot?
# Example: PREFIX="!"
# Default: !
MAIN_PREFIX="y!"

#==============================================================================
# OPTIONAL, MULTIPLE - What should be the alternative prefixes of your bot?
# Example: PREFIX="?, {mention}"
# Formats: {mention} = @bot mention
# Default: {mention}
ALT_PREFIX="{mention}"

#==============================================================================
# OPTIONAL - What should be your bot's embed color code? (hex)
# Example: EMBED_COLOR="22C9FF"
# Default: 22C9FF
EMBED_COLOR="22C9FF"

#==============================================================================
# OPTIONAL - What should be the language of your bot?
# Example: LOCALE="en"
# Available: en, es, fr, id
# Default: en
LOCALE="en"

#==============================================================================
# OPTIONAL, MULTIPLE - Activity list, what text should be appear on your bot's status?
# Example: ACTIVITIES="Hello!"
# Formats: {prefix} = bot prefix, {userCount} = user amount, {textChannelCount} = text channel amount, {serverCount} = server amount, {playingCount} = amount of server playing music using the bot, {username} = bot username
ACTIVITIES="to Langz & {serverCount} Servers!"

#==============================================================================
# OPTIONAL, MULTIPLE - Activity type list.
# The order of this value is the same order as ACTIVITIES.
# For example, first value of ACTIVITIES will use first value of this.
# Example: ACTIVITY_TYPES="PLAYING, COMPETING"
# Available: PLAYING, WATCHING, LISTENING, COMPETING
ACTIVITY_TYPES="LISTENING"

#==============================================================================
# OPTIONAL, MULTIPLE - What is your server's ID?
# Example: MAIN_GUILD="972407605295198258"
MAIN_GUILD="855327468126863371"

#==============================================================================
# OPTIONAL - Which youtube downloader do you want to use?
# For more information, see: https://github.com/Clytage/rawon/wiki/Stream-Strategy
# Example: STREAM_STRATEGY="yt-dlp"
# Available: play-dl, yt-dlp
# Default: yt-dlp
STREAM_STRATEGY="yt-dlp"

#==============================================================================
# OPTIONAL - Do you want to enable slash command support?
# Example: ENABLE_SLASH_COMMAND="yes"
# Default: yes
ENABLE_SLASH_COMMAND="no"

#==============================================================================
# OPTIONAL - Which music selection type do you want to use?
# Example: MUSIC_SELECTION_TYPE="selectmenu"
# Available: message (just like in previous version), selectmenu (uses discord selection menu)
# Default: message
MUSIC_SELECTION_TYPE="message"

#==============================================================================
# IMPORTANT - Do you want to enable the 24/7 command?
# Example: ENABLE_24_7_COMMAND="no"
# Default: no
ENABLE_24_7_COMMAND="no"

#==============================================================================
# IMPORTANT - Do you want to make your bot not leaving the voice channel after playing a song?
# Example: STAY_IN_VC_AFTER_FINISHED="no"
# Default: no
STAY_IN_VC_AFTER_FINISHED="no"

#==============================================================================
# OPTIONAL - What should be your bot's emoji for every success sentence?
# Example: YES_EMOJI="✅"
# Default: ✅
YES_EMOJI="✅"

#==============================================================================
# OPTIONAL - What should be your bot's emoji for every failed sentence?
# Example: NO_EMOJI="❌"
# Default: ❌
NO_EMOJI="❌"
