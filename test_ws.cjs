const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8098 });
console.log('Listening on 8098');
wss.on('connection', ws => {
  console.log('Godot connected!');
  ws.send(JSON.stringify({ id: '1', command: 'get_scene_tree', params: {} }));
  ws.on('message', msg => {
    console.log('Response:', msg.toString());
    process.exit(0);
  });
});
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 4000);
