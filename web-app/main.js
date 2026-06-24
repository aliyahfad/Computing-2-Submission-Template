import R from "./ramda.js";
import Onitama from "./onitama.js";

let state = Onitama.new_game();
let selected_card = null;
let selected_piece = null;

const el = (id) => document.getElementById(id);
const game_board = el("game_board");

R.range(0, 25).forEach(function (i) {
    const square = document.createElement("div");
    square.className = "square";
    square.id = "square_" + i;
    square.tabIndex = 0;
    game_board.append(square);
});

el("square_" + ((4 - 0) * 5 + 2)).classList.add("temple-red");
el("square_" + ((4 - 4) * 5 + 2)).classList.add("temple-blue");

const redraw_board = function () {
    R.range(0, 5).forEach(function (row) {
        R.range(0, 5).forEach(function (col) {
            const square = el("square_" + ((4 - row) * 5 + col));
            square.innerHTML = "";
            square.classList.remove("highlight");
            const piece = state.board[row][col];
            if (piece !== null) {
                const div = document.createElement("div");
                div.className = "piece " + piece.player;
                if (piece.type === "master") {
                    div.classList.add("master");
                }
                square.append(div);
            }
        });
    });
    if (selected_piece !== null) {
        const selected_square = el(
            "square_" + ((4 - selected_piece.row) * 5 + selected_piece.col)
        );
        selected_square.querySelector(".piece").classList.add("selected-piece");
    }
};

const select_card = function (card, card_el) {
    selected_card = card;
    document.querySelectorAll(".card").forEach(function (c) {
        c.classList.remove("selected");
    });
    card_el.classList.add("selected");
};

const redraw_cards = function () {
    el("red_card_0").textContent = state.red_cards[0].name;
    el("red_card_1").textContent = state.red_cards[1].name;
    el("blue_card_0").textContent = state.blue_cards[0].name;
    el("blue_card_1").textContent = state.blue_cards[1].name;
    el("spare_card").textContent = state.spare_card.name;

    el("red_card_0").onclick = (
        state.current_player === "red"
        ? function () {
            select_card(state.red_cards[0], el("red_card_0"));
        }
        : null
    );
    el("red_card_1").onclick = (
        state.current_player === "red"
        ? function () {
            select_card(state.red_cards[1], el("red_card_1"));
        }
        : null
    );
    el("blue_card_0").onclick = (
        state.current_player === "blue"
        ? function () {
            select_card(state.blue_cards[0], el("blue_card_0"));
        }
        : null
    );
    el("blue_card_1").onclick = (
        state.current_player === "blue"
        ? function () {
            select_card(state.blue_cards[1], el("blue_card_1"));
        }
        : null
    );

    el("red_card_0").onkeydown = function (event) {
        if (event.key === "Enter" || event.key === " ") {
            if (el("red_card_0").onclick) {
                el("red_card_0").onclick();
            }
        }
    };
    el("red_card_1").onkeydown = function (event) {
        if (event.key === "Enter" || event.key === " ") {
            if (el("red_card_1").onclick) {
                el("red_card_1").onclick();
            }
        }
    };
    el("blue_card_0").onkeydown = function (event) {
        if (event.key === "Enter" || event.key === " ") {
            if (el("blue_card_0").onclick) {
                el("blue_card_0").onclick();
            }
        }
    };
    el("blue_card_1").onkeydown = function (event) {
        if (event.key === "Enter" || event.key === " ") {
            if (el("blue_card_1").onclick) {
                el("blue_card_1").onclick();
            }
        }
    };
};

const redraw_turn = function () {
    el("turn_indicator").textContent = (
        state.current_player === "red"
        ? "Red's turn"
        : "Blue's turn"
    );
};

const check_game_end = function () {
    if (Onitama.is_ended(state)) {
        const winner = (
            state.current_player === "red"
            ? "blue"
            : "red"
        );
        el("result_message").textContent = winner + " wins!";
        el("result_dialog").showModal();
    }
};

el("result_dialog").onclick = function () {
    state = Onitama.new_game();
    selected_card = null;
    selected_piece = null;
    redraw_board();
    redraw_cards();
    redraw_turn();
    el("result_dialog").close();
};

R.range(0, 5).forEach(function (row) {
    R.range(0, 5).forEach(function (col) {
        const square = el("square_" + ((4 - row) * 5 + col));
        square.onclick = function () {
            const piece = state.board[row][col];
            if (piece !== null && piece.player === state.current_player) {
                if (selected_card === null) {
                    return;
                }
                selected_piece = {row, col};
                redraw_board();
                const moves = Onitama.get_valid_moves(
                    row,
                    col,
                    selected_card,
                    state
                );
                moves.forEach(function (move) {
                    el("square_" + (
                        (4 - move.row) * 5 + move.col
                    )).classList.add("highlight");
                });
                return;
            }
            if (selected_piece !== null && selected_card !== null) {
                if (Onitama.is_valid_move(
                    selected_piece,
                    {row, col},
                    selected_card,
                    state
                )) {
                    state = Onitama.make_move(
                        selected_piece,
                        {row, col},
                        selected_card,
                        state
                    );
                    selected_piece = null;
                    selected_card = null;
                    document.querySelectorAll(".card").forEach(function (c) {
                        c.classList.remove("selected");
                    });
                    redraw_board();
                    redraw_cards();
                    redraw_turn();
                    check_game_end();
                }
            }
        };
        square.onkeydown = function (event) {
            if (event.key === "Enter" || event.key === " ") {
                if (square.onclick) {
                    square.onclick();
                }
            }
        };
    });
});

redraw_board();
redraw_cards();
redraw_turn();