import { decodeBase85, encodeBase85 } from '@nurliman/base85'

export const InternalCrypt = () => {
    const secret = import.meta.env.VITE_INTERNAL_HASHER_SECRET;

    const crypt = (text: string, salt: string = secret) => {
        const textToChars = (text: string) =>
            text.split('').map((c) => c.charCodeAt(0))
        const byteHex = (n: any) => `0${Number(n).toString(16)}`.substr(-2)
        const applySaltToChar = (code: any) =>
            textToChars(salt).reduce((a, b) => a ^ b, code)

        return text
            .split('')
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join('')
    }

    const decrypt = (text: string, salt: string = secret) => {
        const textToChars = (text: string) =>
            text.split('').map((c) => c.charCodeAt(0))
        const applySaltToChar = (code: any) =>
            textToChars(salt).reduce((a, b) => a ^ b, code)
        return text
            .match(/.{1,2}/g)
            ?.map((hex: string) => Number.parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode: number) => String.fromCharCode(charCode))
            .join('')
    }

    return { crypt, decrypt }
}

export const Base85Crypt = () => {
    const secret = import.meta.env.VITE_INTERNAL_HASHER_SECRET

    const crypt = (text: string, salt: string = secret) => {
        return encodeBase85(salt + text)
    }

    const decrypt = (text: string) => {
        return decodeBase85(text).slice(secret.length)
    }

    return { crypt, decrypt }
}
