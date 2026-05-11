import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Session } from '../src/Session.js';

const createMockSocket = (id) => ({
    id,
    join: vi.fn(),
    emit: vi.fn(),
});

const createMockIo = () => {
    const emit = vi.fn();
    return {
        to: vi.fn(() => ({ emit })),
        emit,
    };
};

const createMockGame = ({ whoseMove = 1, valid = true, gameState = {} } = {}) => ({
    gameState,
    whoseMove,
    isValidTurn: vi.fn(() => valid),
    takeTurn: vi.fn(),
    checkGameOver: vi.fn(() => null),
    nextPlayer: vi.fn(),
});

describe('Session', () => {
    let sockets;
    let io;
    let onGameEnd;
    let game;
    let session;

    beforeEach(() => {
        sockets = [createMockSocket('player1'), createMockSocket('player2')];
        io = createMockIo();
        onGameEnd = vi.fn();
        game = createMockGame({ whoseMove: 1, valid: true, gameState: { board: [] } });
        session = new Session(sockets, game, io, onGameEnd);
    });

    test('constructor joins players and emits initial room events', () => {
        const room = session.getSessionId();

        expect(sockets[0].join).toHaveBeenCalledWith(room);
        expect(sockets[1].join).toHaveBeenCalledWith(room);
        expect(io.to).toHaveBeenCalledWith(room);
        expect(io.to(room).emit).toHaveBeenCalledWith('join_status', {
            status: 'begin',
            sessionID: room,
        });
        expect(io.to(room).emit).toHaveBeenCalledWith('state_update', {
            state: game.gameState,
            whoseMove: sockets[0].id,
        });
    });

    test('handleTurn rejects a move by the wrong player', () => {
        session.handleTurn(sockets[1], 'A1');

        expect(sockets[1].emit).toHaveBeenCalledWith('action_result', {
            success: false,
            error: 'not your turn!',
        });
        expect(game.takeTurn).not.toHaveBeenCalled();
    });

    test('handleTurn accepts a valid move and emits updated state', () => {
        game.nextPlayer.mockImplementation(() => {
            game.whoseMove = 2;
        });

        session.handleTurn(sockets[0], 'A1');

        expect(game.takeTurn).toHaveBeenCalledWith('A1', game.gameState);
        expect(game.nextPlayer).toHaveBeenCalled();

        const room = session.getSessionId();
        expect(io.to).toHaveBeenCalledWith(room);
        expect(io.to(room).emit).toHaveBeenCalledWith('state_update', {
            state: game.gameState,
            whoseMove: sockets[1].id,
        });
    });
});