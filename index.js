/*
Following is the logic behind Tic Tac Toe
*/
// This would create the Gameboard

const Gameboard = function(){
    let gameboard = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];
    function getBoard(){
        return gameboard.slice();
    }
    function playMove(row,col,value){
        if(row>=0 && row<3 && col>=0 && col<3){
            if(gameboard[row][col] === ""){
                gameboard[row][col] = value;
            }
            else{
                alert("You can't move at occupied position!!!");
            }
        }
        else{
            alert("Invalid row or col value!!!")
        }
    }
    return {getBoard, playMove};
};

// This includes the utility functions
let utilities = function(Gameboard,winHook,chanceHook){
    
    let analyseRow = function(row){
        let board = Gameboard.getBoard();
        let status = true;
        for(let i=1;i<3;i++){
            if(board[row][i] !== board[row][i-1] || board[row][i] == ""){
                status = false;
                break;
            }
        }
        return status;
    }
    let analyseColumn = function(col){
        let board = Gameboard.getBoard();
        let status = true;
        for(let i=1;i<3;i++){
        if(board[i][col] !== board[i-1][col] || board[i][col] === ""){
                status = false;
                break;
            }
        }
        return status;
    }
    let analyseDiag = function(){
        let board = Gameboard.getBoard();
        let status1 = true;
        for(let i=1;i<3;i++){
            if(board[i][i] !== board[i-1][i-1] || board[i][i] === ""){
                status1 = false;
                break;
            }
        }
        let status2 = true;
        for(let i=1;i<3;i++){
            if(board[i][2-i] !== board[i-1][3-i] || board[i][2-i] === ""){
                status2 = false;
                break;
            }
        }
        return status1 || status2;
    }
    let analyseBoard = function(){
        let analyseDiagStatus = analyseDiag();
        for(let i=0;i<3;i++){
            let rowStatus = analyseRow(i);
            let colStatus = analyseColumn(i);
            if(analyseDiagStatus || rowStatus || colStatus){
                return true;
            }
        }
        return false;
    }
    let play = function(player){
        return (row,col) => {
            Gameboard.playMove(row,col,player);
            if(analyseBoard()){
                winHook.toggleStatus();
                winHook.afterMathWin();
            }
            chanceHook.toggleStatus();
        }
    }
    return {
        play
    };
};

let utilitiesDOM = function(Gameboard,chanceHook,playX, playO){
    const board_container = document.getElementById("board-container");
    let makeBoardDOM = function(){
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                let button = document.createElement("button");
                board_container.appendChild(button);
                button.addEventListener("click",()=>{
                    let player = chanceHook.getStatus() ? "X": "O";
                    if(player === "X"){
                        playX(i,j);
                    }
                    else if(player === "O"){
                        playO(i,j);
                    }
                    button.innerHTML = player;
                    button.disabled = true;
                });
            }
        }
    }
    return {
        makeBoardDOM
    }
}

// This creates the code to manage the turns in separate closure environment
let hook = function(s){
    let status = s;
    function getStatus(){
        return status;
    }
    function toggleStatus(){
        status = !status;
    }
    return {
        getStatus,
        toggleStatus
    }
};

// This is the driver code putting all of it together
const startGame = function(){
    let board = Gameboard();
    let win = hook(false);
    win.afterMathWin = function(){
        let buttons = document.getElementsByTagName("button");
        for(let button of buttons){
            button.disabled = true;
        }
    }
    let chanceX = hook(true);
    let util = utilities(board,win,chanceX);
    let playX =  util.play("X");
    let playO = util.play("O");
    let utilDOM = utilitiesDOM(board,chanceX,playX,playO);
    utilDOM.makeBoardDOM();
    console.log(document.body);
};

document.addEventListener("DOMContentLoaded",startGame);