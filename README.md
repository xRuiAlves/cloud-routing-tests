# Cloud Routing Tests - Plugin Validation

## Goal

Validate if, in a deployment that resulted from the [django-cloud-deployer](https://pypi.org/project/django-cloud-deployer/) plugin, incoming traffic is being routed to the expect PaaS and FaaS targets.

## Deployments

In the context of the validation process, two open-source projects and a simple Django application were deployed using the plugin:

- [MeetHub + Django Cloud Deployer](https://github.com/xRuiAlves/meethub) - A fork of the [MeetHub](https://github.com/iyanuashiri/meethub) event management system open-source project;
- [Spirit + Django Cloud Deployer](https://github.com/xRuiAlves/Spirit) - A fork of the [Spirit](https://github.com/nitely/Spirit) Python based forum open-source project
- [Django Polls App + Django Cloud Deployer](https://github.com/xRuiAlves/dpa) - A  Django Polls web app that is highly based on the [Writing your first Django App](https://www.djangoproject.com/start/) tutorial.

## Configuration Files

A set of three test configuration files were created to indicate which is the expected routing result for a list of incoming requests. The configuration files follow the following structure:

```json
{
    "domain": "basedomain.example.org",
    "paasDomain": "paas.basedomain.example.org",
    "faasDomain": "faas.basedomain.example.org",
    "paasTargetUrls": [
        "sample/paas/url/1",
        "sample/paas/url/2",
        "sample/paas/url/3"
    ],
    "faasTargetUrls": [
        "sample/faas/url/1",
        "sample/faas/url/2",
        "sample/faas/url/3"
    ]
}
```

For each of the aforementioned deployed projects, a configuration file is provided:

- MeetHub: `meethub/mhub.json`
- Spirit: `spirit/spirit.json`
- Django poll app: `dpa/dpa.json`

## Running the Tests

- Run the `validate.js` script, specifying the target configuration file
    - Usage: `node validate.js <configuration file>`
    - Example: `node validate.js dpa/dpa.json`
- The testing process will be logged throughout the script execution
- When the testing is finished and output `<proj>_report.json` report file will be created with the detailed results. The `successRate` value (which is expected to be `100.00%` in all the provided samples) shows the percentage of requests that were routed to the expected cloud resource

Example report file (matching the above example test configuration):

```json
{
    "domain": "basedomain.example.org",
    "paasDomain": "paas.basedomain.example.org",
    "faasDomain": "faas.basedomain.example.org",
    "successRate": "100.00%",
    "results": [
        {
            "url": "http://basedomain.example.org/url/1/",
            "expectedDomain": "faas.basedomain.example.org",
            "obtainedDomain": "faas.basedomain.example.org",
            "success": true
        },
        {
            "url": "http://basedomain.example.org/url/2/",
            "expectedDomain": "faas.basedomain.example.org",
            "obtainedDomain": "faas.basedomain.example.org",
            "success": true
        },
        {
            "url": "http://basedomain.example.org/url/3/",
            "expectedDomain": "faas.basedomain.example.org",
            "obtainedDomain": "faas.basedomain.example.org",
            "success": true
        },
        {
            "url": "http://basedomain.example.org/url/1/",
            "expectedDomain": "paas.basedomain.example.org",
            "obtainedDomain": "paas.basedomain.example.org",
            "success": true
        },
        {
            "url": "http://basedomain.example.org/url/2/",
            "expectedDomain": "paas.basedomain.example.org",
            "obtainedDomain": "paas.basedomain.example.org",
            "success": true
        },
        {
            "url": "http://basedomain.example.org/url/3/",
            "expectedDomain": "paas.basedomain.example.org",
            "obtainedDomain": "paas.basedomain.example.org",
            "success": true
        }
    ]
}

```

## Considerations

- The deployment is up and running

## Results

Each of the validation scenarios was successful, resulting in a `successRate` of `100.00%` (as expected). The resulting report files are available for each scenario:

- MeetHub: `meethub/mhub_report.json`
- Spirit: `spirit/spirit_report.json`
- Django poll app: `dpa/dpa_report.json`
