Hooks.on("init", () => {
    console.log("ceputa");
    CONFIG.debug.hooks = true;
})

const increasingMethod = (player: string) => {
    console.log ("plus");
}

const decreasingMethod = (player: string) => {
    console.log ("minus");
}

const methodSelector = (type: string, player: string) => {
    switch (type) {
        case "increase":
            increasingMethod(player);
            break;
        case "decrease":
            decreasingMethod(player);
            break;
        default:
            console.error("Something went wrong when creating the buttons");
            break;
    }
}

const iconSelector = (type: string): string => {
    return type === 'increase' ? 'fas fa-plus' : 'fas fa-minus';
}

const button = (type: string, player: string) => {
    const iconType = iconSelector(type);
    let createdButton = $(`<span style='flex: 0.2'><i class='${iconType}'></i></span>`);
    createdButton.on('click', () => methodSelector(type, player));
    return createdButton;
}

const handle = (players, $playerHTML) => (index) => {
    const buttonPlus = button("increase", players[index]);

    let buttonMinus = button("decrease", players[index]);

    $playerHTML[index].append(buttonPlus[0]);
    $playerHTML[index].append(buttonMinus[0]);

    console.log($playerHTML);
    console.log(players);
    console.log(index);
}

//Magic one liner, I dont want to talk about this
//bmarian made me do it, make issues on token tooltip alt
//https://github.com/bmarian/token-tooltip-alt/issues
Hooks.on("renderPlayerList", (playerList, $playerList, players) => $playerList.find('ol').children().each(handle(players, $playerList.find('ol').children())));