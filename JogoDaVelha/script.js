/* Player 1 Mark */
const player1Marker = 'X';
/* Player 2 Mark */
const player2Marker = 'O';
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
        document.getElementById('winnerMarker').innerText = player1Marker;
    }
    else{
        winnerPlayer = 1;
        document.getElementById('winnerMarker').innerText = player2Marker;
    }    
}
function PaintSquares(squaresList,indexes){
    /*Paint Square*/
    for (let i = 0; i < indexes.length; i++)
    {
        document.getElementById(squaresList[indexes[i]].id).style.backgroundColor = "green";
    }
}
function GetSquaresTexts(squaresList){
    let squaresTextList = [];
    for (let index = 0; index < squaresList.length; index++){
        let itemText = squaresList[index].innerHTML;
        squaresTextList.push(itemText);
    }
    return squaresTextList;
}
function GetSquareNeighbors(squareList, squareIndex, lineStyle){
    if(squareIndex < 0 || squareIndex > squareList.length - 1 || typeof squareIndex === undefined || typeof squareList === undefined || typeof lineStyle === undefined){
        return;
    }
    let neighborsIndexes = [];

    if(lineStyle === 'Row'){
        /* Row */
        if(squareIndex <= 2){
            /* First Row*/
            neighborsIndexes.push(0,1,2);
        }else if(squareIndex > 2 && squareIndex <= 5){
            /* Second Row*/
            neighborsIndexes.push(3,4,5);
        }else{
            /* Third Row*/
            neighborsIndexes.push(6,7,8);
        }
    }else if(lineStyle === 'Column'){
        /* Column */
        if(squareIndex === 0 || squareIndex === 3 || squareIndex === 6 ){
            /* First Column */
            neighborsIndexes.push(0,3,6);
        }else if(squareIndex === 1 || squareIndex === 4 || squareIndex === 7){
            /* Second Column*/
            neighborsIndexes.push(1,4,7);
        }else{
            /* Third Column*/
            neighborsIndexes.push(2,5,8);
        }
    }else if(lineStyle === 'Diagonal'){
        if(squareIndex === 0 || squareIndex === 8 ){
            /* \ */
            neighborsIndexes.push(0,4,8);
        }else if(squareIndex === 2 || squareIndex === 6){
            /* / */
            neighborsIndexes.push(2,4,6);
        }else if (squareIndex === 4){
            /* X */
            neighborsIndexes.push(0,2,4,6,8);
        }else{
            /* No diagonal Neighbors */
            return;
        }
    }else {
        /* No a valid input */
        return;
    }

    /* Return Neighbors*/
    console.log(neighborsIndexes);
    return new Set(neighborsIndexes);
}
function CheckSquareStreak(squaresList, squareIndex, lineStyle){
    let squaresTexts = [...GetSquaresTexts(squaresList)];
    let neighborsSquares = [...GetSquareNeighbors(squaresList, squareIndex, lineStyle)];
    if(neighborsSquares.length === 3){
        if(
            squaresTexts[neighborsSquares[0]] === squaresTexts[neighborsSquares[1]] &&
            squaresTexts[neighborsSquares[0]] === squaresTexts[neighborsSquares[2]] &&
            squaresTexts[neighborsSquares[1]] === squaresTexts[neighborsSquares[2]]
        ){
            PaintSquares(squaresList, neighborsSquares);
            AnnounceWinner();
        }
    }
    else{
       if (lineStyle === 'Diagonal' && squareIndex === 4){
           let diagIndexes = [];
           if(
               squaresTexts[neighborsSquares[0]] === squaresTexts[neighborsSquares[2]] &&
               squaresTexts[neighborsSquares[0]] === squaresTexts[neighborsSquares[4]] &&
               squaresTexts[neighborsSquares[2]] === squaresTexts[neighborsSquares[4]]
           ){
               diagIndexes.push(0,2,4);
           }

           if(
               squaresTexts[neighborsSquares[1]] === squaresTexts[neighborsSquares[2]] &&
               squaresTexts[neighborsSquares[1]] === squaresTexts[neighborsSquares[3]] &&
               squaresTexts[neighborsSquares[2]] === squaresTexts[neighborsSquares[3]]
           ){
               diagIndexes.push(1,2,3);
           }

           if(diagIndexes.length > 0){
               PaintSquares(squaresList, diagIndexes);
               AnnounceWinner();
           }
       }
    }

}
function CheckForWinner(square){
    let squaresList = document.getElementsByClassName('square');
    let squareIndex = -1;
    for (let i = 0; i < squaresList.length; i++){
        if(squaresList[i] === square){
            squareIndex = i;
        }
    }

    if(squareIndex >= 0 && squareIndex < squaresList.length){
        CheckSquareStreak(squaresList, squareIndex, 'Row');
        CheckSquareStreak(squaresList, squareIndex, 'Column');
        if (squareIndex !== 1 && squareIndex !== 3  && squareIndex !== 5  && squareIndex !== 7){
            CheckSquareStreak(squaresList, squareIndex, 'Diagonal');
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
        if(squareText !== player1Marker && squareText !== player2Marker)
        {
            /* Who is the current player ? */
            if(currentPlayer === 0)
            {
                /*If player 1 put mark 1*/
                mark = player1Marker;

            }else
            {
                /*If player 2 put mark 2*/
                mark = player2Marker;
            }
            /*Insert text or image  */
            document.getElementById(square.id).innerHTML = mark;
            CheckForWinner(square);
            NextRound();
        }
    }
}
function ResetSquares(){
    let squaresList = document.getElementsByClassName('square');
    for (let count = 0; count < squaresList.length; count++){
        document.getElementById(squaresList[count].id).innerText = defaultMark;
        document.getElementById(squaresList[count].id).style.backgroundColor = "#eee";
    }
    winnerPlayer = -1;
    currentPlayer = 0;
    document.getElementById("winnerMarker").innerText = defaultMark;
    document.getElementById("currentPlayerMarker").innerText = player1Marker;
}
function NextRound() {
    if(winnerPlayer === -1){
        if(currentPlayer === 0)
        {
            /*Update player counter*/
            currentPlayer = 1;
            /*Update UI*/
            document.getElementById('currentPlayerMarker').innerText = player2Marker;
        }
        else
        {
            /*Update player counter*/
            currentPlayer = 0;
            /*Update UI*/
            document.getElementById('currentPlayerMarker').innerText = player1Marker;
        }
    }
}