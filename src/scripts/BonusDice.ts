import {getCounter, setCounter} from "./Settings"

/**
 * Updates the counter display
 *
 * @param $counter - jQuery element of the span to update
 * @param newValue - the new value of the span
 */
const updateCounter = ($counter, newValue: number) => $counter.text(newValue);

/**
 * Method called by the buttons to update the numbers displayed
 *
 * @param player - owner of the bonus die
 * @param modifier - how should the number of bonus die be modified (+/-)
 * @param $counterStructure - jQuery obj of the span
 */
const modifyBonusDieAmountGM = (player: string, modifier: number, $counterStructure?) => {
    const counter = getCounter();
    if (isNaN(counter[player])) counter[player] = 0;
    counter[player] = Math.max(counter[player] + modifier, 0);
    setCounter(counter).then(() => {
        updateCounter($counterStructure, counter[player]);
        game.socket.emit('module.BonusDie', {
            action: 'updatePlayerDisplay',
            targetId: player,
            counter: counter[player]
        })
    });
}

const modifyBonusDieAmountPlayer = (player: string, modifier: number) => {
    game.socket.emit('module.BonusDie', {action: 'requestCounterUpdate', requestSource: player, modifier: modifier})
}

/**
 * Selects if the method above should add or subtract from the counter
 *
 * @param type - increase/decrease
 * @param player - owner of the structure
 * @param $counterStructure - jQuery obj of the span
 */
const methodSelector = (type: string, player: string, $counterStructure) => () => {
    switch (type) {
        case 'increase':
            return modifyBonusDieAmountGM(player, 1, $counterStructure);
        case 'decrease':
            return modifyBonusDieAmountGM(player, -1, $counterStructure);
        case 'use':

            return modifyBonusDieAmountPlayer(player, -1);
        case 'gift':
            // @ts-ignore
            modifyBonusDieAmountGM(game.user.data._id, -1, $counterStructure)
            return modifyBonusDieAmountGM(player, 1, $counterStructure);
    }
    ;
}

const iconSelector = (type: string): string => type === 'increase' ? 'fas fa-plus' : type === 'decrease' ? 'fas fa-minus' : type === 'use' ? 'fas fa-dice-d20' : 'fas fa-gift';

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

