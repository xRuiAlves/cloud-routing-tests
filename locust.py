from locust import HttpUser, between, task

class User(HttpUser):
    wait_time = between(0.5, 2)

    # The /polls/help endpoint is redirected to PaaS
    @task(1)
    def polls_help(self):
        self.client.get(
            url = "/polls/help",
            name = "/polls/help (PaaS)",
            timeout = 10.0,
        )

    # The /polls/contacts endpoint is redirected to FaaS
    @task(1)
    def polls_contacts(self):
        self.client.get(
            url = "/polls/contacts",
            name = "/polls/contacts (FaaS)",
            timeout = 10.0,
        )
