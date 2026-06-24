import R from "./ramda.js";

/**
 * @namespace Onitama
 */
const Onitama = Object.create(null);


/**
 * Describes the moves of all cards
 * @property {string} name - The name of the card
 * @property {Array} moves - Array of movement offsets
 */

// row 0 is the top, column 0 is the left

const CARDS = [
    {
        name: "Tiger",
        moves: [
            {dx: 0, dy: -2},
            {dx: 0, dy: 1}
        ]
    },
    {
        name: "Crab",
        moves: [
            {dx: -2, dy: 0},
            {dx: 2, dy: 0},
            {dx: 0, dy: -1}
        ]
    },
    {
        name: "Monkey",
        moves: [
            {dx: 1, dy: 1},
            {dx: 1, dy: -1},
            {dx: -1, dy: -1},
            {dx: -1, dy: 1}
        ]
    },
    {
        name: "Crane",
        moves: [
            {dx: -1, dy: 1},
            {dx: 1, dy: 1},
            {dx: 0, dy: -1}
        ]
    },
    {
        name: "Dragon",
        moves: [
            {dx: 1, dy: 1},
            {dx: -1, dy: 1},
            {dx: -2, dy: -1},
            {dx: 2, dy: -1}
        ]
    },
    {
        name: "Elephant",
        moves: [
            {dx: 1, dy: 0},
            {dx: -1, dy: 0},
            {dx: 1, dy: -1},
            {dx: -1, dy: -1}
        ]
    },
    {
        name: "Mantis",
        moves: [
            {dx: 0, dy: 1},
            {dx: -1, dy: -1},
            {dx: 1, dy: -1}
        ]
    },
    {
        name: "Boar",
        moves: [
            {dx: -1, dy: 0},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1}
        ]
    },
    {
        name: "Frog",
        moves: [
            {dx: -2, dy: 0},
            {dx: -1, dy: -1},
            {dx: 1, dy: 1}
        ]
    },
    {
        name: "Goose",
        moves: [
            {dx: -1, dy: 0},
            {dx: 1, dy: 0},
            {dx: -1, dy: -1},
            {dx: 1, dy: 1}
        ]
    },
    {
        name: "Horse",
        moves: [
            {dx: 0, dy: -1},
            {dx: 0, dy: 1},
            {dx: -1, dy: 0}
        ]
    },
    {
        name: "Eel",
        moves: [
            {dx: -1, dy: -1},
            {dx: -1, dy: 1},
            {dx: 1, dy: 0}
        ]
    },
    {
        name: "Rabbit",
        moves: [
            {dx: -1, dy: 1},
            {dx: 1, dy: -1},
            {dx: 2, dy: 0}
        ]
    },
    {
        name: "Rooster",
        moves: [
            {dx: -1, dy: 0},
            {dx: 1, dy: 0},
            {dx: -1, dy: 1},
            {dx: 1, dy: -1}
        ]
    },
    {
        name: "Ox",
        moves: [
            {dx: 0, dy: 1},
            {dx: 1, dy: 0},
            {dx: 0, dy: -1}
        ]
    },
    {
        name: "Cobra",
        moves: [
            {dx: -1, dy: 0},
            {dx: 1, dy: 1},
            {dx: 1, dy: -1}
        ]
    }
];

// HELPING FUNCTIONS

/**
 * shuffles the move cards and distributes 2 to both players
 * @param {Array} cards the move cards to shuffle
 * @returns {Object} object containing each players cards and the spare
 */
const distribute_cards = function (cards) {
    const shuffled = R.reduce(function (acc, card) {
        const index = Math.floor(Math.random() * (acc.length + 1));
        return R.insert(index, card, acc);
    }, [], cards);
    return {
        red_cards: [shuffled[0], shuffled[1]],
        blue_cards: [shuffled[2], shuffled[3]],
        spare_card: shuffled[4]
    };
};

/**
 * creates a fresh board for game start
 * @returns {Array} the starting board setup
 */
const initial_board = function () {
    return [
        [
            {player: "red", type: "student"},
            {player: "red", type: "student"},
            {player: "red", type: "master"},
            {player: "red", type: "student"},
            {player: "red", type: "student"}
        ],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [
            {player: "blue", type: "student"},
            {player: "blue", type: "student"},
            {player: "blue", type: "master"},
            {player: "blue", type: "student"},
            {player: "blue", type: "student"}
        ]
    ];
};

/**
 * checks whether the move square is within the board
 * @param {Number} row the row index of the potential move square
 * @param {Number} col the column index of the potential move square
 * @returns {Boolean} whether the destination square is within the 5x5 grid
 */
const is_in_bounds = function (row, col) {
    return row >= 0 && row < 5 && col >= 0 && col < 5;
};

/**
 * checks whether the move square is already occupied by a friendly piece
 * @param {Array} board the currect board state
 * @param {String} player the current player making the move
 * @param {Number} row row index of the move square
 * @param {Number} col column index of the move square
 * @returns {Boolean} whether the move square is occupied by a friendly piece
 */
const is_friendly = function (board, player, row, col) {
    return board[row][col] !== null && board[row][col].player === player;
};


/**
 * adjusts the move offsets according to the current player
 * @param {String} player the current player
 * @param {Object} offset the move offset of the selected move card
 * @returns {Object} the move offset from the perspective of the current player
*/
const apply_orientation = function (player, offset) {
    if (player === "blue") {
        return {dx: R.negate(offset.dx), dy: R.negate(offset.dy)};
    }
    return offset;
};


/**
 * swaps the spare card with the move card that was just played
 * @param {Object} card the move card that was played
 * @param {String} player the current player that made a move
 * @param {Object} state uses the stored spare card and player hands
 * @returns {Object} the updated player hands and spare card
 */
const exchange_cards = function (card, player, state) {
    const new_hand = R.map(function (c) {
        return (
            c.name === card.name
            ? state.spare_card
            : c
        );
    }, (
        player === "red"
        ? state.red_cards
        : state.blue_cards
    ));

    return {red_cards: (
        player === "red"
        ? new_hand
        : state.red_cards
    ), blue_cards: (
        player === "blue"
        ? new_hand
        : state.blue_cards
    ), spare_card: card};
};

/**
 * checks if a master has been captured
 * @param {Array} board the current layout of all pieces on the board
 * @param {String} player the player of the master we are checking
 * @returns {Boolean} whether the master of the player is on the board or not
 */
const master_alive = function (board, player) {
    return R.any(
        function (square) {
            return square !== null && square.player === player
            && square.type === "master";
        },
        R.flatten(board)
    );
};


// ONITAMA API FUNCTIONS

/**
 * creates and returns the initial game state
 * @returns {Array} board - 5x5 grid representing the board
 * @returns {Array} hands - the 2 move cards held by each player
 * @returns {Object} spare - the spare move card beside the board
 * @returns {String} current_player - the player whose turn it is
 * @returns {String} status - the current game status (in game or win)
 */

Onitama.new_game = function () {
    const game_cards = distribute_cards(CARDS);
    return {
        board: initial_board(),
        red_cards: game_cards.red_cards,
        blue_cards: game_cards.blue_cards,
        spare_card: game_cards.spare_card,
        current_player: "red",
        status: "in_game"
    };
};

/**
 * determines all the legal moves for the card and piece location chosen
 * @param {Number} row the row of the piece being moved
 * @param {Number} col teh column of the piece being moved
 * @param {Object} card the applied move card
 * @param {Object} state retrieves the current player and board layout
 * @returns {Array} array of all valid destination squares
 */
Onitama.get_valid_moves = function (row, col, card, state) {
    const player = state.current_player;
    const board = state.board;
    return R.filter(function (destination) {
        return is_in_bounds(destination.row, destination.col) &&
        !is_friendly(board, player, destination.row, destination.col);
    }, R.map(function (offset) {
        const corrected_offset = apply_orientation(player, offset);
        return {row: row - corrected_offset.dy, col: col + corrected_offset.dx};
    }, card.moves));
};


/**
 * checks whether the chosen selected destination square is valid
 * @param {Object} from the coordinates of the starting piece on the board
 * @param {Object} to the coordinates of the destination square
 * @param {Object} card the selected move card
 * @param {Object} state retrieves the current player and board layout
 * @returns {Boolean} whether the destination square is a valid move or not
 */
Onitama.is_valid_move = function (from, to, card, state) {
    const valid = Onitama.get_valid_moves(from.row, from.col, card, state);
    return R.any(function (destination) {
        return destination.row === to.row && destination.col === to.col;
    }, valid);
};


/**
 * returns whether a master has been captured or moved to a temple square
 * @param {Object} state reteives the current board layout
 * @returns {Boolean} whether a win condition has been met
 */
Onitama.is_ended = function (state) {
    const board = state.board;
    const red_wins = (
        board[4][2] !== null
        && board[4][2].player === "red"
        && board[4][2].type === "master"
    );
    const blue_wins = (
        board[0][2] !== null
        && board[0][2].player === "blue"
        && board[0][2].type === "master"
    );
    if (red_wins || blue_wins) {
        return true;
    }
    if (!master_alive(board, "red") || !master_alive(board, "blue")) {
        return true;
    }
    return false;
};


/**
 * executes a move and updates the game state
 * @param {Object} from the square the piece is moving from
 * @param {Object} to the square the piece is moving to
 * @param {Object} card the move card being played
 * @param {Object} state the current game state
 * @returns {Object} the new game state after the move has been made
 */
Onitama.make_move = function (from, to, card, state) {
    const board = state.board;
    const player = state.current_player;
    const new_hand = exchange_cards(card, player, state);
    const next_player = (
        player === "red"
        ? "blue"
        : "red"
    );
    const piece = board[from.row][from.col];
    const board_after_removal = R.update(
        from.row,
        R.update(from.col, null, board[from.row]),
        board
    );
    const new_board = R.update(
        to.row,
        R.update(to.col, piece, board_after_removal[to.row]),
        board_after_removal
    );

    return {
        board: new_board,
        red_cards: new_hand.red_cards,
        blue_cards: new_hand.blue_cards,
        spare_card: new_hand.spare_card,
        current_player: next_player,
        status: (
            Onitama.is_ended({board: new_board})
            ? "ended"
            : "in_game"
        )
    };
};


export default Object.freeze(Onitama);