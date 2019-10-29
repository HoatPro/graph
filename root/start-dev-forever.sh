forever stop 'root'
forever --id 'root' start -c "node --max-old-space-size=2048" -e forever-err.log app.js
sleep 1
forever logs