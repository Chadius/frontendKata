import {expect, test} from '@playwright/test';
import {clickOnCountButton, getArticle, getCounterTextBox} from "./counter";
import {goToHomePage} from "../app";

test('has article with the name of the component', async ({page}) => {
    await goToHomePage(page);
    const article = getArticle(page);
    await expect(article).toHaveText(/Counter/);
});

test('can click on button to increment count', async ({page}) => {
    await goToHomePage(page);
    const article = getArticle(page);

    const counterTextBox = getCounterTextBox(page);
    await expect(counterTextBox).toHaveValue("0");

    await clickOnCountButton(article);
    await expect(counterTextBox).toHaveValue("1");
});
