from locust import HttpUser, between, task

class User(HttpUser):
    wait_time = between(0.5, 2)

    @task
    def polls_id_results(self):
        self.client.get(
            url = "/polls/help",
            timeout = 10.0,
        )
