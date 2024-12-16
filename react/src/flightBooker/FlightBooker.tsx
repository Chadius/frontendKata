import {
    FlightBookerInformation,
    FlightType,
    getFlightStatusMessage,
    newFlightBookerData,
    validateFieldStatus
} from "./logic.ts";
import {ChangeEvent, useState} from "react";

const FlightBooker = () => {
    const [flightBookerStatus, setFlightBookerStatus] = useState<FlightBookerInformation>(newFlightBookerData())
    const [flightStatusMessage, setFlightStatusMessage] = useState<string>("")

    const onChangeFlightType = (e: ChangeEvent<HTMLSelectElement>) => {
        const flightType: FlightType = e.target.value as FlightType;
        const newFlightBookerStatus: FlightBookerInformation = {
            ...flightBookerStatus,
            flightType: flightType,
        }
        setFlightBookerStatus(
            validateFieldStatus(newFlightBookerStatus)
        )
        setFlightStatusMessage("")
    }
    const onChangeDepartureDate = (e: ChangeEvent<HTMLInputElement>) => {
        const departureDate: string = e.target.value;
        const newFlightBookerStatus: FlightBookerInformation = {
            ...flightBookerStatus,
            departureDate: departureDate,
        }
        setFlightBookerStatus(
            validateFieldStatus(newFlightBookerStatus)
        )
        setFlightStatusMessage("")
    }
    const onChangeArrivalDate = (e: ChangeEvent<HTMLInputElement>) => {
        const arrivalDate: string = e.target.value;
        const newFlightBookerStatus: FlightBookerInformation = {
            ...flightBookerStatus,
            arrivalDate: arrivalDate,
        }
        setFlightBookerStatus(
            validateFieldStatus(newFlightBookerStatus)
        )
        setFlightStatusMessage("")
    }
    const onClickBookButton = () => {
        setFlightStatusMessage(getFlightStatusMessage(flightBookerStatus))
    }

    return (
        <article aria-label={"flight booker"}>
            <h1>Flight Booker</h1>

            <select name="flightType" id="flightType" defaultValue={flightBookerStatus.flightType}
                    onChange={onChangeFlightType}>
                <option value={FlightType.ONE_WAY_FLIGHT}>One-Way Flight</option>
                <option value={FlightType.RETURN_FLIGHT}>Return Flight</option>
            </select>
            <input id="departureDate" name="departureDate" type={"text"} defaultValue={flightBookerStatus.departureDate}
                   className={
                       flightBookerStatus.departureDateIsValid ? "" : "error"}
                   onChange={onChangeDepartureDate}
            />
            <input id="arrivalDate" name="arrivalDate" type={"text"} defaultValue={flightBookerStatus.arrivalDate}
                   disabled={!flightBookerStatus.arrivalDateIsRequired}
                   onChange={onChangeArrivalDate}
                   className={
                       !flightBookerStatus.arrivalDateIsRequired || flightBookerStatus.arrivalDateIsValid ? "" : "error"}
            />
            <button disabled={!flightBookerStatus.enableBookButton} onClick={onClickBookButton}>Book</button>
            <p id={"bookStatus"}>{flightStatusMessage}</p>
        </article>
    )
};

export default FlightBooker
