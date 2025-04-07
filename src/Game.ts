import { WebSocket } from "ws";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private board: string;
    private moves: string[];
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = "---------"; // empty board
        this.moves = []; // empty moves
        this.startTime = new Date();
    }

    makeMove(socket: WebSocket, move: string){
        // validation here
        // is it this users move?
        // is the move valid?
        
        
        
        //update the board 
        // push the moves

        //check if the game is over

        // send the updated board to both players
    }
}