const moduleName = "BonusDie"

const counter = {
    key: "counter",
    data: {
        type: Object,
        default: {},
        scope: "world",
        config: false,
        restricted: false,
    },
}

const registerCounter = async () => await game?.settings?.register(moduleName, counter.key, counter.data);

const getCounter = (): any => game?.settings?.get(moduleName, counter.key);

const setCounter = async (counterData) => await game?.settings?.set(moduleName, counter.key, counterData);

export {registerCounter, getCounter, setCounter};