import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
const DATAS = [
    {
        style: "SECONDARY",
        emoji: "⏪",
        customId: "PREV10"
    },
    {
        style: "PRIMARY",
        emoji: "⬅️",
        customId: "PREV"
    },
    {
        style: "DANGER",
        emoji: "🚫",
        customId: "STOP"
    },
    {
        style: "PRIMARY",
        emoji: "➡️",
        customId: "NEXT"
    },
    {
        style: "SECONDARY",
        emoji: "⏩",
        customId: "NEXT10"
    }
];
export class ButtonPagination {
    async start() {
        const embed = this.payload.embed;
        const pages = this.payload.pages;
        let index = 0;
        this.payload.edit.call(this, index, embed, pages[index]);
        const isInteraction = this.msg instanceof CommandInteraction;
        const buttons = DATAS.map((d)=>new MessageButton(d));
        const toSend = {
            content: this.payload.content,
            embeds: [
                embed
            ],
            components: pages.length < 2 ? [] : [
                new MessageActionRow().addComponents(buttons)
            ]
        };
        const msg = await (isInteraction ? this.msg.editReply(toSend) : await this.msg.edit(toSend));
        const fetchedMsg = await this.msg.client.channels.cache.get(this.msg.channelId).messages.fetch(msg.id);
        if (pages.length < 2) return;
        const collector = fetchedMsg.createMessageComponentCollector({
            filter: (i)=>{
                void i.deferUpdate();
                return DATAS.map((x)=>x.customId.toLowerCase()).includes(i.customId.toLowerCase()) && i.user.id === this.payload.author;
            }
        });
        collector.on("collect", async (i)=>{
            switch(i.customId){
                case "PREV10":
                    index -= 10;
                    break;
                case "PREV":
                    index--;
                    break;
                case "NEXT":
                    index++;
                    break;
                case "NEXT10":
                    index += 10;
                    break;
                default:
                    void msg.delete();
                    return;
            }
            index = (index % pages.length + Number(pages.length)) % pages.length;
            this.payload.edit.call(this, index, embed, pages[index]);
            await fetchedMsg.edit({
                embeds: [
                    embed
                ],
                content: this.payload.content,
                components: pages.length < 2 ? [] : [
                    new MessageActionRow().addComponents(buttons)
                ]
            });
        });
    }
    constructor(msg, payload){
        this.msg = msg;
        this.payload = payload;
    }
}
