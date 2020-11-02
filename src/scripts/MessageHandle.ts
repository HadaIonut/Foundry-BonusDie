import {getSetting} from "./Settings";

const processorMethod = (playerOwner:string, playerTarget?:string) => () => (valueToReplace): string => {
    switch (valueToReplace) {
        case '[$player]':
            return game?.users?.get(playerOwner)?.data?.name;
        case '[$bonusDie]':
            return getSetting('nameOfBonusDie');
        case '[$targetPlayer]':
            return game?.users?.get(playerTarget)?.data?.name;
        default:
            return `'${valueToReplace}' is not on the list of supported tags`;
    }
}

const parseRawMessages = (unparsedMessage: string, processorWithPlayerData: Function) => {
    return unparsedMessage.replace(/\[\$([A-z]+)\]/g, processorWithPlayerData())
}

const getMessageContent = (context: string, processorWithPlayerData: Function) => {
    const unparsedMessage = getSetting(context === "use" ? 'messageOnUse' : 'messageOnGift');
    return parseRawMessages(unparsedMessage, processorWithPlayerData);
}

const createNewMessage = (context: string, playerOwner:any, playerTarget?:any) => {
    const processorWithPlayerData = processorMethod(playerOwner, playerTarget);
    return ChatMessage.create({
        content: getMessageContent(context, processorWithPlayerData),
        speaker: {
            alias: 'Bonus Dice'
        }
    })
}

export {createNewMessage};