const convertCelsiusToFahrenheit = (degrees: number): number => {
    return (degrees * 9 / 5) + 32
}

const convertFahrenheitToCelsius = (degrees: number): number => {
    return (degrees - 32) * 5 / 9;
};

export {
    convertCelsiusToFahrenheit,
    convertFahrenheitToCelsius,
}
