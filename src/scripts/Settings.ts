const moduleName = "BonusDie"

const counter = {
    key: "counter",
    data: {
        type: String,
        default: "{}",
        scope: "world",
        config: false,
        restricted: true,
    },
}

const registerSettings = async () => await game.settings.register(moduleName, counter.key, counter.data);

const getCounter = () => {
    const counterString = game.settings.get(moduleName, counter.key);
    try {
        return JSON.parse(counterString);
    }
    catch (e) {
        console.error(e);
    }
}

const setCounter = async (counterData) => {
    await game.settings.set(moduleName, counter.key, counterData)
}
