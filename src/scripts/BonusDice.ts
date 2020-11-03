import {getCounter, getSetting, setCounter} from "./Settings"
import {createNewMessage} from "./MessageHandle";

const createWarning = (checkSource: string, type:string) => {
    // @ts-ignore
    if (checkSource === game.user.data._id) ui.notifications.warn(getSetting(type));
}

/**
 * Returns the id of the span that holds a player's bonus die number
 *
 * @param id - player id
 */
const getJQueryObjectFromId = (id: string) => $(`#BonusDie-${id}`);

/**
 * Updates the counter display
 *
 * @param counter - jQuery element of the span to update
 * @param newValue - the new value of the span
 */
const updateCounter = (counter, newValue) => counter.forEach((entity) => getJQueryObjectFromId(entity).text(newValue[entity]))

/**
 * Returns true if a counter should be modified and false + reason if not
 *
 * @param counter - list of all the bonus dice of all the players
 * @param players - a list of players involved in the modification
 * @param modifiers - the modifiers applied to the counter
 */
const shouldIModify = (counter: any, players: string[], modifiers: number[]) => {
    let returnValue = true;
    let reason = 'nothing';
    const maxNrDice = getSetting('maxNrOfBonusDice');
    players.forEach((current, index) => {
        if (counter[current] === 0 && modifiers[index] === -1) {
            returnValue = false;
            reason = 'onModifyNegative';
        }
        if (maxNrDice !== 0 && (counter[current] === maxNrDice && modifiers[index] === 1)) {
            returnValue = false;
            reason = 'onOverLimit';
        }
    })
    return {
        state: returnValue,
        reason: reason
    };
}

/**
 * Method called by the buttons to update the numbers displayed
 *
 * @param players - owner of the bonus die
 * @param modifiers - how should the number of bonus die be modified (+/-)
 * @param context
 * @param source
 */
const modifyBonusDieAmountGM = async (players: string[], modifiers: number[], context: string, source?) => {
    if (!game.user.isGM) return;

    const counter = getCounter();

    const modify = shouldIModify(counter, players, modifiers);
    if (!modify.state) {
        if (!source) return ui.notifications.warn(getSetting(modify.reason));
        game.socket.emit('module.BonusDie', {
            action: 'warningFallBack',
            source: source,
            reason: modify.reason
        })
        return ;
    }

    context === 'gift' ? await createNewMessage(context, players[1], players[0]) :  await createNewMessage(context, players[0])

    // modifies each object of the counter based on the modifiers array
    players.forEach((pl, index) => {
        if (isNaN(counter[pl])) counter[pl] = 0;
        counter[pl] = Math.max(counter[pl] + modifiers[index], 0);
    })

    // updates the counter and emits an update message for all players
    setCounter(counter).then(() => {
        updateCounter(players, counter);
        game.socket.emit('module.BonusDie', {
            action: 'updatePlayerDisplay',
            targetId: players,
            counter: counter
        })
    });
}

/**
 * Method intended for calling modify Die Amount from the player's side,
 * it emits a socket that will be answered by the GM side of the method
 *
 * @param player - player calling the method
 * @param modifier - +1/-1
 * @param context
 * @param source
 */
const modifyBonusDieAmountPlayer = async (player: string[], modifier: number[], context:string, source:string) => {
    await game.socket.emit('module.BonusDie', {
        action: 'requestCounterUpdate',
        players: player,
        modifier: modifier,
        context: context,
        source: source
    })
}

/**
 * Selects if the method above should add or subtract from the counter
 *
 * @param type - increase/decrease
 * @param player - owner of the structure
 */
const methodSelector = (type: string, player: string) => async () => {
    switch (type) {
        case 'increase':
            return modifyBonusDieAmountGM([player], [1], 'increase');
        case 'decrease':
            return modifyBonusDieAmountGM([player], [-1], 'decrease');
        case 'use':
            return await modifyBonusDieAmountPlayer([player], [-1], 'use', player);
        case 'gift':
            // @ts-ignore
            return await modifyBonusDieAmountPlayer([player, game.user.data._id], [1, -1], 'gift', game.user.data._id);
    }
}

const iconSelector = (type: string): string => `fas ${type === 'increase' ? 'fa-plus' : type === 'decrease' ? 'fa-minus' : type === 'use' ? 'fa-dice-d20' : 'fa-gift'}`;

/**
 * Creates the structure for the button
 *
 * @param player - owner of the data
 */
const button = (player: string) => (type: string) => {
    const iconType = iconSelector(type);
    let createdButton = $(`<span><i class='${iconType}'></i></span>`);
    createdButton.on('click', methodSelector(type, player));
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
 */
const bonusDieStructure = (player: string) => $(`<span id="${getSpanId(player)}">${getBonusDieValue(player)}</i></span>`);

/**
 * Creates the controls structure for the DM (display, plus button, minus button)
 *
 * @param players - player that has it's data controlled
 * @param index - index of the span
 */
const getControls = (players, index) => {
    const playerId = players.users[index].data._id;
    const $bonusDie = bonusDieStructure(playerId);
    const buttonWithPlayer = button(playerId);

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

        if (players.users[index].isGM) return [''];
        else return [$bonusDie, buttonUse, buttonGift];
    }
}

/**
 * Appends the controls to the players display
 *
 * @param players - a list of players
 */
const handle = (players) => (index, playerHTML) => {
    const $container = $('<div class="BonusDie-button-container"></div>')
    $container.append(...getControls(players, index));
    return $(playerHTML).append($container);
}

export {handle, updateCounter, modifyBonusDieAmountGM, createWarning}

