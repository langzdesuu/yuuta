var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { memberReqPerms } from "../../utils/decorators/CommonUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
export let ModLogsCommand = class ModLogsCommand extends BaseCommand {
    execute(ctx) {
        const subname = ctx.options?.getSubcommand() ?? ctx.args.shift();
        let sub = this.options[subname];
        if (!sub) sub = this.options.default;
        sub(ctx);
    }
    constructor(...args){
        super(...args);
        this.options = {
            channel: async (ctx)=>{
                const newCh = ctx.options?.getChannel("newchannel")?.id ?? ctx.args.shift()?.replace(/[^0-9]/g, "");
                if (!newCh) {
                    let ch;
                    try {
                        ch = this.client.data.data?.[ctx.guild?.id ?? ""]?.modLog?.channel ?? null;
                        if (!ch) throw new Error("");
                    } catch  {
                        ch = null;
                    }
                    return ctx.reply({
                        embeds: [
                            createEmbed("info", ch ? i18n.__mf("commands.moderation.modlogs.channel.current", {
                                channel: ch
                            }) : i18n.__("commands.moderation.modlogs.channel.noChannel"))
                        ]
                    });
                }
                const ch1 = await ctx.guild?.channels.fetch(newCh).catch(()=>undefined);
                if (!ch1?.isText()) {
                    return ctx.reply({
                        embeds: [
                            createEmbed("error", i18n.__("commands.moderation.modlogs.channel.invalid"))
                        ]
                    });
                }
                await this.client.data.save(()=>{
                    const data = this.client.data.data;
                    const guildData = data?.[ctx.guild?.id ?? ""];
                    return {
                        ...data ?? {},
                        [ctx.guild.id]: {
                            ...guildData ?? {},
                            infractions: guildData?.infractions ?? {},
                            modLog: {
                                channel: newCh,
                                enable: guildData?.modLog?.enable ?? false
                            }
                        }
                    };
                });
                return ctx.reply({
                    embeds: [
                        createEmbed("success", i18n.__mf("commands.moderation.modlogs.channel.success", {
                            channel: newCh
                        }), true)
                    ]
                });
            },
            default: (ctx)=>ctx.reply({
                    embeds: [
                        createEmbed("info").setAuthor({
                            name: i18n.__("commands.moderation.modlogs.embedTitle")
                        }).addField(`${this.client.config.mainPrefix}modlogs enable`, i18n.__("commands.moderation.modlogs.slashEnableDescription")).addField(`${this.client.config.mainPrefix}modlogs disable`, i18n.__("commands.moderation.modlogs.slashDisableDescription")).addField(`${this.client.config.mainPrefix}modlogs channel [${i18n.__("commands.moderation.modlogs.newChannelText")}]`, i18n.__("commands.moderation.modlogs.slashChannelDescription"))
                    ]
                }),
            disable: async (ctx)=>{
                await this.client.data.save(()=>{
                    const data = this.client.data.data;
                    const guildData = data?.[ctx.guild?.id ?? ""];
                    return {
                        ...data ?? {},
                        [ctx.guild.id]: {
                            ...guildData ?? {},
                            infractions: guildData?.infractions ?? {},
                            modLog: {
                                channel: guildData?.modLog?.channel ?? null,
                                enable: false
                            }
                        }
                    };
                });
                return ctx.reply({
                    embeds: [
                        createEmbed("success", i18n.__("commands.moderation.modlogs.disable"), true)
                    ]
                });
            },
            enable: async (ctx)=>{
                await this.client.data.save(()=>{
                    const data = this.client.data.data;
                    const guildData = data?.[ctx.guild?.id ?? ""];
                    return {
                        ...data ?? {},
                        [ctx.guild.id]: {
                            ...guildData ?? {},
                            infractions: guildData?.infractions ?? {},
                            modLog: {
                                channel: guildData?.modLog?.channel ?? null,
                                enable: true
                            }
                        }
                    };
                });
                return ctx.reply({
                    embeds: [
                        createEmbed("success", i18n.__("commands.moderation.modlogs.enable"), true)
                    ]
                });
            }
        };
    }
};
__decorate([
    memberReqPerms([
        "MANAGE_GUILD"
    ], i18n.__("commands.moderation.warn.userNoPermission"))
], ModLogsCommand.prototype, "execute", null);
ModLogsCommand = __decorate([
    Command({
        aliases: [
            "modlog",
            "moderationlogs",
            "moderationlog"
        ],
        description: i18n.__("commands.moderation.modlogs.description"),
        name: "modlogs",
        slash: {
            options: [
                {
                    description: i18n.__("commands.moderation.modlogs.slashChannelDescription"),
                    name: "channel",
                    options: [
                        {
                            description: i18n.__("commands.moderation.modlogs.slashChannelNewChannelOption"),
                            name: "newchannel",
                            required: false,
                            type: "CHANNEL"
                        }
                    ],
                    type: "SUB_COMMAND"
                },
                {
                    description: i18n.__("commands.moderation.modlogs.slashEnableDescription"),
                    name: "enable",
                    type: "SUB_COMMAND"
                },
                {
                    description: i18n.__("commands.moderation.modlogs.slashDisableDescription"),
                    name: "disable",
                    type: "SUB_COMMAND"
                }
            ]
        },
        usage: i18n.__("commands.moderation.modlogs.usage")
    })
], ModLogsCommand);
