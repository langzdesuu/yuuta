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
export let DJCommand = class DJCommand extends BaseCommand {
    execute(ctx) {
        const subname = ctx.options?.getSubcommand() ?? ctx.args.shift();
        let sub = this.options[subname];
        if (!sub) sub = this.options.default;
        sub(ctx);
    }
    constructor(...args){
        super(...args);
        this.options = {
            default: (ctx)=>ctx.reply({
                    embeds: [
                        createEmbed("info").setAuthor({
                            name: i18n.__("commands.music.dj.embedTitle")
                        }).addField(`${this.client.config.mainPrefix}dj enable`, i18n.__("commands.music.dj.slashEnableDescription")).addField(`${this.client.config.mainPrefix}dj disable`, i18n.__("commands.music.dj.slashDisableDescription")).addField(`${this.client.config.mainPrefix}dj role [${i18n.__("commands.music.dj.newRoleText")}]`, i18n.__("commands.music.dj.slashRoleDescription"))
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
                            dj: {
                                enable: false,
                                role: guildData?.dj?.role ?? null
                            },
                            infractions: guildData?.infractions ?? {}
                        }
                    };
                });
                return ctx.reply({
                    embeds: [
                        createEmbed("success", i18n.__("commands.music.dj.disableText"), true)
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
                            dj: {
                                enable: true,
                                role: guildData?.dj?.role ?? null
                            },
                            infractions: guildData?.infractions ?? {}
                        }
                    };
                });
                return ctx.reply({
                    embeds: [
                        createEmbed("success", i18n.__("commands.music.dj.enableText"), true)
                    ]
                });
            },
            role: async (ctx)=>{
                const newRole = ctx.options?.getRole("newrole")?.id ?? ctx.args.shift()?.replace(/[^0-9]/g, "");
                const txt = this.client.data.data?.[ctx.guild?.id ?? ""]?.dj?.enable ? "enable" : "disable";
                const footer = `${i18n.__("commands.music.dj.embedTitle")}: ${i18n.__(`commands.music.dj.${txt}`)}`;
                if (!newRole) {
                    let role;
                    try {
                        role = this.client.data.data?.[ctx.guild?.id ?? ""]?.dj?.role ?? null;
                        if (!role) throw new Error("");
                    } catch  {
                        role = null;
                    }
                    return ctx.reply({
                        embeds: [
                            createEmbed("info", role ? i18n.__mf("commands.music.dj.role.current", {
                                role
                            }) : i18n.__("commands.music.dj.role.noRole")).setFooter({
                                text: footer
                            })
                        ]
                    });
                }
                const role1 = await ctx.guild?.roles.fetch(newRole).catch(()=>undefined);
                if (!role1) {
                    return ctx.reply({
                        embeds: [
                            createEmbed("error", i18n.__("commands.music.dj.role.invalid"), true)
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
                            dj: {
                                enable: guildData?.dj?.enable ?? false,
                                role: role1.id
                            },
                            infractions: guildData?.infractions ?? {}
                        }
                    };
                });
                return ctx.reply({
                    embeds: [
                        createEmbed("success", i18n.__mf("commands.music.dj.role.success", {
                            role: newRole
                        }), true).setFooter({
                            text: footer
                        })
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
], DJCommand.prototype, "execute", null);
DJCommand = __decorate([
    Command({
        description: i18n.__("commands.music.dj.description"),
        name: "dj",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.dj.slashRoleDescription"),
                    name: "role",
                    options: [
                        {
                            description: i18n.__("commands.music.dj.slashRoleNewRoleOption"),
                            name: "newrole",
                            required: false,
                            type: "ROLE"
                        }
                    ],
                    type: "SUB_COMMAND"
                },
                {
                    description: i18n.__("commands.music.dj.slashEnableDescription"),
                    name: "enable",
                    type: "SUB_COMMAND"
                },
                {
                    description: i18n.__("commands.music.dj.slashDisableDescription"),
                    name: "disable",
                    type: "SUB_COMMAND"
                }
            ]
        },
        usage: "{prefix}dj"
    })
], DJCommand);
