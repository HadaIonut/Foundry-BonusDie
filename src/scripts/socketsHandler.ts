import {updateCounter, modifyBonusDieAmountGM} from "./BonusDice";

const socketsHandle = () => async (receivedObject) => {
    switch (receivedObject.action) {
        case 'updatePlayerDisplay':
            return updateCounter(Array.isArray(receivedObject.targetId) ? receivedObject.targetId : [receivedObject.targetId], receivedObject.counter);
        case 'requestCounterUpdate':
            return modifyBonusDieAmountGM(receivedObject.requestSource, receivedObject.modifier);
    }
}

export {socketsHandle}