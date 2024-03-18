const zeebe = require('zeebe-node');

const zbc = new zeebe.ZBClient(process.env.ZEEBE_GATEWAY_ADDRESS);

const zbWorker = zbc.createWorker({
    taskType: process.env.SERVICE_TASK_TYPE,
    taskHandler: handler,
})

zbWorker.on('ready', () => {
    console.log(`Worker connected!`)
    console.log(process.env.ZEEBE_GATEWAY_ADDRESS)
    console.log(process.env.SERVICE_TASK_TYPE)
})
zbWorker.on('connectionError', () => console.log(`Worker disconnected!`))

function handler(job) {

    zbWorker.log("started : " + process.env.SERVICE_TASK_TYPE)
    zbWorker.log("variables : ".concat(JSON.stringify(job.variables)))


    const response = {
        result: null,
        error: null
    };
    try {
        zbWorker.log(job.variables.script);
        let variables={};

        for (const key of Object.keys(job.variables.variables)) {
            variables[key]=JSON.stringify(job.variables.variables[key])
        }

        let script = replace(job.variables.script, variables)

        let result = eval(script);
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

function replace(pattern, variables) {
    let sb = '';
    let strArray = pattern.split('');
    let i = 0;
    while (i < strArray.length - 1) {
        if (strArray[i] === '$' && strArray[i + 1] === '{') {
            i = i + 2;
            let begin = i;
            while (strArray[i] !== '}') ++i;
            sb += variables[pattern.substring(begin, i++)];
        } else {
            sb += strArray[i];
            ++i;
        }
    }
    if (i < strArray.length) sb += strArray[i];
    return sb;
}