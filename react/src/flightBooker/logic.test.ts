import {describe, expect, it} from "vitest";
import {FlightType, getFlightStatusMessage, newFlightBookerData, validateFieldStatus} from "./logic";

describe('Flight Booker', () => {
    it("should enable the arrival flight date field if the flight type is return flight", () => {
        const data = newFlightBookerData()
        data.flightType = FlightType.RETURN_FLIGHT
        const guiFieldStatus = validateFieldStatus(data)
        expect(guiFieldStatus.arrivalDateIsRequired).toBeTruthy();
    })

    it("should disable the arrival flight date field if the flight type is one way flight", () => {
        const data = newFlightBookerData()
        data.flightType = FlightType.ONE_WAY_FLIGHT
        const guiFieldStatus = validateFieldStatus(data)
        expect(guiFieldStatus.arrivalDateIsRequired).toBeFalsy();
    })

    describe('Invalid date fields disable the booking button', () => {
        it("departure date", () => {
            const data = newFlightBookerData()
            data.departureDate = "this is not a valid date"
            const guiFieldStatus = validateFieldStatus(data)
            expect(guiFieldStatus.departureDateIsValid).toBeFalsy();
            expect(guiFieldStatus.enableBookButton).toBeFalsy();
        })
        it("arrival date", () => {
            const data = newFlightBookerData()
            data.flightType = FlightType.RETURN_FLIGHT
            data.arrivalDate = "this is not a valid date"
            const guiFieldStatus = validateFieldStatus(data)
            expect(guiFieldStatus.arrivalDateIsValid).toBeFalsy();
            expect(guiFieldStatus.enableBookButton).toBeFalsy();
        })
    });

    it("should disable the booking if the return flight date is strictly before the departure flight date", () => {
        const data = newFlightBookerData()
        data.departureDate = "03/01/2024"
        data.arrivalDate = "01/15/2022"
        data.flightType = FlightType.RETURN_FLIGHT
        const guiFieldStatus = validateFieldStatus(data)
        expect(guiFieldStatus.departureDateIsValid).toBeTruthy();
        expect(guiFieldStatus.arrivalDateIsValid).toBeTruthy();
        expect(guiFieldStatus.enableBookButton).toBeFalsy();
    })

    it("should print out a message if the flight is valid", () => {
        const data = newFlightBookerData()
        data.departureDate = "03/01/2024"
        data.arrivalDate = "08/15/2024"
        data.flightType = FlightType.RETURN_FLIGHT
        const guiFieldStatus = validateFieldStatus(data)
        expect(guiFieldStatus.departureDateIsValid).toBeTruthy();
        expect(guiFieldStatus.arrivalDateIsValid).toBeTruthy();
        expect(guiFieldStatus.enableBookButton).toBeTruthy();

        expect(getFlightStatusMessage(data)).toBe("You have booked a return flight from 03/01/2024 to 08/15/2024.");
    })
});
