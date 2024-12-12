import {Page} from "@playwright/test";

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "timer"});

const getProgressGauge = (page: Page) =>
    getArticle(page).getByRole("progressbar");

const getTimeElapsedLabel = (page: Page) =>
    getArticle(page).locator("#time-elapsed")

const getDurationInput = (page: Page) =>
    getArticle(page).locator("#duration");

const installMockClock = async (page: Page, startTime: Date) =>
    await page.clock.install({time: startTime});

const pauseMockClock = async (page: Page, startTime: Date) =>
    await page.clock.pauseAt(startTime);

const fastForwardClockForMilliseconds = async (page: Page, millisecondsToRun: number) =>
    await page.clock.fastForward(millisecondsToRun);

const clickOnResetButton = async (page: Page) =>
    await getArticle(page).getByRole("button").click();

const moveRangeInput = async (page: Page, duration: number) =>
    await getDurationInput(page).fill(duration.toString())

export {
    getArticle,
    getProgressGauge,
    getTimeElapsedLabel,
    getDurationInput,
    installMockClock,
    fastForwardClockForMilliseconds,
    clickOnResetButton,
    moveRangeInput,
    pauseMockClock,
}
