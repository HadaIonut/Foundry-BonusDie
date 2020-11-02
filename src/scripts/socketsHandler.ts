import {updateCounter, modifyBonusDieAmountGM} from "./BonusDice";

const socketsHandle = () => (receivedObject) => {
    switch (receivedObject.action) {
        case 'updatePlayerDisplay':
            return updateCounter($(`#BonusDie-${receivedObject.targetId}`), receivedObject.counter);
        case 'requestCounterUpdate':
            return modifyBonusDieAmountGM (receivedObject.requestSource, receivedObject.modifier, $(`#BonusDie-${receivedObject.requestSource}`));
    }
}

export {socketsHandle}