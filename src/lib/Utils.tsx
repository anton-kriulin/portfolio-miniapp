interface ISigns {
    negative: string
    positive: string
}

export interface IStyles {
    [key: string]: {
        [key: string]: string | number
    }
}

export const stylesToCss = (styles: IStyles) => {

    const toKebabCase = (str: string) => 
        str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

    let cssString = "";

    for(const className in styles) {
        if(!styles.hasOwnProperty(className)) { continue }

        cssString += `.${toKebabCase(className)} {\n`;

        for(const property in styles[className]) {
            if(!styles[className].hasOwnProperty(property)) { continue }

            const kebabProperty = toKebabCase(property);
            let value = styles[className][property];

            if (typeof value === 'number' && !['opacity', 'flex'].includes(property)) {
                value = `${value}px`;
            }

            cssString += `  ${kebabProperty}: ${value};\n`;
        }

        cssString += `}\n`;
        
    }

    return cssString;
}

export const numberToStringWithSymbol = (
    number: number, 
    symbol: string, 
    decimals: number, 
    showSign: boolean, 
    signType?: "arrow" | "line",
    ticker?: string
) => {
    if(!number || number === 0) { return "" }
    if(number === Infinity) { return "∞" }

    const signs: ISigns = {
        negative: "-",
        positive: "+"
    }
    if(signType === "arrow") {
        signs.negative = "▼";
        signs.positive = "▲";
    }

    let sign: string = "";
    if(number < 0) {
        sign = signs.negative
    }
    if(number > 0 && showSign) {
        sign = signs.positive;
    }
    
    return sign +
        (symbol !== "percent" ? (symbol || ticker + " ") : "") +
        numberToFixed(number, decimals, symbol === "percent") +
        (symbol === "percent" ? "%" : "");
}

export const getTransactionProfit = (worth?: number, value?: number) => {
    if(!value || !worth) { return }
    
    const transactionProfit = value - worth;
    return numberToStringWithSymbol(transactionProfit / Math.abs(worth) * 100,"percent", 2, true);
}

export const numberToFixed = (number: number, decimals: number = 2, percent?: boolean) => {
    return (
        (Math.abs(number) > 1 || percent)
        ? Math.abs(Number(number.toFixed(decimals))) 
        : Math.abs(Number(number.toPrecision(decimals+1))));
}
