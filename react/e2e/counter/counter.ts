import {Locator, Page} from "@playwright/test";

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "counter"});

const getCounterTextBox = (page: Page) => {
    return page.getByRole("textbox", {name: "count"});
}
const clickOnCountButton = async (article: Locator) => {
    const countButton = article.getByRole("button");
    await countButton.click();
}

export {
    getArticle,
    getCounterTextBox,
    clickOnCountButton,
}
