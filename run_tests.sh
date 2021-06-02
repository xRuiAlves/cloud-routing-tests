#!/bin/bash
host='https://paas-poll-app.herokuapp.com'
test_results_dir='results'
user_hatching_rate=50
num_users_start=100
num_users_end=2400
num_users_step=100
test_base_duration_seconds=150
sleep_between_tests=10

for (( num_users = $num_users_start; num_users <= $num_users_end; num_users = num_users + $num_users_step )) 
do 
    test_prefix="${num_users}users"
    html_file="${test_prefix}.html"
    hatching_duration=$(($num_users / $user_hatching_rate))
    test_total_duration_seconds=$(($test_base_duration_seconds + $hatching_duration))

    echo -e "\nStarting test with $num_users users ...\n"

    locust -f locust.py \
        --headless \
        --host $host \
        --users $num_users \
        --spawn-rate $user_hatching_rate \
        --reset-stats \
        --run-time ${test_total_duration_seconds}s \
        --csv "${test_results_dir}/$test_prefix" \
        --html "${test_results_dir}/$html_file"

    echo -e "\nFinished test with $num_users users.\n"
    sleep $sleep_between_tests
done
