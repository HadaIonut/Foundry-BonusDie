import {registerCounter, getCounter, setCounter} from "./Settings"

Hooks.on("init", async () => {
    await registerCounter();

    console.log("ceputa");
    CONFIG.debug.hooks = true;
})

const updateCounter = ($counter) => (newValue: number) => $counter.text(newValue);

const modifyBonusDiceAmount = (player: string, modifier: number, $counterStructure) => {
    const counter = getCounter();
    if (isNaN(counter[player])) counter[player] = 0;
    counter[player] = Math.max(counter[player] + modifier, 0);
    setCounter(counter).then(updateCounter($counterStructure)(counter[player]));
}

const methodSelector = (type: string, player: string, $counterStructure) => () => modifyBonusDiceAmount(player, type === "increase" ? 1 : -1, $counterStructure);

const iconSelector = (type: string): string => type === 'increase' ? 'fas fa-plus' : 'fas fa-minus';

const button = (player: string, $counterStructure) => (type: string) => {
    const iconType = iconSelector(type);
    let createdButton = $(`<span style='flex: 0.2'><i class='${iconType}'></i></span>`);
    createdButton.on('click', methodSelector(type, player, $counterStructure));
    return createdButton;
}

const getBonusDiceValue = (players: string): number => {
    const counter = getCounter();
    if (counter?.[players]) {
        return counter[players];
    } else return 0;
}

const bonusDiceStructure = (players: string) => $(`<span style='flex: 0.1'>${getBonusDiceValue(players)}</i></span>`);

const getControls = (players, index) => {
    if (game.user.isGM) {
        const $bonusDice = bonusDiceStructure(players.users[index].data._id);
        const buttonWithPlayer = button(players.users[index].data._id, $bonusDice);
        const buttonPlus = buttonWithPlayer("increase");
        const buttonMinus = buttonWithPlayer("decrease");

        return [$bonusDice, buttonPlus, buttonMinus];
    }
}

const handle = (players) => (index, playerHTML) => $(playerHTML).append(...getControls(players, index));

//Magic one liner, I dont want to talk about this
//bmarian made me do it, make issues on token tooltip alt
//https://github.com/bmarian/token-tooltip-alt/issues
Hooks.on("renderPlayerList", (playerList, $playerList, players) => $playerList.find('ol').children().each(handle(players)));