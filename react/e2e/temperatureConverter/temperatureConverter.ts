import {Page} from "@playwright/test";
import {goToHomePage} from "../app";

const navigateToTemperatureConverter = async (page: Page) => {
    await goToHomePage(page);
    await page.getByRole("link", {name: "Temperature Converter"}).click()
    return getArticle(page);
}

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "temperature converter"});

const getCelsiusTemperatureInput = (page: Page) =>
    page.getByLabel("celsius");

const getFahrenheitTemperatureInput = (page: Page) => page.getByLabel("fahrenheit");

export {getArticle, getCelsiusTemperatureInput, getFahrenheitTemperatureInput, navigateToTemperatureConverter};
