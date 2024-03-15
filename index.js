const zeebe = require('zeebe-node');

const zbc = new zeebe.ZBClient("172.22.6.13:8238");

const zbWorker = zbc.createWorker({
    taskType: 'scriptJs',
    taskHandler: handler,
})

zbWorker.on('ready', () => console.log(`Worker connected!`))
zbWorker.on('connectionError', () => console.log(`Worker disconnected!`))

function handler(job) {

    zbWorker.log("started : scriptJs")
    zbWorker.log("variables : ".concat(JSON.stringify(job.variables)))


    const response = {
        result: null,
        error: null
    };
    try {
        zbWorker.log(job.variables.script)
        let result = eval(job.variables.script);
        zbWorker.log(result)
        response.result = result;
    } catch (err) {
        response.error = {
            code: "500",
            message: err.message,
            ...err
        }
    }

    zbWorker.log("response ".concat(JSON.stringify(response)))

    job.complete({response: response});
}