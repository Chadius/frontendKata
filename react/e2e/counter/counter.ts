import {Locator, Page} from "@playwright/test";
import {goToHomePage} from "../app";

const navigateToCounter = async (page: Page) => {
    await goToHomePage(page);
    await page.getByRole("link", {name: "Counter"}).click()
    return getArticle(page);
}

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "counter"});

const getCounterTextBox = (page: Page) => page.getByRole("textbox", {name: "count"});

const clickOnCountButton = async (article: Locator) => {
    const countButton = article.getByRole("button");
    await countButton.click();
}

export {
    getArticle,
    getCounterTextBox,
    clickOnCountButton,
    navigateToCounter,
}
