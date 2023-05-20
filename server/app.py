import chess
import socketio
import eventlet

sio = socketio.Server(cors_allowed_origins='*') # Cria instancia do servidor socket io
app = socketio.WSGIApp(sio) # Cria instancia do app socket io com o servidor criado

board = chess.Board()  # Cria o tabuleiro inicial
players = 0
t_count = 0

@sio.event
def connect(sid, environ):
    print('Conectado:', sid)
    players += 1

@sio.event
def chess_team():
    if players == 1:
        sio.emit('white', to=sid)
    else:
        sio.emit('black', to=sid)

@sio.event
def jogada(sid, jogada):
    if t_count % 2 == 0:
        turno = 'brancas'
    else:
        turno = 'pretas'
    
    print('Jogada recebida de', sid, ':', jogada)
    if validar_jogada(sid, jogada):  # Verifica se a jogada é válida
        sio.emit('jogada_valida', to=sid)  # Envia uma mensagem indicando que a jogada é válida
        sio.emit('atualizar_tabuleiro', board.fen(), room=sid)  # Envia a posição atual do tabuleiro para atualizar a tela do jogador
        t_count += 1
    else:
        sio.emit('jogada_invalida', to=sid)  # Envia uma mensagem indicando que a jogada é inválida

@sio.event
def validar_jogada(sid, jogada):
    try:
        lance = chess.Move.from_uci(jogada)
        if lance in board.legal_moves:  # Verifica se o lance é legal
            board.push(lance)  # Executa o lance no tabuleiro
            verificar_estado(sid)
            return True
        else:
            return False
    except:
        return False
 
@sio.event   
def is_captura(jogada):
    lance = chess.Move.from_uci(jogada)
    peca_capturada = board.piece_at(lance.to_square)  # Verifica se o movimento resulta em uma captura
    if peca_capturada:
        msg = 'jogada_de_captura: '+str(peca_capturada.symbol())+' foi comida!' # Define a mensagem como uma captura e exibe a peça capturada
    else:
        msg = 'jogada_de_movimento' # Define a mensagem como uma jogada apenas de movimentação
    return msg
  
@sio.event  
def verificar_estado(sid):
    if board.is_game_over():
        if board.is_checkmate():
            # Fim de jogo: o jogador atual perdeu por xeque-mate
            sio.emit('fim_de_jogo', {'resultado': 'perdeu'}, room=sid)
            sio.emit('fim_de_jogo', {'resultado': 'ganhou'}, broadcast=True, include_self=False)
        elif board.is_stalemate():
            # Fim de jogo: empate por afogamento
            sio.emit('fim_de_jogo', {'resultado': 'empatou'}, broadcast=True)
        elif board.is_insufficient_material() or board.is_seventyfive_moves() or board.is_fivefold_repetition():
            # Fim de jogo: empate por regra de empate
            sio.emit('fim_de_jogo', {'resultado': 'empatou'}, broadcast=True)


if __name__ == '__main__':
    port = 5000
    print(f'Starting on port {port}')
    eventlet.wsgi.server(eventlet.listen(('localhost', port)), app)
