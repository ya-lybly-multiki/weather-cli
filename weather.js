#!//usr/bin/env node

import {getArgs} from "./helpers/args.js";
import {printHelp, printSuccess, printError, printWeather} from "./services/log.service.js";
import {getKeyValue, saveKeyValue, TOKEN_DICTIONARY} from "./services/storage.service.js";
import {getIcon, getWeather} from "./services/api.sevice.js";

const saveToken = async (token) => {
    if(!token.length) {
        printError('Have not token')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token)
        printSuccess("Token was save")
    } catch (e) {
        printError(e.message)
    }
}

const saveCity = async (city) => {
    if(!city.length) {
        printError("Have not city")
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city)
        printSuccess("City was save")
    } catch (e) {
        printError(e.message)
    }
}

const getForcast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city)
        const weather = await getWeather(city)
        printWeather(weather,getIcon(weather.weather[0].icon));
    } catch (e) {
        if(e?.responce?.status === 404) {
            printError('Uncorrected city')
        }
        if(e?.responce?.status === 401) {
            printError('Uncorrected token')
        } else {
            printError(e.message)
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv)
    if (args.h) {
        return  printHelp()
    }
    if (args.s) {
        return  saveCity(args.s)
    }
    if (args.t) {
        return saveToken(args.t)
    }
   return  getForcast()
    // Вывести погоду
}

initCLI();