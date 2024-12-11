import {Page} from "@playwright/test";

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "temperature converter"});

const getCelsiusTemperatureInput = (page: Page) =>
    page.getByLabel("celsius");

const getFahrenheitTemperatureInput = (page: Page) => page.getByLabel("fahrenheit");

export {getArticle, getCelsiusTemperatureInput, getFahrenheitTemperatureInput};
