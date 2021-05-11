import {getSetting} from "./Settings.js";

const messageType = {
    increase: 'messageOnIncrease',
    decrease: 'messageOnDecrease',
    use: 'messageOnUse',
    gift: 'messageOnGift'
}

const processorMethod = (playerOwner, playerTarget) => () => (valueToReplace) => {
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

const parseRawMessages = (unparsedMessage, processorWithPlayerData) => {
    return unparsedMessage.replace(/\[\$([A-z]+)\]/g, processorWithPlayerData())
}

const getMessageContent = (context, processorWithPlayerData) => {
    const unparsedMessage = getSetting(messageType[context]);
    return parseRawMessages(unparsedMessage, processorWithPlayerData);
}

const createNewMessage = (context, playerOwner, playerTarget) => {
    const processorWithPlayerData = processorMethod(playerOwner, playerTarget);
    return ChatMessage.create({
        content: getMessageContent(context, processorWithPlayerData),
        speaker: {
            alias: getSetting('nameOfAlias')
        }
    })
}



export {createNewMessage};