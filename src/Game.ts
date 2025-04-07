import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private moves: string[];
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = []; // empty moves
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // validate the type of move using zod
    if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
      // player1 turn
      return;
    }

    if (this.board.moves.length % 2 === 1 && socket !== this.player2) {
      // player2 turn
      return;
    }

    try {
      this.board.move(move);
    } catch (e) {
      console.log(e);
      return;
    }

    //check if the game is over
    if (this.board.isGameOver()) {
      //Send game over to both  players
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "b" : "w", //if white turn then black wins or vice versa
          },
        })
      );
      this.player2.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "b" : "w", //if white turn then black wins or vice versa
          },
        })
      );
      return;
    }
    if (this.board.moves.length % 2 === 0) {
      this.player2.emit(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    } else {
      this.player1.emit(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );
    }
    // send the updated board to both players
  }
}
