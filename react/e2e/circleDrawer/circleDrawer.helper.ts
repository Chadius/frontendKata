import {Locator, Page} from "@playwright/test";
import {goToHomePage} from "../app";

const navigateToCircleDrawer = async (page: Page) => {
    await goToHomePage(page);
    await page.getByRole("link", {name: "Circle Drawer"}).click()
    return getArticle(page);
}

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "circle-drawer"});

const getCanvas = async (article: Locator) =>
    article.locator("#canvas")

const clickInCanvas = async ({article, button, x, y}: {
    article: Locator,
    button: 'left' | 'right',
    x: number,
    y: number
}) => {
    await getCanvas(article).then(async (canvas) => {
        await canvas.click({
            button,
            position: {x, y},
        })
    })
}

const getCircleDiameterMenu = (page: Page) =>
    page.getByRole("dialog", {name: "diameter-menu"})

const selectCircleDiameter = async (page: Page, diameter: number) =>
    await getCircleDiameterMenu(page).locator("#diameter").fill(diameter.toString())

const getUndoButton = (page: Page) => page.getByRole("button", {name: "undo"})
const clickUndoButton = async (page: Page) => await getUndoButton(page).click()

const getRedoButton = (page: Page) => page.getByRole("button", {name: "redo"})
const clickRedoButton = async (page: Page) => await getRedoButton(page).click()

export {navigateToCircleDrawer, getArticle, clickInCanvas, getCircleDiameterMenu, selectCircleDiameter, getUndoButton, clickUndoButton, getRedoButton, clickRedoButton};
