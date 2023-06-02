import chess, random
from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

board = chess.Board()  # Cria o tabuleiro inicial
players = {}
t_count = 0

@socketio.on('connect')
def connect():
    sid = request.sid
    t = 0
    if len(players) < 2:
        join_room(sid)
        print('Conectado:', sid)
        emit('connected', {'sid': sid})
        assign_color(sid)
        if t < 1: 
            print('Turno brancas')
            t+=1
    else:
        print('Limite de conexões atingido:', sid)
        emit('connection_limit_exceeded', to=sid)
    


def assign_color(sid):
    global players
    if len(players) < 2:
        if len(players) == 0:
            color = random.choice(['white', 'black'])  # Atribui aleatoriamente 'white' ou 'black' ao primeiro jogador
        else:
            color = 'white' if players[list(players.keys())[0]] == 'black' else 'black'  # Atribui a cor oposta ao segundo jogador
        players[sid] = color
        emit(color, to=sid)
    else:
        emit('spectator', to=sid)  # Caso haja mais de dois jogadores, considera o jogador como espectador

@socketio.on('chess_team')
def chess_team():
    emit(players[request.sid], to=request.sid)

@socketio.on('jogada')
def jogada(jogada):
    global t_count
    global turno
    if t_count % 2 != 0:
        turno = 'brancas'
    else:
        turno = 'pretas'
    
    print('Jogada recebida de', request.sid, ':', jogada)
    if validar_jogada(request.sid, jogada):  # Verifica se a jogada é válida
        print('jogada valida')
        emit('jogada_valida', to=request.sid)
        emit('atualizar_tabuleiro', board.fen(), room=request.sid)
        print(f'Turno {turno}')

        t_count += 1
    else:
        print('jogada invalida')
        emit('jogada_invalida', to=request.sid)

def validar_jogada(sid, jogada):
    try:
        lance = chess.Move.from_uci(jogada)
        if lance in board.legal_moves:
            board.push(lance)
            verificar_estado(sid)
            return True
        else:
            return False
    except:
        return False

def is_captura(jogada):
    lance = chess.Move.from_uci(jogada)
    peca_capturada = board.piece_at(lance.to_square)
    if peca_capturada:
        msg = 'jogada_de_captura: ' + str(peca_capturada.symbol()) + ' foi comida!'
    else:
        msg = 'jogada_de_movimento'
    return msg

def verificar_estado(sid):
    if board.is_game_over():
        if board.is_checkmate():
            emit('fim_de_jogo', {'resultado': 'perdeu'}, room=sid)
            emit('fim_de_jogo', {'resultado': 'ganhou'}, broadcast=True, include_self=False)
        elif board.is_stalemate():
            print('Fim de jogo: Empate')
            emit('fim_de_jogo', {'resultado': 'empatou'}, broadcast=True)
        elif board.is_insufficient_material() or board.is_seventyfive_moves() or board.is_fivefold_repetition():
            print('Fim de jogo: Empate')
            emit('fim_de_jogo', {'resultado': 'empatou'}, broadcast=True)
            
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = 5000
    print(f'Iniciando na porta {port}')
    socketio.run(app, host='localhost', port=port)
