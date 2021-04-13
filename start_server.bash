#!/usr/bin/bash

echo
echo For Development Only!!!
echo

control_c()
{
  echo "Killing Scripts $backend_id $frontend_id"
  kill -TERM -$backend_id
  kill -TERM -$frontend_id
  echo "done"
  exit 0
}
echo "Setting control-c trap"
trap control_c SIGINT
setsid sh -c "cd backend ; export PORT=4000 ; FORCE_COLOR=true npm run dev |& cat | sed  's/^/[backend] /' " &
backend_id=$!
echo "Backend PID: $backend_id"
# fix clearing screen issue
setsid sh -c "cd frontend/big-project-web ; export PORT=3000 ; FORCE_COLOR=true npm start |& cat | sed  's/^/[frontend] /' " &
frontend_id=$!
echo "Frontend PID: $frontend_id"


echo "done. waiting for SIGINT..."
wait

