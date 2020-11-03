const moduleName = "BonusDie"

const SETTINGS = [
    {
        key: "counter",
        data: {
            type: Object,
            default: {},
            scope: "world",
            config: false,
            restricted: false,
        },
    },
    {
        key: "maxNrOfBonusDice",
        data: {
            name: "Max number of Bonus Dice:",
            hint: "The max number of Bonus Dice that can be held by one player. (0 for unlimited)",
            type: Number,
            default: 0,
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "nameOfBonusDie",
        data: {
            name: "Name of Bonus Die:",
            type: String,
            default: "Bonus Die",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "nameOfAlias",
        data: {
            name: "Alias of the sender: ",
            hint: "This is the name of the sender of the message ",
            type: String,
            default: "Bonus Dice",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "messageOnIncrease",
        data: {
            name: "Message on increase:",
            type: String,
            default: "The GM gave [$player] a [$bonusDie].",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "messageOnDecrease",
        data: {
            name: "Message on decrease:",
            type: String,
            default: "The GM removed a [$bonusDie] from [$player].",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "messageOnUse",
        data: {
            name: "Message on use:",
            type: String,
            default: "[$player] has used a [$bonusDie].",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "messageOnGift",
        data: {
            name: "Message on gift:",
            type: String,
            default: "[$player] has gifted a [$bonusDie] to [$targetPlayer]",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "onModifyNegative",
        data: {
            name: 'Warning on negative:',
            type: String,
            default: "You cannot get to negative Bonus Dice, sorry about that.",
            scope: "world",
            config: true,
            restricted: true,
        }
    },
    {
        key: "onOverLimit",
        data: {
            name: 'Warning on over the limit:',
            type: String,
            default: "There is a limit to how many Bonus Dice you can have",
            scope: "world",
            config: true,
            restricted: true,
        }
    }
]

const registerSetting = (setting: any): void => game?.settings?.register(moduleName, setting.key, setting.data);

const registerSettings = (): void => SETTINGS.forEach(registerSetting);

const getCounter = (): any => game?.settings?.get(moduleName, "counter");

const setCounter = async (counterData) => await game?.settings?.set(moduleName, "counter", counterData);

const getSetting = (settingKey): any => game?.settings?.get(moduleName, settingKey);

const setSetting = async (dataToSave, dataKey) => await game?.settings?.set(moduleName, dataKey, dataToSave);

export {registerSettings, getCounter, setCounter, setSetting, getSetting};