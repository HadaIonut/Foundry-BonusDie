import {registerCounter, getCounter, setCounter} from "./Settings"

Hooks.on("init", async () => {
    await registerCounter();

    console.log("ceputa");
    CONFIG.debug.hooks = true;

})

Hooks.on("ready", () => {
    //event trigger for updating the data un the user side
    game.socket.on('module.BonusDie', (object) => {
        console.log('ceaoa');
        updateCounter($(`#${object.str}`), object.counter);
    });
})

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
const modifyBonusDiceAmount = (player: string, modifier: number, $counterStructure) => {
    const counter = getCounter();
    if (isNaN(counter[player])) counter[player] = 0;
    counter[player] = Math.max(counter[player] + modifier, 0);
    setCounter(counter).then(() => {
        updateCounter($counterStructure, counter[player]);
        game.socket.emit('module.BonusDie', {str: $counterStructure.attr('id'), counter: counter[player]})
    });
}

/**
 * Selects if the method above should add or subtract from the counter
 *
 * @param type - increase/decrease
 * @param player - owner of the structure
 * @param $counterStructure - jQuery obj of the span
 */
const methodSelector = (type: string, player: string, $counterStructure) => () => modifyBonusDiceAmount(player, type === "increase" ? 1 : -1, $counterStructure);

const iconSelector = (type: string): string => type === 'increase' ? 'fas fa-plus' : 'fas fa-minus';

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
const getBonusDiceValue = (player: string): number => {
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
const getSpanId = (index)=> `BonusDie-${index}`;

/**
 * Creates the structure for the bonus die display as a span with the number of bonus die
 *
 * @param player - the player owner of the structure
 * @param index - index of the span
 */
const bonusDiceStructure = (player: string, index) => $(`<span id="${getSpanId(index)}" style='flex: 0.1'>${getBonusDiceValue(player)}</i></span>`);

/**
 * Creates the controls structure for the DM (display, plus button, minus button)
 *
 * @param players - player that has it's data controlled
 * @param index - index of the span
 */
const getControls = (players, index) => {
    const $bonusDice = bonusDiceStructure(players.users[index].data._id, index);

    if (game.user.isGM) {
        const buttonWithPlayer = button(players.users[index].data._id, $bonusDice);
        const buttonPlus = buttonWithPlayer("increase");
        const buttonMinus = buttonWithPlayer("decrease");

        return [$bonusDice, buttonPlus, buttonMinus];
    } else {
        return [$bonusDice];
    }
}

/**
 * Appends the controls to the players display
 *
 * @param players - a list of players
 */
const handle = (players) => (index, playerHTML) => $(playerHTML).append(...getControls(players, index));


/* Magic one liner, I dont want to talk about this
   bmarian made me do it, make issues on token tooltip alt
   https://github.com/bmarian/token-tooltip-alt/issues */
Hooks.on("renderPlayerList", (playerList, $playerList, players) => $playerList.find('ol').children().each(handle(players)));