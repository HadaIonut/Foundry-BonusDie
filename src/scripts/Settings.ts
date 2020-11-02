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
        key: "nameOfBonusDie",
        data: {
            type: String,
            default: "Bonus Die",
            config: true,
            restricted: false,
        }
    },
    {
        key: "messageOnUse",
        data: {
            type: String,
            default: "[$player] has used a [$bonusDie].",
            config: true,
            restricted: false,
        }
    },
    {
        key: "messageOnGift",
        data: {
            type: String,
            default: "[$player] has gifted a [$bonusDie] to [$targetPlayer]",
            config: true,
            restricted: false,
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