/* eslint-disable @typescript-eslint/no-unnecessary-condition, no-nested-ternary */ import { ButtonInteraction, Collection, CommandInteraction, ContextMenuInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";
export class CommandContext {
    async deferReply() {
        if (this.isInteraction()) {
            return this.context.deferReply();
        }
        return Promise.resolve(undefined);
    }
    async reply(options, autoedit) {
        if (this.isInteraction()) {
            if ((this.context.isCommand() || this.context.isSelectMenu()) && this.context.replied && !autoedit) throw new Error("Interaction is already replied.");
        }
        const context = this.context;
        const rep = await this.send(options, this.isInteraction() ? context.isCommand() || context.isSelectMenu() ? context.replied || context.deferred ? "editReply" : "reply" : "reply" : "reply").catch((e)=>({
                error: e
            }));
        if (!rep || "error" in rep) {
            throw new Error(`Unable to reply context, because: ${rep ? rep.error.message : "Unknown"}`);
        }
        // @ts-expect-error-next-line
        return rep instanceof Message ? rep : new Message(this.context.client, rep);
    }
    async send(options, type = "editReply") {
        const deletionBtn = new MessageActionRow().addComponents(new MessageButton().setEmoji("🗑️").setStyle("DANGER"));
        if (options.askDeletion) {
            deletionBtn.components[0].setCustomId(Buffer.from(`${options.askDeletion.reference}_delete-msg`).toString("base64"));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            options.components ? options.components.push(deletionBtn) : options.components = [
                deletionBtn
            ];
        }
        if (this.isInteraction()) {
            options.fetchReply = true;
            const msg = await this.context[type](options);
            const channel = this.context.channel;
            const res = await channel.messages.fetch(msg.id).catch(()=>null);
            return res ?? msg;
        }
        if (options.ephemeral) {
            throw new Error("Cannot send ephemeral message in a non-interaction context.");
        }
        return this.context.channel.send(options);
    }
    isInteraction() {
        return this.context instanceof Interaction;
    }
    isCommand() {
        return this.context instanceof CommandInteraction;
    }
    isContextMenu() {
        return this.context instanceof ContextMenuInteraction;
    }
    isMessageComponent() {
        return this.context instanceof MessageComponentInteraction;
    }
    isButton() {
        return this.context instanceof ButtonInteraction;
    }
    isSelectMenu() {
        return this.context instanceof SelectMenuInteraction;
    }
    isModal() {
        return this.context instanceof ModalSubmitInteraction;
    }
    get mentions() {
        return this.context instanceof Message ? this.context.mentions : null;
    }
    get deferred() {
        return this.context instanceof Interaction ? this.context.deferred : false;
    }
    get options() {
        return this.context instanceof Interaction ? this.context.options : null;
    }
    get fields() {
        return this.context instanceof ModalSubmitInteraction ? this.context.fields : null;
    }
    get author() {
        return this.context instanceof Interaction ? this.context.user : this.context.author;
    }
    get member() {
        return this.guild.members.resolve(this.author.id);
    }
    constructor(context, args = []){
        this.context = context;
        this.args = args;
        this.additionalArgs = new Collection();
        this.channel = this.context.channel;
        this.guild = this.context.guild;
    }
}
