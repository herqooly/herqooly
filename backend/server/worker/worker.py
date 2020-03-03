from django_rq import job

from worker.runner import go_runner


@job
def func3(params):
    print("WORKER 3")
    print(params)
    if "script_id" in params:
        go_runner(params["script_id"])

    return True
