# Cloud Routing Tests

## Goal

Understand which routing methodologies provide the best results (in terms of client latency) in different cloud infrastructures (Paas and FaaS).

## Routing Methodologies

1. **RT1 - Nginx Router**: An Nginx web server instance routes incoming requests to either PaaS or FaaS based on a configuration file;
2. **RT2 - Cloud Function Router**: A cloud function routes incoming requests to either PaaS or FaaS based on the requested resource;
3. **RT3 - Cloud Function Router + Web Server**: A cloud function either routes incoming request to a PaaS instance or executes and answers to the request locally, based on the requested resource;
4. **RT4 - DNS Resolution**: Web requests are resolved into PaaS or FaaS instances based on DNS configurations, as opposed to having a device responsible for routing traffic as in the aforementioned techniques.

## Infrastructure Cluster Specifications

- 6 Azure Virtual Machines (IaaS VPS machines)
- The VMs are `B1s` instances, featuring:
    - 1 vCPU
    - 1 GiB of RAM
    - 2 SSD data disks
    - Maximum cap of 320 IOPS
- The geographic distribution was as follows:
    - 1 machine in West Europe
    - 1 machine in North Europe
    - 1 machine in the Middle East (United Arab Emirates)
    - 1 machine in Southeast Asia
    - 1 machine in North America (East United States)
    - 1 machine in Africa (South Africa)

## Running the Tests

- The `locust.py` script includes the testing process workers information
- Setup the master and worker configurations:
    - Master Node: Specify the number of expected workers in the cluster in the `configs/cluster_num_workers.txt` file
    - Worker Nodes: Specify the master node ip address in the `configs/cluster_master_ip.txt` file (master and worker nodes must share a network)
- The `run_tests.sh` will run the full test suite
    - Master node: Run the `run_tests.sh` script in master mode (`run_tests.sh master`)
    - Worker nodes: Run the `run_tests.sh` script in worker mode (`run_tests.sh worker`)
- The testing process generates both `csv` and `html` file reports (in the master node)
- The `gather_results.js` script may be used to aggregate the test results for easier visualisation

## Considerations

- All users periodically generate a new request
- User requests timeout after a given timeout period, considering their request to be failed
- Since the number of users was high, a "user hatching period" was taken (to generate the user workers). Results from the hatching period are not considered (results start being gathered and the test begins after all the users are hatched)
- In the cluster mode, the user load (which generated the requests) is evenly distributed to all the cluster machines
- The infrastructure that is accessed via the `run_tests.sh` test script is already up and running

## Parameters

- Each test run took 200 seconds
- The number of users was constant each test
- The number of users ranged from 500 to 2000, with an increment of 500 users per test (first test used 500 users, second test used 1000 users, ...)
- Each user generated a new request every 0.5 to 2 seconds (following an uniform distribution between these values)
- Each user timed out (resulting in a failure) after a 10 seconds period without receiving a response

## Notes

- The `csv` file results were aggregated for evaluation using the `gather_results.js` script into the `aggregated_results.csv` file

## Results and Evaluation

- Regarding the failure rate, most of the methods did not originate any failures. The small amount of failures was sporadic, and resulted from timeout. However, in **RT4**, whenever the user amount was greater or equal than 1500, timeout errors related to the DNS resolution issues occurred:

![Max Failure Rate based on Routing Method](https://i.imgur.com/BJKMc5s.png)

- Regarding the average response time, a tendency for the time to increase based on the number of users was detected in all routing methodologies (as expected). The routing methodology that showed the lowest average response time for higher user loads was, as expected, **RT3**:

![Average Response Time based on Routing Method](https://i.imgur.com/MQf7hQN.png)

- Depending on the routing methodology, different time portions were spent on FaaS or PaaS execution. In **RT3**, most of the execution time was spent on PaaS execution (as expected):

![Average PaaS Response Time vs Average FaaS Response Time on different Routing Methods](https://i.imgur.com/41RKiUU.png)

## Final Remarks

The executed tests show evidence that the routing method that results in the least client latency for higher user loads, in either the used testing environments, is the FaaS execute local or redirect to PaaS Routing methodology. This routing methodology will be used in the plugin PoC development.