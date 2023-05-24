import chess
from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

board = chess.Board()  # Cria o tabuleiro inicial
players = 0
t_count = 0

@socketio.on('connect')
def connect():
    sid = request.sid
    print('Conectado:', sid)
    join_room(sid)
    emit('connected', {'sid': sid})
    players += 1


@socketio.on('chess_team')
def chess_team():
    if players == 1:
        emit('white')
    else:
        emit('black')

@socketio.on('jogada')
def jogada(jogada):
    global t_count
    if t_count % 2 == 0:
        turno = 'brancas'
    else:
        turno = 'pretas'

    print('Jogada recebida de', request.sid, ':', jogada)
    if validar_jogada(request.sid, jogada):  # Verifica se a jogada é válida
        emit('jogada_valida')
        emit('atualizar_tabuleiro', board.fen(), room=request.sid)
        t_count += 1
    else:
        emit('jogada_invalida')

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
            emit('fim_de_jogo', {'resultado': 'empatou'}, broadcast=True)
        elif board.is_insufficient_material() or board.is_seventyfive_moves() or board.is_fivefold_repetition():
            emit('fim_de_jogo', {'resultado': 'empatou'}, broadcast=True)

if __name__ == '__main__':
    port = 5000
    print(f'Iniciando na porta {port}')
    socketio.run(app, host='localhost', port=port)

