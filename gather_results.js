const fs = require("fs");

const STATS_CSV_REGEX = /^(.+)_(\d+).*stats\.csv$/

const getFileLines = (fileName) => fs.readFileSync(fileName)
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter(line => line.length != 0);

if (process.argv.length < 4) {
    console.error("Missing arguments! Usage:");
    console.error("node gather_results.js <results directory> <csv data line index>");
    process.exit(1);
}

const dir = process.argv[2];
const csvDataLineIndexRaw = process.argv[3];
const fileNames = fs
    .readdirSync(dir)
    .filter(fileName => fileName.match(STATS_CSV_REGEX));

if (fileNames.length === 0) {
    console.error("No stats csv file found in the specified directory!");
    process.exit(2);
}

if (isNaN(csvDataLineIndexRaw)) {
    console.error(`Invalid csv data line index (${csvDataLineIndexRaw}): must be a number`);
    process.exit(3);
}

const csvDataLineIndex = parseInt(csvDataLineIndexRaw, 10);
const numLines = getFileLines(`${dir}/${fileNames[0]}`).length;
if (isNaN(csvDataLineIndex) || csvDataLineIndex <= 0 || csvDataLineIndex >= numLines) {
    console.error(`Invalid csv data line index (${csvDataLineIndex}): must be between 1 and ${numLines - 1}`);
    process.exit(4);
}


const inpustCsvHeaderTokens = getFileLines(`${dir}/${fileNames[0]}`)[0].split(",");
inpustCsvHeaderTokens.splice(4, 0, "Failure %");
inpustCsvHeaderTokens.splice(0, 0, "Num Users");
inpustCsvHeaderTokens.splice(0, 0, "Routing method");
const csvHeader = inpustCsvHeaderTokens.join(",");
console.info(csvHeader);

const testResults = fileNames.map(fileName => {
    const matches = STATS_CSV_REGEX.exec(fileName);
    const routingMethod = matches[1];
    const numUsers = matches[2];
    const lines = getFileLines(`${dir}/${fileName}`);
    const csvTokens = lines[csvDataLineIndex].split(",");
    const reqCount = parseInt(csvTokens[2], 10);
    const failCount = parseInt(csvTokens[3], 10);
    const failPercentage = `${((failCount / reqCount) * 100).toFixed(2)}%`;
    csvTokens.splice(4, 0, failPercentage);
    csvTokens.splice(0, 0, numUsers);
    csvTokens.splice(0, 0, routingMethod);
    const csvLine = csvTokens.join(",");
    return [numUsers, routingMethod, csvLine];
});

testResults
    .sort(([numUsersA, routingMethodA], [numUsersB, routingMethodB]) => {
        return routingMethodA === routingMethodB
            ? numUsersA - numUsersB
            : routingMethodA.localeCompare(routingMethodB);
    })
    .forEach(([_numUsers, _routingMethod, csvLine]) => console.info(csvLine));
