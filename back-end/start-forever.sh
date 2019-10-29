forever stop 'backend@raca'
forever --id 'backend@raca' start -c "node --max-old-space-size=2096" -e forever-err.log app.js
sleep 1
forever logs
