/* Player 1 Mark */
const markPlayer1 = 'X';
/* Player 2 Mark */
const markPlayer2 = 'O';
/* Default mark */
const defaultMark = '';
/* Player counter*/
let currentPlayer = 0;
/* Player Won */
let winnerPlayer = -1;

ResetSquares();

function AnnounceWinner(){
    if(currentPlayer === 0){
        winnerPlayer = 0;
        document.getElementById('winnerMark').innerText = markPlayer1;
    }
    else{
        winnerPlayer = 1;
        document.getElementById('winnerMark').innerText = markPlayer2;
    }    
}
function CheckRowForWinner(squareList,  squareIndex, squareText) {
    let initialIndex = 0;
    let finalIndex = 0;
    let sequelCounter = 0;

    if(squareIndex <= 2){
        initialIndex = 0;
        finalIndex = 3;
    }
    else if(squareIndex >=3 && squareIndex <=5) {
        initialIndex = 3;
        finalIndex = 6;
    }
    else {
        initialIndex = 6;
        finalIndex = 9;
    }

    for (let i = initialIndex; i < finalIndex; i++) {
        let neighborSquareText =  document.getElementById(squareList[i].id).innerText;
        if(neighborSquareText === squareText){
            sequelCounter++;
        }
    }

    if(sequelCounter === 3){
        for (let i = initialIndex; i < finalIndex; i++) {
            document.getElementById(squareList[i].id).style.backgroundColor = "green";
        }
        return true;
    }
    else{
        return false;
    }
}
function CheckColForWinner(squareList,  squareIndex, squareText){
    let initialIndex = 0;
    let finalIndex = 0;
    let sequelCounter = 0;


    if(squareIndex === 0 || squareIndex === 3 || squareIndex === 6){
        initialIndex = 0;
        finalIndex = 6;
    }
    else if(squareIndex === 1 || squareIndex === 4 || squareIndex === 7)
    {
        initialIndex = 1;
        finalIndex = 7;
    }
    else
    {
        initialIndex = 2;
        finalIndex = 8;
    }

    for (let i = initialIndex; i <= finalIndex; i+=3)
    {
        let neighborSquareText =  document.getElementById(squareList[i].id).innerText;
        if(neighborSquareText === squareText){
            sequelCounter++;
        }
    }

    if(sequelCounter === 3){
        for (let i = initialIndex; i <= finalIndex; i+=3) {
            document.getElementById(squareList[i].id).style.backgroundColor = "green";
        }
        return true;
    }else{
        return false;
    }

}
function CheckForWinner(square){
    let squaresList = document.getElementsByClassName('square');
    let squareIndex = -1;
    for (let count = 0; count < squaresList.length; count++){
        if(squaresList[count] === square){
            squareIndex = count;
            break;
        }
    }
    let squareText = document.getElementById(square.id).innerText;
    /* Check Row */
    if(CheckRowForWinner(squaresList, squareIndex, squareText)){
        AnnounceWinner(currentPlayer);
    }
    else
    {
        /* Check Column */
        if(CheckColForWinner(squaresList, squareIndex, squareText)){
            AnnounceWinner(currentPlayer);
        }
    }
}
function PickSquare(square) {
    if(winnerPlayer === -1)
    {
        /* Neutral Mark */
        let mark = '';
        /* Get square current value */
        let squareText = document.getElementById(square.id).innerText;
        /* Is Square available? */
        if(squareText !== markPlayer1 && squareText !== markPlayer2)
        {
            /* Who is the current player ? */
            if(currentPlayer === 0)
            {
                /*If player 1 put mark 1*/
                mark = markPlayer1;

            }else
            {
                /*If player 2 put mark 2*/
                mark = markPlayer2;
            }
            /*Insert text or image  */
            document.getElementById(square.id).innerText = mark;
            CheckForWinner(square);
            NextRound();
        }
    }
}
function ResetSquares(){
    let squareList = document.getElementsByClassName('square');
    for (let count = 0; count < squareList.length; count++){
        document.getElementById(squareList[count].id).innerText = defaultMark;
        document.getElementById(squareList[count].id).style.backgroundColor = "#eee";
    }
    winnerPlayer = -1;
    currentPlayer = 0;
    document.getElementById("winnerMark").innerText = defaultMark;
    document.getElementById("playerMark").innerText = markPlayer1;
}
function NextRound() {
    if(winnerPlayer === -1){
        if(currentPlayer === 0)
        {
            /*Update player counter*/
            currentPlayer = 1;
            /*Update UI*/
            document.getElementById('playerMark').innerText = markPlayer2;
        }
        else
        {
            /*Update player counter*/
            currentPlayer = 0;
            /*Update UI*/
            document.getElementById('playerMark').innerText = markPlayer1;
        }
    }
}