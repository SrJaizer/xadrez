from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

json = {"key": "value"}

@app.route('/')
def api():
  return json

@socketio.on('message')
def handle_message(msg):
    print('Message: ' + msg)
    emit('message', f"server: {msg}", broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=False)
