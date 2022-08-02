
function Box(params) {
  this.position = params.position || new Vector2d({x: params.x || 10, y: params.y || 10});
  this.width = params.width || 10;
  this.height = params.height || 10;
  this.color = params.color || '#ffffff';  
}

function drawBox(box) {
  ctx.fillStyle = box.color;
  ctx.fillRect(box.position.x, box.position.y, box.width, box.height);
}

function drawBoard() {
  // midline
  var midLine = new Box({ 
    x: (canvas.width/2) - 2.5,
    y: -1,
    width: 5,
    height: canvas.height+1,
    color: '#FFFFFF'
  });
  drawBox(midLine);
}

function drawPlayers() {
  // player 1
  drawBox( new Box({
    position: player1.position,
    width: 15,
    height: 80,
    color: '#FFFFFF',
  }) );

  // player 2
  drawBox( new Box({
    position: player2.position,
    width: 15,
    height: 80,
    color: '#FFFFFF',
  }) );
}

function drawScores() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgb(255,255,255)";
  // player 1
  var str1 = player1.score;
  ctx.fillText(str1, (canvas.width/2) - 50, 20);
  // player 2
  var str2 = player2.score;
  ctx.fillText(str2, (canvas.width/2) + 50, 20);
}

function drawBall() {
  drawBox( new Box({
    position: ball.position,
    width: ball.width,
    height: ball.height,
    color: '#FFFFFF',
  }) );
}

function reflectOffTopAndBottom() {
  if ( ball.velocity.y > 0 ) {
    if ( ball.position.y + ball.width >= canvas.height ) {
      ball.velocity.y = ball.velocity.y * -1;
    }
  } else if ( ball.position.y <= 0 ) {
    ball.velocity.y = ball.velocity.y * -1;
  }
  
  ball.position = ball.position.plus(ball.velocity);
}

function reflectOffBats() {
  if ( ball.velocity.x < 0 && hasCollided( ball, player1, 'L') ) {
    ball.velocity.x *= -1;
    ball.velocity.y += player1.velocity.y;
  } else if ( ball.velocity.x > 0 && hasCollided( ball, player2, 'R') ) {
    ball.velocity.x *= -1;
    ball.velocity.y += player2.velocity.y;
  }
}

// Returns true if the box1Face face of box has collided with 
// the opposite face of box2, otherwise false
// args:
//  box1, box2  - Boxes
//  box1Face    - one of ['L', 'R', 'T', 'B']
function hasCollided(box1, box2, box1Face) {
  if( box1Face == 'L' ) {
    return (
      box1.position.x <= box2.position.x + box2.width &&
      box1.position.y + box1.height >= box2.position.y &&
      box1.position.y <= box2.position.y + box2.height
    )
  } else if( box1Face == 'R') {
    return (
      box1.position.x + box1.width >= box2.position.x &&
      box1.position.y + box1.height >= box2.position.y &&
      box1.position.y <= box2.position.y + box2.height
    )
  } else if( box1Face == 'T') {
    return (
      box1.position.y + box.height >= box2.position.y &&
      box1.position.x + box1.width >= box2.position.x &&
      box1.position.x <= box2.position.x + box2.width
    )
  } else if( box1Face == 'B') {
    return (
      box1.position.y <= box2.position.y + box2.height &&
      box1.position.x + box1.width >= box2.position.x &&
      box1.position.x <= box2.position.x + box2.width
    )
  } else return false;
}

function handleOutOfBounds() {
  if ( ball.velocity.x > 0 ) {
    if ( ball.position.x + ball.width >= canvas.width ) {
      player1.score += 1;
      initialiseBall();
    }
  } else if ( ball.position.x <= 0 ) {
      player2.score += 1;
      initialiseBall();
  }
}

function initialiseBall() {
  ball.position.x = canvas.width / 2;
  ball.velocity.x = Math.random() * 2.0 - 1.0;
  ball.velocity.y = Math.random() * 2.0 - 1.0;

  if( ball.velocity.x > -0.5 && ball.velocity.x < 0.5 ) {
    ball.velocity.x = 1
  }
}

function moveBall() {
  reflectOffBats()
  reflectOffTopAndBottom();
  handleOutOfBounds();
  debug( 'ball.position: ', ball.position );
  debug( 'ball.velocity: ', ball.velocity );
}

function handleInput() {
  debug( 'controls: ', controls );
  debug( 'keysPressed: ', keysPressed );
  debug( 'player1.velocity: ', player1.velocity );
  debug( 'player2.velocity: ', player2.velocity );
  
  if( keysPressed[controls.PLAYER1_UP] && 
    player1.velocity.y < MAX_PLAYER_SPEED ) {
      player1.velocity.y += 0.1;
  }
  if( keysPressed[controls.PLAYER1_DOWN] && 
    player1.velocity.y > -1 * MAX_PLAYER_SPEED ) {
      player1.velocity.y -= 0.1;
  }
  if( keysPressed[controls.PLAYER2_UP] && 
    player2.velocity.y < MAX_PLAYER_SPEED ) {
      player2.velocity.y += 0.1;
  }
  if( keysPressed[controls.PLAYER2_DOWN] && 
    player2.velocity.y > -1 * MAX_PLAYER_SPEED ) {
      player2.velocity.y -= 0.1;
  }
}

function movePlayers() {
  // clip position if player is out of bounds
  player1.position = player1.position.plus(player1.velocity);
  player1.position.y = clampToRange(player1.position.y, 0, canvas.height - player1.height);
  debug( 'player1.position:', player1.position );

  player2.position = player2.position.plus(player2.velocity);
  player2.position.y = clampToRange(player2.position.y, 0, canvas.height - player2.height);
  debug( 'player2.position:', player2.position );
}

function clampToRange( variable, min, max ) {
  if( variable > max ) {
    return max;
  } else if ( variable < min ) {
    return min;
  }
  return variable;
}


function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPlayers();
  drawBall();
  drawScores();
}

function loop() {
  clearDebug();
  render();
  if (!paused) {
    handleInput();
    movePlayers();
    moveBall();
    window.requestAnimationFrame(loop);
  }
}

function clearDebug() {
  if( div = document.getElementById('debug') ) {
    div.innerHTML = '';
  }
}
function debug() {
  if( div = document.getElementById('debug') ) {
    for( i = 0; i  < arguments.length; i++ ) {
      div.innerHTML += JSON.stringify(arguments[i]);
    }
    div.innerHTML += '<br />';
  }
}

function registerInputEvents() {
  window.addEventListener('keydown', function (e) {
    keysPressed[e.code] = true;
    e.preventDefault();
  });
  window.addEventListener('keyup', function (e) {
    delete keysPressed[e.code];
  });
}

// global objects for canvas & rendering context
var canvas = document.getElementById('canvas');
canvas.height = 400;
canvas.width = 650;
var ctx = canvas.getContext('2d');


// TODO: these objects should be encapsulated in a Game object or similar
var score1 = 0;
var score2 = 0;
var paused = true;
var player1 = new Player({position: new Vector2d({x: 10, y: 200}) });
var player2 = new Player({position: new Vector2d({x: 625, y: 200}) });
var ball = new Ball( {position: new Vector2d({x: canvas.width/2 - 7.5, y: canvas.height/2 })} );
var keysPressed = {};
// Canvas coordinate origin is top-left, so UP and DOWN are inverted
const controls = {
  PLAYER2_DOWN: 'ArrowUp',
  PLAYER2_UP: 'ArrowDown',
  PLAYER1_DOWN: 'KeyW',
  PLAYER1_UP: 'KeyS',
};
const MAX_PLAYER_SPEED = 2;
