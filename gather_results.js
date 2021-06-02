const fs = require("fs");

const STATS_CSV_REGEX = /^(\d+).*stats\.csv$/

const getFileLines = (fileName) => fs.readFileSync(fileName)
    .toString()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter(line => line.length != 0);

if (process.argv.length < 3) {
    console.error("Missing results directory!");
    process.exit(1);
}

const dir = process.argv[2];
const fileNames = fs
    .readdirSync(dir)
    .filter(fileName => fileName.match(STATS_CSV_REGEX));

if (fileNames.length === 0) {
    console.error("No stats csv file found in the specified directory!");
    process.exit(2);
}

const inpustCsvHeaderTokens = getFileLines(`${dir}/${fileNames[0]}`)[0].split(",");
inpustCsvHeaderTokens.splice(4, 0, "Failure %");
inpustCsvHeaderTokens.splice(0, 0, "Num Users");
const csvHeader = inpustCsvHeaderTokens.join(",");
console.info(csvHeader);

const testResults = fileNames.map(fileName => {
    const numUsers = STATS_CSV_REGEX.exec(fileName)[1];
    const lines = getFileLines(`${dir}/${fileName}`);
    const csvTokens = lines[lines.length - 1].split(",");
    const reqCount = parseInt(csvTokens[2], 10);
    const failCount = parseInt(csvTokens[3], 10);
    const failPercentage = `${((failCount / reqCount) * 100).toFixed(2)}%`;
    csvTokens.splice(4, 0, failPercentage);
    csvTokens.splice(0, 0, numUsers);
    const csvLine = csvTokens.join(",");
    return [numUsers, csvLine];
});

testResults
    .sort(([numUsersA, _x1], [numUsersB, _x2]) => numUsersA - numUsersB)
    .forEach(([_numUsers, csvLine]) => console.info(csvLine));
