enum FlightType {
    ONE_WAY_FLIGHT = "ONE_WAY_FLIGHT",
    RETURN_FLIGHT = "RETURN_FLIGHT",
}

export interface FlightBookerInformation {
    flightType: FlightType,
    departureDate: string,
    departureDateIsValid: boolean,
    arrivalDate: string,
    arrivalDateIsRequired: boolean,
    arrivalDateIsValid: boolean,
    enableBookButton: boolean,
}

const newFlightBookerData = (): FlightBookerInformation => {
    const today = new Date()
    const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`

    return {
        flightType: FlightType.ONE_WAY_FLIGHT,
        departureDate: todayStr,
        departureDateIsValid: true,
        arrivalDate: todayStr,
        arrivalDateIsRequired: false,
        arrivalDateIsValid: true,
        enableBookButton: true,
    }
}

const parseDateStringComponents = (dateString: string): Date | undefined => {
    const dateComponents: string[] = ['-', '/', '.'].reduce(
        (splitDateComponents: string[], dateSeparator: string): string[] => {
            if (splitDateComponents.length >= 3) {
                return splitDateComponents
            }
            return dateString.split(dateSeparator)
        },
        []
    )
    if (dateComponents.length < 3) return undefined
    const month = Number(dateComponents[0])
    const day = Number(dateComponents[1])
    const year = Number(dateComponents[2])
    if ([month, day, year].some(Number.isNaN)) return undefined
    const parsedDate = new Date(year, month - 1, day)
    return parsedDate.toString() === "Invalid Date" ? undefined : parsedDate
}

const validateFieldStatus = (data: FlightBookerInformation): FlightBookerInformation => {
    const dataToValidate = {...data}
    const departureDate = parseDateStringComponents(data.departureDate)
    dataToValidate.departureDateIsValid = departureDate !== undefined
    dataToValidate.arrivalDateIsRequired = data.flightType === FlightType.RETURN_FLIGHT

    let arrivalDateIsBeforeDepartureDate = undefined
    if (dataToValidate.arrivalDateIsRequired) {
        const arrivalDate = parseDateStringComponents(data.arrivalDate)
        dataToValidate.arrivalDateIsValid = arrivalDate !== undefined
        arrivalDateIsBeforeDepartureDate = departureDate !== undefined && arrivalDate !== undefined && arrivalDate?.valueOf() < departureDate?.valueOf()
    }

    dataToValidate.enableBookButton =
        dataToValidate.departureDateIsValid
        && (
            !dataToValidate.arrivalDateIsRequired
            || (
                dataToValidate.arrivalDateIsValid &&
                !arrivalDateIsBeforeDepartureDate
            )
        )
    return dataToValidate
}

const getFlightStatusMessage = (bookingInfo: FlightBookerInformation): string => {
    if (bookingInfo.enableBookButton && bookingInfo.flightType === FlightType.ONE_WAY_FLIGHT) {
        return `You have booked a one-way flight on ${bookingInfo.departureDate}.`
    }
    if (bookingInfo.enableBookButton && bookingInfo.flightType === FlightType.RETURN_FLIGHT) {
        return `You have booked a return flight from ${bookingInfo.departureDate} to ${bookingInfo.arrivalDate}.`
    }
    return ""
}

export {newFlightBookerData, FlightType, validateFieldStatus, getFlightStatusMessage}
