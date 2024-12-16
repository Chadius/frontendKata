import {expect, test} from "@playwright/test";
import {goToHomePage} from "../app";
import {
    changeFlightType,
    clickOnBookFlightButton,
    dateToString,
    getArrivalDateInput,
    getArticle,
    getBookFlightButton,
    getBookStatusMessage,
    getDepartureDateInput,
    getFightTypeDropdown,
    typeArrivalDate,
    typeDepartureDate
} from "./flightBooker";
import {FlightType} from "../../src/flightBooker/logic";

test.describe("flightBooker", async () => {
    test('has article with the name of the component', async ({page}) => {
        await goToHomePage(page);
        const article = getArticle(page);
        await expect(article).toHaveText(/Flight Booker/);
    });

    test('expect today date from date inputs and dropdown for flight type', async ({page}) => {
        await goToHomePage(page);
        const today = new Date();
        await expect(getDepartureDateInput(page)).toHaveValue(dateToString(today))
        await expect(getArrivalDateInput(page)).toHaveValue(dateToString(today))
        await expect(getFightTypeDropdown(page)).toHaveValue(FlightType.ONE_WAY_FLIGHT)
    })

    test('arrival date is enabled if booking is return trip', async ({page}) => {
        await goToHomePage(page);
        await expect(getArrivalDateInput(page)).toBeDisabled()

        await changeFlightType(page, FlightType.RETURN_FLIGHT)

        await expect(getFightTypeDropdown(page)).toHaveValue(FlightType.RETURN_FLIGHT)
        await expect(getArrivalDateInput(page)).not.toBeDisabled()
    })

    test('typing an invalid date highlights the field and disables the button', async ({page}) => {
        await goToHomePage(page);
        await changeFlightType(page, FlightType.RETURN_FLIGHT)
        await typeDepartureDate(page, "not a valid date")
        await expect(getDepartureDateInput(page)).toHaveClass("error")

        await typeArrivalDate(page, "not a valid date")
        await expect(getArrivalDateInput(page)).toHaveClass("error")
        await expect(getBookFlightButton(page)).toBeDisabled()
    })

    test('return flight where the arrival date is before the departure date disables the Booking button', async ({page}) => {
        await goToHomePage(page);
        await changeFlightType(page, FlightType.RETURN_FLIGHT)
        await typeDepartureDate(page, "06/01/2024")
        await typeArrivalDate(page, "01/15/2000")
        await expect(getBookFlightButton(page)).toBeDisabled()
    })

    test('show a success message when you click the Book button with valid data', async ({page}) => {
        await goToHomePage(page);
        await changeFlightType(page, FlightType.ONE_WAY_FLIGHT)
        await typeDepartureDate(page, "06/01/2024")
        await clickOnBookFlightButton(page)
        await expect(getBookStatusMessage(page)).toHaveText("You have booked a one-way flight on 06/01/2024.")
    })
})
