import {getCounter, setCounter} from "./Settings"

const getJQueryObjectFromId = (id: string) => $(`#BonusDie-${id}`);

/**
 * Updates the counter display
 *
 * @param counter - jQuery element of the span to update
 * @param newValue - the new value of the span
 */
const updateCounter = (counter, newValue) => {
    counter.forEach((entity)=>{
        getJQueryObjectFromId(entity).text(newValue[entity]);
    })
}

/**
 * Method called by the buttons to update the numbers displayed
 *
 * @param player - owner of the bonus die
 * @param modifier - how should the number of bonus die be modified (+/-)
 * @param $counterStructure - jQuery obj of the span
 */
const modifyBonusDieAmountGM = (player, modifier, $counterStructure?) => {
    const counter = getCounter();

    player.forEach((pl, index)=>{
        if (isNaN(counter[pl])) counter[pl] = 0;
        counter[pl] = Math.max(counter[pl] + modifier[index], 0);
    })

    setCounter(counter).then(() => {
        updateCounter(player, counter);
        game.socket.emit('module.BonusDie', {
            action: 'updatePlayerDisplay',
            targetId: player,
            counter: counter
        })
    });
}

const modifyBonusDieAmountPlayer = async (player: string[], modifier: number[]) => {
    await game.socket.emit('module.BonusDie', {
        action: 'requestCounterUpdate',
        requestSource: player,
        modifier: modifier
    })
}

/**
 * Selects if the method above should add or subtract from the counter
 *
 * @param type - increase/decrease
 * @param player - owner of the structure
 * @param $counterStructure - jQuery obj of the span
 */
const methodSelector = (type: string, player: string, $counterStructure) => async () => {
    switch (type) {
        case 'increase':
            return modifyBonusDieAmountGM([player], [1], $counterStructure);
        case 'decrease':
            return modifyBonusDieAmountGM([player], [-1], $counterStructure);
        case 'use':

            return await modifyBonusDieAmountPlayer([player], [-1]);
        case 'gift':
            // @ts-ignore
            //modifyBonusDieAmountPlayer(game.user.data._id, -1).then(() => modifyBonusDieAmountPlayer(player, 1))
            // @ts-ignore
            await modifyBonusDieAmountPlayer([player, game.user.data._id], [1, -1]);
            break;
    }

}

const iconSelector = (type: string): string => `fas ${type === 'increase' ? 'fa-plus' : type === 'decrease' ? 'fa-minus' : type === 'use' ? 'fa-dice-d20' : 'fa-gift'}`;

/**
 * Creates the structure for the button
 *
 * @param player - owner of the data
 * @param $counterStructure - jQuery obj of the span
 */
const button = (player: string, $counterStructure) => (type: string) => {
    const iconType = iconSelector(type);
    let createdButton = $(`<span style='flex: 0.2'><i class='${iconType}'></i></span>`);
    createdButton.on('click', methodSelector(type, player, $counterStructure));
    return createdButton;
}

/**
 * Returns the number of bonus die held by a player
 *
 * @param player
 */
const getBonusDieValue = (player: string): number => {
    const counter = getCounter();
    if (counter?.[player]) {
        return counter[player];
    } else return 0;
}

/**
 * Returns a unique identifier for each span
 *
 * @param index - index of the span
 */
const getSpanId = (index) => `BonusDie-${index}`;

/**
 * Creates the structure for the bonus die display as a span with the number of bonus die
 *
 * @param player - the player owner of the structure
 * @param index - index of the span
 */
const bonusDieStructure = (player: string, index) => $(`<span id="${getSpanId(player)}" style='flex: 0.1'>${getBonusDieValue(player)}</i></span>`);

/**
 * Creates the controls structure for the DM (display, plus button, minus button)
 *
 * @param players - player that has it's data controlled
 * @param index - index of the span
 */
const getControls = (players, index) => {
    const playerId = players.users[index].data._id;
    const $bonusDie = bonusDieStructure(playerId, index);
    const buttonWithPlayer = button(playerId, $bonusDie);

    if (game.user.isGM) {
        const buttonPlus = buttonWithPlayer('increase');
        const buttonMinus = buttonWithPlayer('decrease');

        if (players.users[index].isGM) return [''];
        else return [$bonusDie, buttonPlus, buttonMinus];
    } else {
        // @ts-ignore
        const buttonUse = game.user.data._id === playerId ? buttonWithPlayer('use') : '';
        // @ts-ignore
        const buttonGift = game.user.data._id !== playerId ? buttonWithPlayer('gift') : '';

        return [$bonusDie, buttonUse, buttonGift] // remove when testing done

        if (players.users[index].isGM) return [''];
        else return [$bonusDie, buttonUse, buttonGift];
    }
}

/**
 * Appends the controls to the players display
 *
 * @param players - a list of players
 */
const handle = (players) => (index, playerHTML) => $(playerHTML).append(...getControls(players, index));

export {handle, updateCounter, modifyBonusDieAmountGM}

