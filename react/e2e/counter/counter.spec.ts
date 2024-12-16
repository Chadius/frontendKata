import {expect, test} from '@playwright/test';
import {clickOnCountButton, getCounterTextBox, navigateToCounter} from "./counter";

test('has article with the name of the component', async ({page}) => {
    const article = await navigateToCounter(page);
    await expect(article).toHaveText(/Counter/);
});

test('can click on button to increment count', async ({page}) => {
    const article = await navigateToCounter(page);

    const counterTextBox = getCounterTextBox(page);
    await expect(counterTextBox).toHaveValue("0");

    await clickOnCountButton(article);
    await expect(counterTextBox).toHaveValue("1");
});
