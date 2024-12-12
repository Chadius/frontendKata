import {expect, test} from "@playwright/test";
import {goToHomePage} from "../app";
import {
    getArticle,
    getDurationInput,
    getProgressGauge,
    getTimeElapsedLabel,
    installMockClock,
    fastForwardClockForMilliseconds, clickOnResetButton, moveRangeInput, pauseMockClock
} from "./timer";
import {defaultTimerState} from "../../src/timer/timerState";

test.describe("timer", async () => {
    test('has article with the name of the component', async ({page}) => {
        await installMockClock(page, new Date('2024-02-02T08:00:00'))
        await goToHomePage(page);
        const article = getArticle(page);
        await expect(article).toHaveText(/Timer/);
    });

    test('page starts with default values', async ({page}) => {
        await installMockClock(page, new Date('2024-02-02T08:00:00'))
        await pauseMockClock(page, new Date('2024-02-02T08:00:00'))

        await goToHomePage(page);
        await expect(getProgressGauge(page)).toHaveAttribute("value", "0")
        await expect(getTimeElapsedLabel(page)).toHaveText("0.0s")
        await expect(getDurationInput(page)).toHaveValue(defaultTimerState().duration.toString());
    })

    test('fills the gauge as time progresses', async ({page}) => {
        await installMockClock(page, new Date('2024-02-02T08:00:00'))
        await goToHomePage(page);
        await fastForwardClockForMilliseconds(page, 1100);
        await expect(getTimeElapsedLabel(page)).toHaveText(/1.\d?s/)
        await expect(getProgressGauge(page)).toHaveAttribute("value", /0.2\d*/)
    })

    test('clicking the reset button will reset the gauge', async ({page}) => {
        await installMockClock(page, new Date('2024-02-02T08:00:00'))
        await goToHomePage(page);
        await fastForwardClockForMilliseconds(page, 1100);
        await clickOnResetButton(page);
        await expect(getProgressGauge(page)).toHaveAttribute("value", "0")
        await expect(getTimeElapsedLabel(page)).toHaveText("0.0s")
    })

    test('moving the range input will change the gauge', async ({page}) => {
        await installMockClock(page, new Date('2024-02-02T08:00:00'))
        await goToHomePage(page);
        await fastForwardClockForMilliseconds(page, defaultTimerState().duration);
        await moveRangeInput(page, defaultTimerState().duration * 2);
        await expect(getDurationInput(page)).toHaveValue((defaultTimerState().duration * 2).toString());
        await expect(getProgressGauge(page)).toHaveAttribute("value", /0.5\d*/)
    })
})
