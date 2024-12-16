import {Page} from "@playwright/test";
import {FlightType} from "../../src/flightBooker/logic";
import {goToHomePage} from "../app";

const navigateToArticle = async (page: Page) => {
    await goToHomePage(page);
    await page.getByRole("link", {name: "Flight Booker"}).click()
    return getArticle(page);
}

const getArticle = (page: Page) =>
    page.getByRole("article", {name: "flight booker"});

const getDepartureDateInput = (page: Page) =>
    page.locator("#departureDate");

const getArrivalDateInput = (page: Page) =>
    page.locator("#arrivalDate");

const getFightTypeDropdown = (page: Page) =>
    page.locator("#flightType");

const dateToString = (date: Date): string => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

const changeFlightType = async (page: Page, flightType: FlightType) => {
    await getFightTypeDropdown(page).selectOption(flightType);
};

const typeDepartureDate = async (page: Page, date: string) => {
    const departureDateInput = getDepartureDateInput(page);
    await departureDateInput.fill(date)
};

const typeArrivalDate = async (page: Page, date: string) => {
    const arrivalDateInput = getArrivalDateInput(page);
    await arrivalDateInput.fill(date)
};

const getBookFlightButton = (page: Page) =>
    getArticle(page).getByRole("button");

const clickOnBookFlightButton = async (page: Page) =>
    await getBookFlightButton(page).click();

const getBookStatusMessage = (page: Page) =>
    getArticle(page).locator("#bookStatus");

export {
    getArticle,
    getDepartureDateInput,
    getArrivalDateInput,
    dateToString,
    getFightTypeDropdown,
    changeFlightType,
    typeDepartureDate,
    typeArrivalDate,
    getBookFlightButton,
    clickOnBookFlightButton,
    getBookStatusMessage,
    navigateToArticle,
}
