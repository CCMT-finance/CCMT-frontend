import tokenlist from "../json/tokenlist.json";


export const mapObject = <T extends object, Ret>(object: T, apply: (key: keyof T) => Ret) => {
    return Object.keys(object).reduce((acc, val) => {
        return {...acc, [val]: apply(val as keyof T)}
    }, {} as { [key in keyof T]: Ret })
}

export const logoUrl = (symbol: string) => tokenlist.tokens.find(tokenFromList => tokenFromList.symbol === symbol)?.logoURI ?? ""

