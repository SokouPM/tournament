import winston from "winston"

export const logger = winston.createLogger({
	level: "debug",
	format: winston.format.combine(
		winston.format.timestamp({
			format: () => {
				const date = new Date()
				const year = date.getFullYear()
				const month = (date.getMonth() + 1).toString().padStart(2, "0")
				const day = date.getDate().toString().padStart(2, "0")
				const hours = date.getHours().toString().padStart(2, "0")
				const minutes = date.getMinutes().toString().padStart(2, "0")
				const seconds = date.getSeconds().toString().padStart(2, "0")
				const milliseconds = date.getMilliseconds().toString().padStart(3, "0")

				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
			},
		}),
		winston.format.colorize(),
		winston.format.simple(),
		winston.format.printf((info): string => {
			return `[${info.timestamp}] ${info.level}: ${info.message}`
		}),
	),
	transports: [new winston.transports.Console()],
})