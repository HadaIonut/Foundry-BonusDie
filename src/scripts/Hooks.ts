import {registerSettings} from "./Settings";
import {handle} from "./BonusDice";
import {socketsHandle} from "./socketsHandler";

Hooks.on("init", async () => await registerSettings());

Hooks.on("ready", () => {
    //event trigger for updating the data un the user side
    game.socket.on('module.BonusDie', socketsHandle());
})

/* Magic one liner, I dont want to talk about this
   bmarian made me do it, make issues on token tooltip alt
   https://github.com/bmarian/token-tooltip-alt/issues */
Hooks.on("renderPlayerList", (playerList, $playerList, players) => $playerList.find('ol').children().each(handle(players)));