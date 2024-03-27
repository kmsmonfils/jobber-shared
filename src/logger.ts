import winston, {Logger} from "winston";
import {ElasticsearchTransport, ElasticsearchTransformer, LogData, TransformedData} from "winston-elasticsearch";

const esTransformer = (logData: LogData): TransformedData => ElasticsearchTransformer(logData);

export const winstonLogger = (elasticSearchNode: string, name: string, level: string): Logger => {
    const options = {
        console: {
            level,
            handleExceptions: true,
            json: false,
            colorize: true
        },
        elasticSearch: {
            level,
            transformer: esTransformer,
            clientOpts: {
                node: elasticSearchNode,
                log: level,
                maxRetries: 2,
                requestTimeout: 10000,
                sniffOnStart: false
            }
        }
    };
    const eTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticSearch);
    const logger: Logger = winston.createLogger({
        exitOnError: false,
        defaultMeta: {service: name},
        transports: [new winston.transports.Console(options.console), eTransport],
    })
    return logger
}