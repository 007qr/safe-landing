export class ErrorBase<T extends string> extends Error {
    name: T
    message: string
    status: number
    cause?: any

    constructor({
                    name,
                    message,
                    status,
                    cause,
                }: {
        name: T
        message: string
        status: number
        cause?: any
    }) {
        super()
        this.name = name
        this.message = message
        this.cause = cause
        this.status = 500
    }

    setStatus(status: number) {
        this.status = status
    }

    getStatus(): number {
        return this.status
    }
}
