import { embedColor, noEmoji, yesEmoji } from "../../config";
import { MessageEmbed } from "discord.js";
const hexColors = {
    error: "RED",
    info: embedColor,
    success: "GREEN",
    warn: "YELLOW"
};
export function createEmbed(type, message, emoji = false) {
    const embed = new MessageEmbed().setColor(hexColors[type]);
    if (message) embed.setDescription(message);
    if (type === "error" && emoji) embed.setDescription(`${noEmoji} **|** ${message}`);
    if (type === "success" && emoji) embed.setDescription(`${yesEmoji} **|** ${message}`);
    return embed;
}
