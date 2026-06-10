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

// row 0 is the top(?), column 0 is the left

const CARDS = [
    {
        name: "Tiger",
        moves: [{dx: 0, dy: -2}, {dx: 0, dy: 1}]
    },
    {
        name: "Crab",
        moves: [{dx: -2, dy: 0}, {dx: 2, dy: 0}, {dx: 0, dy: -1}]
    },
    {
        name: "Monkey",
        moves: [{dx: 1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: -1},
        {dx: -1, dy: 1}]
    },
    {
        name: "Crane",
        moves: [{dx: -1, dy: 1}, {dx: 1, dy: 1}, {dx: 0, dy: -1}]
    },
    {
        name: "Dragon",
        moves: [{dx: 1, dy: 1}, {dx: -1, dy: 1}, {dx: -2, dy: -1},
        {dx: 2, dy: -1}]
    },
    {
        name: "Elephant",
        moves: [{dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 1, dy: -1},
        {dx: -1, dy: -1}]
    },
    {
        name: "Mantis",
        moves: [{dx: 0, dy: 1}, {dx: -1, dy: -1}, {dx: 1, dy: -1}]
    },
    {
        name: "Boar",
        moves: [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}]
    },
    {
        name: "Frog",
        moves: [{dx: -2, dy: 0}, {dx: -1, dy: -1}, {dx: 1, dy: 1}]
    },
    {
        name: "Goose",
        moves: [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: -1, dy: -1},
        {dx: 1, dy: 1}]
    },
    {
        name: "Horse",
        moves: [{dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}]
    },
    {
        name: "Eel",
        moves: [{dx: -1, dy: -1}, {dx: -1, dy: 1}, {dx: 1, dy: 0}]
    },
    {
        name: "Rabbit",
        moves: [{dx: -1, dy: 1}, {dx: 1, dy: -1}, {dx: 2, dy: 0}]
    },
    {
        name: "Rooster",
        moves: [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: -1, dy: 1},
        {dx: 1, dy: -1}]
    },
    {
        name: "Ox",
        moves: [{dx: 0, dy: 1}, {dx: 1, dy: 0}, {dx: 0, dy: -1}]
    },
    {
        name: "Cobra",
        moves: [{dx: -1, dy: 0}, {dx: 1, dy: 1}, {dx: 1, dy: -1}]
    }
];

// HELPING FUNCTIONS

/**
 * shuffles the move cards and distributes 2 to both players
 * @param {Onitama.CARDS} cards The array of move cards we are shuffling
 * @returns {Onitama.GameCards} An array of 5 cards each corresponding to
 * either player or spare
 */
const distribute_cards = function (cards) {
    const shuffled_cards = R.sort(function () {
        return Math.random() - 0.5;
    }, cards);
    return {
        red_cards: [shuffled_cards[0], shuffled_cards[1]],
        blue_cards: [shuffled_cards[2], shuffled_cards[3]],
        spare_card: shuffled_cards[4]
    };
};

/**
 * Takes the current board and moves all pieces back to starting positions
 * @param {*} board The current board setup
 */
const initial_board = function () {
    return [[
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
    ]];
};

/**
 * checks whether the move square is within the board
 * @param {Number} row the row index of the potential move square
 * @param {Number} col the column index of the potential move square
 * @returns {Boolean}
 */
const is_in_bounds = function (row, col) {
    return row >= 0 && row < 5 && col >= 0 && col < 5;
};



/**
 * checks whether the move square is already occupied by a friendly piece
 * @param {Array} board the currect board state
 * @param {*} player the current player making the move
 * @param {Number} row row index of the move square
 * @param {Number} col column index of the move square
 * @returns {Boolean}
 */
const is_friendly = function (board, player, row, col) {
    return board[row][col] !== null && board[row][col].player === player;
};

const test_board = initial_board();


/**
 * adjusts the move offsets according to the current player
 * @param {*} player the current player
 * @param {*} offset the offset?
 */
const apply_orientation = function (player, offset) {

};

/**
 * swaps the spare card with the move card that was just played
 * @param {Object} card the move card that was played
 * @param {String} player the current player that made a move
 * @param {*} state the state of the game - what cards are in hand
 */
const exchange_cards = function (card, player, state) {

};


// ONITAMA FUNCTIONS

/**
 * Describes the game at any point in time
 * @property {Array} board - 5x5 grid representing the board,
 * Each cell is either a piece object or null if empty
 * @property {Array} hands - The 2 cards held by each player
 * @property {Object} spare - The face-up spare card beside the board
 * @property {String} current_player - The player whose turn it is
 * @property {String} status - The current game status (in game or win state)
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
 *
 * @param {*} moves
 */
Onitama.get_valid_moves = function (row, col, card, state) {

};

/**
 * Shows all moves (including invalid moves) for the chosen card and piece
 * @param {*} player the current player making a move
 * @param {*} card the selected move card
 * @param {*} selected_piece the selected board piece
 */
Onitama.get_all_moves = function (player, card, piece) {

};

Onitama.is_valid_move = function (from, to, card, state) {

};


Onitama.is_ended = function (state) {

};



// freezing an object means all properties cannot be changed
// export default Object.freeze(Onitama);