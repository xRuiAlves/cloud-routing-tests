#!/bin/bash
nginx_router_host='https://thesis-nginx.herokuapp.com'
faas_lightweight_router_host='http://sls-weur-dev-faas-router.azurewebsites.net'
run_local_faas_or_redirect_to_remote_paas_router_host='https://sls-weur-dev-faas-local-or-paas-router.azurewebsites.net'
dns_routing_host='http://tese.ruialves.me'

test_results_dir='results'
user_hatching_rate=50
num_users_start=500
num_users_end=2000
num_users_step=500
test_base_duration_seconds=200
sleep_between_tests=10

if [[ "$1" != "worker" ]] && [[ "$1" != "master" ]]
then
    echo "Bad usage. Please specify if the script should run in 'master' or 'worker' mode."
    exit 1
fi

execute_locust_tests() {
    for (( num_users = $num_users_start; num_users <= $num_users_end; num_users = num_users + $num_users_step )) 
    do 
        test_prefix="$2_${num_users}users"
        html_file="${test_prefix}.html"
        hatching_duration=$(($num_users / $user_hatching_rate))
        test_total_duration_seconds=$(($test_base_duration_seconds + $hatching_duration))

        echo -e "\n>>> $2: Starting test with $num_users users ...\n"

        if [[ "$3" == "master" ]]
        then
            locust -f locust.py \
                --headless \
                --master \
                --expect-workers=$(cat configs/cluster_num_workers.txt) \
                --host $1 \
                --users $num_users \
                --spawn-rate $user_hatching_rate \
                --reset-stats \
                --run-time ${test_total_duration_seconds}s \
                --csv "${test_results_dir}/$test_prefix" \
                --html "${test_results_dir}/$html_file"
        elif [[ "$3" == "worker" ]]
        then
            locust -f locust.py \
                --worker \
                --master-host=$(cat configs/cluster_master_ip.txt)
        else
            echo "Bad usage. Please specify if the script should run in 'master' or 'worker' mode."
            exit 2
        fi

        echo -e "\n>>> $2: Finished test with $num_users users.\n"
        sleep $sleep_between_tests
    done

    echo -e "\n>>> $2: Finished tests.\n"
    sleep $sleep_between_tests
}

execute_locust_tests $nginx_router_host nginx_routing $1
execute_locust_tests $faas_lightweight_router_host faas_lightweight_routing $1
execute_locust_tests $run_local_faas_or_redirect_to_remote_paas_router_host faas_local_or_remote_paas_routing $1
execute_locust_tests $dns_routing_host dns_routing $1
