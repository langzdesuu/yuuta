var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseEvent } from "../structures/BaseEvent";
import { Event } from "../utils/decorators/Event";
export let ReadyEvent = class ReadyEvent extends BaseEvent {
    async execute() {
        if (this.client.application?.owner) {
            this.client.config.devs.push(this.client.application.owner.id);
        }
        await this.client.spotify.renew();
        await this.doPresence();
        this.client.logger.info(await this.formatString("{username} is ready to serve {userCount} users on {serverCount} guilds in " + "{textChannelCount} text channels and {voiceChannelCount} voice channels!"));
    }
    async formatString(text) {
        let newText = text;
        if (text.includes("{userCount}")) {
            const users = await this.client.utils.getUserCount();
            newText = newText.replace(/{userCount}/g, users.toString());
        }
        if (text.includes("{textChannelCount}")) {
            const textChannels = await this.client.utils.getChannelCount(true);
            newText = newText.replace(/{textChannelCount}/g, textChannels.toString());
        }
        if (text.includes("{voiceChannelCount}")) {
            const voiceChannels = await this.client.utils.getChannelCount(false, true);
            newText = newText.replace(/{voiceChannelCount}/g, voiceChannels.toString());
        }
        if (text.includes("{serverCount}")) {
            const guilds = await this.client.utils.getGuildCount();
            newText = newText.replace(/{serverCount}/g, guilds.toString());
        }
        if (text.includes("{playingCount}")) {
            const playings = await this.client.utils.getPlayingCount();
            newText = newText.replace(/{playingCount}/g, playings.toString());
        }
        return newText.replace(/{prefix}/g, this.client.config.mainPrefix).replace(/{username}/g, this.client.user.username);
    }
    async setPresence(random) {
        const activityNumber = random ? Math.floor(Math.random() * this.client.config.presenceData.activities.length) : 0;
        const statusNumber = random ? Math.floor(Math.random() * this.client.config.presenceData.status.length) : 0;
        const activity = (await Promise.all(this.client.config.presenceData.activities.map(async (a)=>Object.assign(a, {
                name: await this.formatString(a.name)
            }))))[activityNumber];
        return this.client.user.setPresence({
            activities: activity ? [
                activity
            ] : [],
            status: this.client.config.presenceData.status[statusNumber]
        });
    }
    async doPresence() {
        try {
            return await this.setPresence(false);
        } catch (e) {
            if (e.message !== "Shards are still being spawned.") {
                this.client.logger.error(String(e));
            }
            return undefined;
        } finally{
            setInterval(()=>this.setPresence(true), this.client.config.presenceData.interval);
        }
    }
};
ReadyEvent = __decorate([
    Event("ready")
], ReadyEvent);
