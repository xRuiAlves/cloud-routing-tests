# Cloud Routing Tests - Find a Baseline

## Goals

Understand the request load that an Heroku PaaS machine hosting a small Django application can hold. The results should serve as a baseline for future tests.

## Infrastructure Specifications

- An Heroku PaaS machine was used to host the Django application using a [standard Python buildpack](https://devcenter.heroku.com/articles/deploying-python)
- 512MB of RAM
- Single Core
- The full scecifications may be consulted [here](https://www.heroku.com/pricing)

## Running the Test

- The `locust.py` script includes the testing process workers information
- The `run_tests.sh` will run the full test suite
- The testing process generates both `csv` and `html` file reports
- The `gather_results.js` script may be used to aggregate the test results for easier visualisation

## Considerations

- All users periodically generate a new request
- User requests timeout after a given timeout period, considering their request to be failed
- Since the number of users was high, a "user hatching period" was taken (to generate the user workers). Results from the hatching period are not considered (results start being gathered and the test begins after all the users are hatched).
- The infrastructure that is accessed via the `run_tests.sh` test script is already up and running

## Parameters

- Each test run took 150 seconds
- The number of users was constant each test
- The number of users ranged from 100 to 2500, with an increment of 100 users per test (first test used 100 users, second test used 200 users, ...)
- Each user generated a new request every 0.5 to 2 seconds (following an uniform distribution between these values)
- Each user timed out (resulting in a failure) after a 10 seconds period without receiving a response

## Notes

- The `csv` file results were aggregated for evaluation using the `gather_results.js` script into the `aggregated_results.csv` file

## Results and Evaluation

- All the failed requests resulted from timeout
- Considering that the "machine limit" is reached after a the 10 seconds average response time threshold is met, the limit was reached at 1900 users
- That being said, the maximum supported user load is estimated to be 1800 users (which may be used as a baseline for future tests)

### Failure Rate based on the Number of Users

![Failure rate based on the Number of Users](https://i.imgur.com/F8vj5E8.png)

### Average Response Time based on Number of Users

![Average Response Time based on Number of Users](https://i.imgur.com/oj5wNWR.png)
