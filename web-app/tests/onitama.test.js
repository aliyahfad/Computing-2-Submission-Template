import Onitama from "../onitama.js";
import R from "../ramda.js";

// new game board - helper
const new_board = function () {
    return [
        [{player: "red", type: "student"},
        {player: "red", type: "student"},
        {player: "red", type: "master"},
        {player: "red", type: "student"},
        {player: "red", type: "student"}],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [{player: "blue", type: "student"},
        {player: "blue", type: "student"},
        {player: "blue", type: "master"},
        {player: "blue", type: "student"},
        {player: "blue", type: "student"}]
    ];
};

describe("is_ended", function () {

    it("A new game should not be ended", function () {
        const state = Onitama.new_game();
        if (Onitama.is_ended(state)) {
            throw new Error("A new game should not be ended");
        }
    });

    it("A game where the blue master has been captured should be ended", function () {
        const state = Onitama.new_game();
        const board = new_board();
        board[4][2] = null;
        const ended_state = {...state, board: board};
        if (!Onitama.is_ended(ended_state)) {
            throw new Error("Capturing the blue master should end the game");
        }
    });

    it("A game where the red master has been captured should be ended", function () {
        const state = Onitama.new_game();
        const board = new_board();
        board[0][2] = null; // remove red master
        const ended_state = {...state, board: board};
        if (!Onitama.is_ended(ended_state)) {
            throw new Error("Capturing the red master should end the game");
        }
    });

    it("Red master reaching blue's temple square should end the game", function () {
        const state = Onitama.new_game();
        const board = new_board();
        board[0][2] = null;
        board[4][2] = {player: "red", type: "master"};
        const ended_state = {...state, board: board};
        if (!Onitama.is_ended(ended_state)) {
            throw new Error("Red master on blue temple should end the game");
        }
    });

    it("Blue master reaching red's temple square should end the game", function () {
        const state = Onitama.new_game();
        const board = new_board();
        board[4][2] = null;
        board[0][2] = {player: "blue", type: "master"};
        const ended_state = {...state, board: board};
        if (!Onitama.is_ended(ended_state)) {
            throw new Error("Blue master on red temple should end the game");
        }
    });

    it("A mid-game board with no win condition should not be ended", function () {
        const state = Onitama.new_game();
        const board = new_board();
        board[1][2] = {player: "red", type: "master"};
        board[0][2] = null;
        const mid_state = {...state, board: board};
        if (Onitama.is_ended(mid_state)) {
            throw new Error("A mid-game board with no win should not be ended");
        }
    });

});

describe("get_valid_moves", function () {

    it("Valid moves should never inlcude squares outside the 5x5 grid", function () {
        const state = Onitama.new_game();
        // Tiger moves 2 forward or 1 back - from row 0 going back is off board
        const tiger = {name: "Tiger", moves: [{dx: 0, dy: -2}, {dx: 0, dy: 1}]};
        const moves = Onitama.get_valid_moves(0, 2, tiger, state);
        const all_in_bounds = moves.every(function (move) {
            return move.row >= 0 && move.row < 5 && move.col >= 0 && move.col < 5;
        });
        if (!all_in_bounds) {
            throw new Error("Valid moves should never inlcude squares outside the 5x5 grid");
        }
    });

    it("Valid moves should not include squares occupied by friendly pieces", function () {
        const state = Onitama.new_game();
        // Elephant moves sideways - red master at row 0 col 2 has students either side
        const elephant = {name: "Elephant", moves: [
            {dx: 1, dy: 0}, {dx: -1, dy: 0},
            {dx: 1, dy: -1}, {dx: -1, dy: -1}
        ]};
        const moves = Onitama.get_valid_moves(0, 2, elephant, state);
        const board = state.board;
        const no_friendly = moves.every(function (move) {
            const piece = board[move.row][move.col];
            return piece === null || piece.player !== "red";
        });
        if (!no_friendly) {
            throw new Error("Valid moves should not land on friendly pieces");
        }
    });

    it("Valid moves should include squares occupied by enemy pieces", function () {
        const state = Onitama.new_game();
        const board = new_board();
        // place blue enemy piece in front of red master
        board[1][2] = {player: "blue", type: "student"};
        const capture_state = {...state, board: board};
        const ox = {name: "Ox", moves: [{dx: 0, dy: 1}, {dx: 1, dy: 0}, {dx: 0, dy: -1}]};
        const moves = Onitama.get_valid_moves(0, 2, ox, capture_state);
        const can_capture = moves.some(function (move) {
            return move.row === 1 && move.col === 2;
        });
        if (!can_capture) {
            throw new Error("Valid moves should allow capturing enemy pieces");
        }
    });

    it("Tiger card from centre should give correct number of valid moves", function () {
        const state = Onitama.new_game();
        const board = new_board();
        board[0][2] = null;
        board[2][2] = {player: "red", type: "master"};
        const centre_state = {...state, board: board};
        const tiger = {name: "Tiger", moves: [{dx: 0, dy: -2}, {dx: 0, dy: 1}]};
        const moves = Onitama.get_valid_moves(2, 2, tiger, centre_state);
        // dy: -2 → row 4 (blue student, capturable), dy: 1 → row 1 (empty)
        if (moves.length !== 2) {
            throw new Error(
                "Tiger from centre should have 2 valid moves, got: " + moves.length
            );
        }
    });

    it("A piece with all moves blocked by friendly pieces should have no valid moves",
    function () {
        const state = Onitama.new_game();
        const board = new_board();
        // Surround red master with red students on all ox move squares
        board[0][2] = null;
        board[2][2] = {player: "red", type: "master"};
        board[3][2] = {player: "red", type: "student"};
        board[2][3] = {player: "red", type: "student"};
        board[1][2] = {player: "red", type: "student"};
        const blocked_state = {...state, board: board};
        const ox = {name: "Ox", moves: [{dx: 0, dy: 1}, {dx: 1, dy: 0}, {dx: 0, dy: -1}]};
        const moves = Onitama.get_valid_moves(2, 2, ox, blocked_state);
        if (moves.length !== 0) {
            throw new Error("A fully blocked piece should have no valid moves");
        }
    });

});