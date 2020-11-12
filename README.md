# Bonus Die
![downloads](https://img.shields.io/github/downloads/HadaIonut/Foundry-BonusDie/v1.0.0/bonusDie.zip?style=for-the-badge)
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/A0A32J9GM)

Bonus Die is a Foundry VTT module that allows the GM to give players 'Bonus Dice' that can be expended at will or traded by the players.
Expending a bonus die will trigger a chat message. This messages are costumizable and feature keywords that will be automaticly replaced.

## Instalation

This module can be installed from the Foundry VTT module browser or installed from the `module.json` file available in the latest release

## Usage

This module adds the dungeon master the option to gift the players a Bonus Die. 
Bonus Dice is a costumizable resource whose utilization should be decided by the game master.

### Interface

*GM side*

![img](https://i.imgur.com/2jjj9EL.png)

In order from left to right: 
 - the 0s represend the players courent number of Bonus Dice
 - the + button adds to the player 1 bonus die
 - the - button removes one bonus die from the player

*Player side*

![img](https://i.imgur.com/p4wZnl4.png)

- the dice icon next to the player 2 is the use button, it removes one bonus die from the user and creates a chat message to notify everyone about this (in the future this button will also expose a hook in case anyone wants to make a macro that will trigger on hook or something)
- the gift icon next to player 3 is the gift button, it offers players the option to gift bonus dice to one another, it will also create a chat message to notify eveyone about this


## Keywords

The complete list of keywords that are replaced is:
 - [$player] - will be replaced by the name of the player that has triggered the message
 - [$otherPlayer] - will be replaced by the target of an action (example in the default message of gifting a bonus die it is replaced by the recipient of the gift)
 - [$bonusDie] - will be replaced by the name of the bonus dice (configurable in the settings tab)
 
