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

let utilities = function(Gameboard,winHook){
    let displayBoard = function(){
        let board = Gameboard.getBoard();
        console.log(board);
    }
    let getInput = function(){
        let row = prompt("Enter the Row Number(0-2): ");
        let col = prompt("Enter the Column Number(0-2):");
        return {row,col}
    }
    let analyseRow = function(row){
        let board = Gameboard.getBoard();
        let status = true;
        for(let i=1;i<3;i++){
            if(board[row][i] !== board[row][i-1]){
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
            if(board[i][col] !== board[i-1][col]){
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
            if(board[i][i] !== board[i-1][i-1]){
                status1 = false;
                break;
            }
        }
        let status2 = true;
        for(let i=1;i<3;i++){
            if(board[i][2-i] !== board[i-1][3-i]){
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
        return () => {
            console.log(`Player ${player} turn`);
            input = getInput();
            Gameboard.playMove(input.row, input.col,player);
            if(analyseBoard()){
                console.log(`Player ${player} Won`);
                winHook.toggleStatus();
            }
        }
    }
    return {
        displayBoard,
        play
    };
};

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

const startGame = function(){
    alert("State at Start of Game");
    let board = Gameboard();
    let win = hook(false);
    let chanceX = hook(true);
    let util = utilities(board,win);
    let playX =  util.play("X");
    let playO = util.play("O");
    while(!win.getStatus()){
        util.displayBoard();
        if(chanceX.getStatus()){
            playX();
        }
        else{
            playO();
        }
        chanceX.toggleStatus();
    }
}();