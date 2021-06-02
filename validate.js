const fetch = require("node-fetch");
const { parse } = require('tldts');
const fs = require('fs');

const validateInput = () => {
    if (process.argv.length < 3) {
        console.error("Missing configurations file specification.\n");
        console.error("Usage: node validate.js <configurations file>");
        process.exit(1);
    }
}

const getDomain = (url) => (
    fetch(url).then((res) => parse(res.url).hostname)
);

const validateDomains = async (configs) => {
    const results = [];
    
    for (const url of configs.faasTargetUrls) {
        const fullUrl = `http://${configs.domain}/${url}`;
        console.info(`Testing url: http://${configs.domain}/${url}`);

        const domain = await getDomain(`http://${configs.domain}/${url}`);
        const success = domain == configs.faasDomain;

        console.info(`Obtained domain: ${domain}`);
        console.info(`Expected domain: ${configs.faasDomain}`);
        console.info(`Success: ${success}\n`);

        results.push({
            url: fullUrl,
            expectedDomain: configs.faasDomain,
            obtainedDomain: domain,
            success: success,
        });
    }

    for (const url of configs.paasTargetUrls) {
        const fullUrl = `http://${configs.domain}/${url}`;
        console.info(`Testing url: http://${configs.domain}/${url}`);

        const domain = await getDomain(`http://${configs.domain}/${url}`);
        const success = domain == configs.paasDomain;

        console.info(`Obtained domain: ${domain}`);
        console.info(`Expected domain: ${configs.paasDomain}`);
        console.info(`Success: ${success}\n`);

        results.push({
            url: fullUrl,
            expectedDomain: configs.paasDomain,
            obtainedDomain: domain,
            success: success,
        });
    }

    const successRate = results.filter((result) => result.success).length / results.length;
    
    return {
        domain: configs.domain,
        paasDomain: configs.paasDomain,
        faasDomain: configs.faasDomain,
        successRate: `${(successRate * 100).toFixed(2)}%`,
        results,
    }
}

const main = async () => {
    validateInput();
    
    const configFile = process.argv[2];
    const configs = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    
    const validationResults = await validateDomains(configs);
    console.info(`\nDone. Success rate: ${validationResults.successRate}\n`)
    
    const outputFileName = `${configFile.split(".")[0]}_report.json`;
    fs.writeFileSync(
        outputFileName, 
        `${JSON.stringify(validationResults, null, 4)}\n`,
    );
    console.info(`A results detailed report file (${outputFileName}) has been created.`)
}

main();
