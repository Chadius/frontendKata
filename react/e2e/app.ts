import {Page} from "@playwright/test";

const goToHomePage = async (page: Page) => {
    await page.goto('http://localhost:5173/');
};
export {goToHomePage};
