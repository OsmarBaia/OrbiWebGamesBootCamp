function start() {
  $("#inicio").hide();

  $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
  $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
  $("#fundoGame").append("<div id='inimigo2' '></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

  var energiaAtual = 3;
  var fimdejogo = false;
  var podeAtirar = true;
  var pontos = 0;
  var salvos = 0;
  var perdidos = 0;
  var posicaoY = parseInt(Math.random() * 334);
  var velocidade = 5;
  var somDisparo = document.getElementById("somDisparo");
  var somExplosao = document.getElementById("somExplosao");
  var musica = document.getElementById("musica");
  var somGameover = document.getElementById("somGameover");
  var somPerdido = document.getElementById("somPerdido");
  var somResgate = document.getElementById("somResgate");

  musica.addEventListener(
    "ended",
    function () {
      musica.currentTime = 0;
      musica.play();
    },
    false
  );
  musica.play();

  var jogo = {};
  var TECLA = {
    W: 87,
    S: 83,
    D: 68,
  };

  jogo.pressionou = [];

  $(document).keydown(function (e) {
    jogo.pressionou[e.which] = true;
  });

  $(document).keyup(function (e) {
    jogo.pressionou[e.which] = false;
  });

  jogo.timer = setInterval(loop, 30);

  function loop() {
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
  }

  /**
   * It moves the background image to the left by 1 pixel
   */
  function movefundo() {
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
  }

  /**
   * It moves the player's paddle up and down, and also calls the function that shoots the ball
   */
  function movejogador() {
    if (jogo.pressionou[TECLA.W]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 10);

      if (topo <= 0) {
        $("#jogador").css("top", topo + 10);
      }
    }

    if (jogo.pressionou[TECLA.S]) {
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo + 10);

      if (topo >= 434) {
        $("#jogador").css("top", topo - 10);
      }
    }

    if (jogo.pressionou[TECLA.D]) {
      disparo();
    }
  }

  /**
   * The function moveinimigo1() moves the enemy 1 to the left, and when it reaches the left side of
   * the screen, it returns to the right side of the screen in a random position
   */
  function moveinimigo1() {
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX - velocidade);
    $("#inimigo1").css("top", posicaoY);

    if (posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }
  }

  /**
   * The function moveinimigo2() is responsible for moving the enemy 2 to the left
   */
  function moveinimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", posicaoX - 3);

    if (posicaoX <= 0) {
      $("#inimigo2").css("left", 775);
    }
  }

  /**
   * The function moveamigo() moves the amigo image to the right by 1 pixel every time it is called
   */
  function moveamigo() {
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", posicaoX + 1);

    if (posicaoX > 906) {
      $("#amigo").css("left", 0);
    }
  }

  /**
   * The function `disparo()` is called when the player presses the spacebar. It checks if the player
   * can shoot (`podeAtirar`), and if so, it plays the sound of the shot, sets `podeAtirar` to false,
   * and creates a new `div` element with the id `disparo` (which is the bullet). It then sets the
   * position of the bullet to the position of the player's spaceship, and creates a new interval that
   * will execute the function `executaDisparo()` every 30 milliseconds
   */
  function disparo() {
    if (podeAtirar == true) {
      somDisparo.play();
      podeAtirar = false;

      topo = parseInt($("#jogador").css("top"));
      posicaoX = parseInt($("#jogador").css("left"));
      tiroX = posicaoX + 190;
      topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    } //Fecha podeAtirar

    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left", posicaoX + 15);

      if (posicaoX > 900) {
        window.clearInterval(tempoDisparo);
        tempoDisparo = null;
        $("#disparo").remove();
        podeAtirar = true;
      }
    }
  }

  /**
   * It checks for collisions between the player, enemies, and friend
   */
  function colisao() {
    var colisao1 = $("#jogador").collision($("#inimigo1"));
    var colisao2 = $("#jogador").collision($("#inimigo2"));
    var colisao3 = $("#disparo").collision($("#inimigo1"));
    var colisao4 = $("#disparo").collision($("#inimigo2"));
    var colisao5 = $("#jogador").collision($("#amigo"));
    var colisao6 = $("#inimigo2").collision($("#amigo"));

    /* It checks if the player's spaceship collides with the enemy 1, and if so, it decreases the player's
energy by 1, calls the function `explosao1()`, and repositions the enemy 1 in a random position. */
    if (colisao1.length > 0) {
      energiaAtual--;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }

    /* It checks if the player's spaceship collides with the enemy 2, and if so, it decreases the
   player's
   energy by 1, calls the function `explosao2()`, and removes the enemy 2. */
    if (colisao2.length > 0) {
      energiaAtual--;
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X, inimigo2Y);

      $("#inimigo2").remove();

      reposicionaInimigo2();
    }

    /* It checks if the bullet collides with the enemy 1, and if so, it increases the speed of the
    enemy 1, increases the player's score by 100, calls the function `explosao1()`, and repositions
    the enemy 1 in a random position. */
    if (colisao3.length > 0) {
      velocidade = velocidade + 0.3;
      pontos = pontos + 100;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));

      explosao1(inimigo1X, inimigo1Y);
      $("#disparo").css("left", 950);

      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", posicaoY);
    }

    /* It checks if the bullet collides with the enemy 2, and if so, it increases the speed of the
    enemy 2, increases the player's score by 50, calls the function `explosao2()`, and removes the
    enemy 2. */
    if (colisao4.length > 0) {
      velocidade = velocidade + 0.6;
      pontos = pontos + 50;
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      $("#inimigo2").remove();

      explosao2(inimigo2X, inimigo2Y);
      $("#disparo").css("left", 950);

      reposicionaInimigo2();
    }

    /* It checks if the player's spaceship collides with the friend, and if so, it increases the
    number of friends saved by 1, calls the function `reposicionaAmigo()`, and removes the friend. */
    if (colisao5.length > 0) {
      somResgate.play();
      salvos++;
      reposicionaAmigo();
      $("#amigo").remove();
    }

    /* It checks if the enemy 2 collides with the friend, and if so, it increases the number of friends
lost by 1, calls the function `explosao3()`, and removes the friend. */
    if (colisao6.length > 0) {
      perdidos++;
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX, amigoY);
      $("#amigo").remove();

      reposicionaAmigo();
    }
  }

  /**
   * It creates an explosion animation when the player's bullet hits the enemy 1
   * @param inimigo1X - the x-axis position of the enemy
   * @param inimigo1Y - the Y position of the enemy
   */
  function explosao1(inimigo1X, inimigo1Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div");
    $("#explosao1").css("background-image", "url(assets/imgs/explosao.png)");
    var div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 1000);

    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
    }
  }

  /**
   * It creates a new enemy every 5 seconds
   */
  function reposicionaInimigo2() {
    var tempoColisao4 = window.setInterval(reposiciona4, 5000);

    function reposiciona4() {
      window.clearInterval(tempoColisao4);
      tempoColisao4 = null;

      if (fimdejogo == false) {
        $("#fundoGame").append("<div id=inimigo2></div");
      }
    }
  }

  /**
   * It creates an explosion animation when the enemy 2 is hit
   * @param inimigo2X - the x-axis position of the enemy
   * @param inimigo2Y - the Y position of the enemy
   */
  function explosao2(inimigo2X, inimigo2Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(/assets/imgs/explosao.png)");
    var div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    function removeExplosao2() {
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
    }
  }

  /**
   * It creates a new div with the id of "amigo" and the class of "anima3" every 6 seconds
   */
  function reposicionaAmigo() {
    var tempoAmigo = window.setInterval(reposiciona6, 6000);

    function reposiciona6() {
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;

      if (fimdejogo == false) {
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      }
    }
  }

  /**
   * It creates an explosion animation when the player's ship collides with an enemy ship
   * @param amigoX - the X coordinate of the enemy
   * @param amigoY - the Y position of the enemy
   */
  function explosao3(amigoX, amigoY) {
    somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);
    var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
    function resetaExplosao3() {
      $("#explosao3").remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3 = null;
    }
  }

  /**
   * The function placar() is called when the page loads and when the user clicks on the button
   * "Salvar". It updates the score board with the current values of the variables pontos, salvos and
   * perdidos
   */
  function placar() {
    $("#placar").html(
      "<h2> Pontos: " +
        pontos +
        " Salvos: " +
        salvos +
        " Perdidos: " +
        perdidos +
        "</h2>"
    );
  }

  /**
   * It changes the image of the energy bar according to the value of the variable energiaAtual
   */
  function energia() {
    if (energiaAtual == 3) {
      $("#energia").css("background-image", "url(assets/imgs/energia3.png)");
    }

    if (energiaAtual == 2) {
      $("#energia").css("background-image", "url(assets/imgs/energia2.png)");
    }

    if (energiaAtual == 1) {
      $("#energia").css("background-image", "url(assets/imgs/energia1.png)");
    }

    if (energiaAtual == 0) {
      $("#energia").css("background-image", "url(assets/imgs/energia0.png)");

      gameOver();
    }
  }

  /**
   * It removes the player, enemies and friend from the game, and then adds a game over screen with a
   * button to restart the game
   */
  function gameOver() {
    fimdejogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html(
      "<h1> Game Over </h1><p>Sua pontuação foi: " +
        pontos +
        "</p>" +
        "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>"
    );
  }
}

/**
 * It removes the game over screen and calls the start function
 */
function reiniciaJogo() {
  somGameover.pause();
  $("#fim").remove();
  start();
}
