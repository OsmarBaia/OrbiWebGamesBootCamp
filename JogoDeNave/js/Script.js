/* Spawn a new enemy minion div in game_container*/

function SpawnEnemyOfType(type){
    let divIDName;
    let divObjToAppend;
    
    switch (type){
        case 1:
            divIDName = '#minion1';
            divObjToAppend = "<div class ='enemyMinion' id ='minion1'></div>";
            break;
        case 2:
            divIDName = '#minion2';
            divObjToAppend = "<div class ='enemyMinion' id ='minion2'></div>";
            break;
        case 3:
            divIDName = '#minion3';
            divObjToAppend = "<div class ='enemyMinion' id ='minion3'></div>";
            break;
        case 4:
            divIDName = '#minion4';
            divObjToAppend = "<div class ='enemyMinion' id ='minion4'></div>";
            break;
    }
    
    if (typeof divObjToAppend == 'undefined')
    { return; }
    
    $('#game_container').append(divObjToAppend);
    $(divIDName).css('top',  Math.random() * 600 + 50);
    $(divIDName).css(
        { transform: ' rotate(' + (Math.random() * 361) + 'deg)'
                + ' scale(' + (Math.random() + 0.5) + ');'}
        );
    
}

function startGame(){
    /* Init Game */
    Game();
}

function PlayerInput(){
    /* Input Handling */
    let keyEventArray = [];

    $(document).keyup(function (e){
        keyEventArray[e.which] = false;
    });

    $(document).keydown(function (e){
        keyEventArray[e.which] = true;
    });
    return keyEventArray;
}

function PlayerController(game){
    /* Player CSS Properties */
    let playerPawn = $("#playerPawn");
    let playerPosY = parseInt(playerPawn.css('top'));
    let playerPosX = parseInt(playerPawn.css('left'));
    let playerWidth = parseInt(playerPawn.css('width'));
    let playerHeight = parseInt(playerPawn.css('height'));
    let playerMargin = 10;

    /*  Vertical movement   */
    /*  Move Up */
    if(game.playerInput[game.KeyBindings.W]){
        if(playerPosY >= 10 - (playerHeight + playerMargin)){
            playerPawn.css('top', playerPosY-10);
        }
    }
    /*  Move Down   */
    if (game.playerInput[game.KeyBindings.S]){
        if(playerPosY <= 480 - (playerHeight + playerMargin)){
            playerPawn.css('top', playerPosY+10);
        }
    }

    /*  Horizontal movement */
    /*  Move Left   */
    if(game.playerInput[game.KeyBindings.A]){
        if(playerPosX >= 0){
            playerPawn.css('left', playerPosX - 10);
        }
    }
    /*  Move Right  */
    if(game.playerInput[game.KeyBindings.D]){
        if(playerPosX + playerWidth <= 950)
        {
            playerPawn.css('left', playerPosX + 10);
        }
    }

    /*  Fire Photon Torpedoes   */
}

function EnemyController(game) {
    for (let i = 0; i < game.enemyStatus.length; i++)
    {
        if(game.enemyStatus[i]){
            let _enemyPawn = $('#minion'+(i+1));
            let _enemyPosX = parseInt(_enemyPawn.css('left'));
            let _enemyWidth = parseInt(_enemyPawn.css('width'));
            let _enemySpeed = 10;
            
            //_enemyPosX >= PlayerPosX - _enemyWidth;
            if (_enemyPosX >= 360)
            {
                _enemyPawn.css('left', _enemyPosX - _enemySpeed);
            }
            else
            {
                $(_enemyPawn).remove();
                game.enemyStatus[i] = false;
            }
        }
    }
}

function EnemySpawner(game) {
    let _enemyType  =   Math.trunc(Math.random() * 4 + 1);
    let _enemyIndex =   _enemyType - 1;
    
    
    if(!game.enemyStatus[_enemyIndex])
    {
        game.enemyStatus[_enemyIndex] = true;
        SpawnEnemyOfType(_enemyType);
    }
}

function Game() {
    //Hide Start Panel
    $('#gameStart').hide();
    // Game Object
    let game = { };
    // Spawn Player
    $('#game_container').append("<div id= 'playerPawn'></div>");
    // Show UI
    // $('#playerUI').show();
    
    // GamePad
    game.KeyBindings = {
        W: 87, A: 65, S: 83, D: 68, SPACE: 32
    };
    // Input Handler
    game.playerInput = PlayerInput();
    // Spawn Control
    game.enemyStatus = [false, false, false, false];
    let spawnCoolDown = 1000;
    let spawnTimeCounter = 0;
    
    /* Game Loop Handling */
    function gameLoop() {
        // Player
        PlayerController(game);
        
        // Spawn enemy
        spawnTimeCounter += 30;
        if(spawnTimeCounter >= spawnCoolDown){
            EnemySpawner(game);
            spawnTimeCounter = 0;
        }
        // Move Enemy
        EnemyController(game);
    }
    
    // Loop-Timer
    game.timer = setInterval(gameLoop, 30);
}

