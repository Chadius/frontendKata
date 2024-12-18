import {expect, test} from "@playwright/test";
import {
    clickInCanvas, clickRedoButton, clickUndoButton,
    getCircleDiameterMenu, getRedoButton, getUndoButton,
    navigateToCircleDrawer,
    selectCircleDiameter
} from "./circleDrawer.helper";

test.describe("circleDrawer", async () => {
    test('has article with the name of the component', async ({page}) => {
        const article = await navigateToCircleDrawer(page)
        await expect(article).toHaveText(/Circle Drawer/)
    });
    test('clicking in the canvas draws a circle', async ({page}) => {
        const article = await navigateToCircleDrawer(page)
        await clickInCanvas({article, button: 'left', x: 50, y: 50})
        await page.waitForTimeout(100)
        await expect(page).toHaveScreenshot('expect-1-circle-after-click.png')
    })
    test('clicking outside of a circle creates another circle', async ({page}) => {
        const article = await navigateToCircleDrawer(page)
        await clickInCanvas({article, button: 'left', x: 50, y: 50})
        await clickInCanvas({article, button: 'left', x: 100, y: 50})
        await expect(page).toHaveScreenshot('expect-2-circles-after-click.png')
    })
    test('click inside a circle to select it and open a dialog', async ({page}) => {
        const article = await navigateToCircleDrawer(page)
        await clickInCanvas({article, button: 'left', x: 50, y: 50})
        await clickInCanvas({article, button: 'left', x: 50, y: 50})
        await expect(getCircleDiameterMenu(page)).toBeVisible()
    })
    test('adjust the size of the selected circle', async ({page}) => {
        const article = await navigateToCircleDrawer(page)
        await clickInCanvas({article, button: 'left', x: 50, y: 50})
        await clickInCanvas({article, button: 'left', x: 50, y: 50})
        await selectCircleDiameter(page, 100);
        await expect(page).toHaveScreenshot('expect-100-diameter-circle-after-using-range-input.png');
    })

    test.describe("undo button", async () => {
        test('undo button is disabled until an action is taken', async ({page}) => {
            const article = await navigateToCircleDrawer(page);
            await expect(getUndoButton(page)).toBeDisabled()
            await clickInCanvas({article, button: 'left', x: 50, y: 50})
            await expect(getUndoButton(page)).toBeEnabled()
        })
        test('undo button undoes the last action taken', async ({page}) => {
            const article = await navigateToCircleDrawer(page);
            await clickInCanvas({article, button: 'left', x: 50, y: 50})
            await clickUndoButton(page)
            await expect(page).toHaveScreenshot('expect-0-circles-after-undo.png');
        })
    })

    test.describe("redo button", async () => {
        test('redo button is disabled until there is one undo', async ({page}) => {
            const article = await navigateToCircleDrawer(page);
            await expect(getRedoButton(page)).toBeDisabled()
            await clickInCanvas({article, button: 'left', x: 50, y: 50})
            await expect(getRedoButton(page)).toBeDisabled()
            await clickUndoButton(page)
            await expect(getRedoButton(page)).toBeEnabled()
        })
        test('redo button redoes the last undo', async ({page}) => {
            const article = await navigateToCircleDrawer(page);
            await clickInCanvas({article, button: 'left', x: 50, y: 50})
            await clickUndoButton(page)
            await clickRedoButton(page)
            await expect(page).toHaveScreenshot('expect-1-circle-after-undo-then-redo.png');
        })
    })
});
