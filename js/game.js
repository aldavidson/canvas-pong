
class Game {
  // Canvas coordinate origin is top-left, so UP and DOWN are inverted
  defaultControls = {
    PLAYER2_DOWN: 'ArrowUp',
    PLAYER2_UP: 'ArrowDown',
    PLAYER1_DOWN: 'KeyW',
    PLAYER1_UP: 'KeyS',
  };
  MAX_PLAYER_SPEED = 3;
  
  constructor(params={}) {
    this.window = params.window || window;
    this.canvas = params.canvas || this.window.document.getElementById('canvas');
    this.canvas.height = 400;
    this.canvas.width = 650;
    this.context = params.context || canvas.getContext('2d');
    this.renderer = new Renderer( {context: this.context, canvas: this.canvas} );
    this.debugElement = params.debugElement || this.window.document.getElementById('debug');
    
    this.paused = params.paused || true;
    this.player1 = params.player1 || new Player({position: new Vector2d({x: 10, y: 200}) });
    this.player2 = params.player2 || new Player({position: new Vector2d({x: 625, y: 200}) });
    this.ball = params.ball || new Ball( {position: new Vector2d({x: canvas.width/2 - 7.5, y: canvas.height/2 })} );
    this.keysPressed = {};

    this.controls = params.controls || this.defaultControls;
    this.registerInputEvents();
  }
  
  registerInputEvents() {
    this.window.addEventListener('keydown', function (e) {
      this.keysPressed[e.code] = true;
      e.preventDefault();
    }.bind(this));
    this.window.addEventListener('keyup', function (e) {
      delete this.keysPressed[e.code];
    }.bind(this));
  }

  
  reflectOffTopAndBottom(ball=this.ball, canvas=this.canvas) {
    if ( ball.velocity.y > 0 ) {
      if ( ball.position.y + ball.width >= canvas.height ) {
        ball.velocity.y = ball.velocity.y * -1;
      }
    } else if ( ball.position.y <= 0 ) {
      ball.velocity.y = ball.velocity.y * -1;
    }
    
    ball.position = ball.position.plus(ball.velocity);
  }
  
  reflectOffBats(ball=this.ball, player1=this.player1, player2=this.player2) {
    if ( ball.velocity.x < 0 && this.hasCollided( ball, player1, 'L') ) {
      ball.velocity.x *= -1.1;
      ball.velocity.y += player1.velocity.y;
    } else if ( ball.velocity.x > 0 && this.hasCollided( ball, player2, 'R') ) {
      ball.velocity.x *= -1.1;
      ball.velocity.y += player2.velocity.y;
    }
  }
  
  // Returns true if the box1Face face of box has collided with 
  // the opposite face of box2, otherwise false
  // args:
  //  box1, box2  - Boxes
  //  box1Face    - one of ['L', 'R', 'T', 'B']
  hasCollided(box1, box2, box1Face) {
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
  
  handleOutOfBounds(ball=this.ball, canvas=this.canvas) {
    if ( ball.velocity.x > 0 ) {
      if ( ball.position.x + ball.width >= canvas.width ) {
        this.player1.score += 1;
        this.initialiseBall(ball, canvas);
      }
    } else if ( ball.position.x <= 0 ) {
        this.player2.score += 1;
        this.initialiseBall(ball, canvas);
    }
  }
  
  initialiseBall(ball=this.ball, canvas=this.canvas) {
    ball.position.x = canvas.width / 2;
    ball.velocity.x = Math.random() * 2.0 - 1.0;
    ball.velocity.y = Math.random() * 2.0 - 1.0;
  
    if( ball.velocity.x > -0.5 && ball.velocity.x < 0.5 ) {
      ball.velocity.x = 1
    }
  }
  
  moveBall() {
    this.reflectOffBats()
    this.reflectOffTopAndBottom();
    this.handleOutOfBounds();
    this.debug( 'ball.position: ', this.ball.position );
    this.debug( 'ball.velocity: ', this.ball.velocity );
  }
  
  handleInput() {
    this.debug( 'controls: ', this.controls );
    this.debug( 'keysPressed: ', this.keysPressed );
    this.debug( 'player1.velocity: ', this.player1.velocity );
    this.debug( 'player2.velocity: ', this.player2.velocity );
    
    if( this.keysPressed[this.controls.PLAYER1_UP] && 
      this.player1.velocity.y < this.MAX_PLAYER_SPEED ) {
        this.player1.velocity.y += 0.1;
    }
    if( this.keysPressed[this.controls.PLAYER1_DOWN] && 
      this.player1.velocity.y > -1 * this.MAX_PLAYER_SPEED ) {
        this.player1.velocity.y -= 0.1;
    }
    if( this.keysPressed[this.controls.PLAYER2_UP] && 
      this.player2.velocity.y < this.MAX_PLAYER_SPEED ) {
        this.player2.velocity.y += 0.1;
    }
    if( this.keysPressed[this.controls.PLAYER2_DOWN] && 
      this.player2.velocity.y > -1 * this.MAX_PLAYER_SPEED ) {
        this.player2.velocity.y -= 0.1;
    }
  }
  
  movePlayers() {
    // clip position if player is out of bounds
    this.player1.position = this.player1.position.plus(this.player1.velocity);
    this.player1.position.y = this.clampToRange(this.player1.position.y, 0, this.canvas.height - this.player1.height);
    this.debug( 'player1.position:', this.player1.position );
  
    this.player2.position = this.player2.position.plus(this.player2.velocity);
    this.player2.position.y = this.clampToRange(this.player2.position.y, 0, this.canvas.height - this.player2.height);
    this.debug( 'player2.position:', this.player2.position );
  }
  
  clampToRange( variable, min, max ) {
    if( variable > max ) {
      return max;
    } else if ( variable < min ) {
      return min;
    }
    return variable;
  }
  
  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderer.drawBoard();
    this.renderer.drawPlayers(this.player1, this.player2);
    this.renderer.drawBall(this.ball);
    this.renderer.drawScores(this.player1.score, this.player2.score);
  }
  
  loop() {
    if (!this.paused) {
      this.clearDebug();
      this.render();
      this.handleInput();
      this.movePlayers();
      this.moveBall();
      this.window.requestAnimationFrame(this.loop.bind(this));
    }
  }
  
  clearDebug() {
    if( this.debugElement ) {
      this.debugElement.innerHTML = '';
    }
  }
  
  debug() {
    if( this.debugElement ) {
      var i;
      for( i = 0; i  < arguments.length; i++ ) {
        this.debugElement.innerHTML += JSON.stringify(arguments[i]);
      }
      this.debugElement.innerHTML += '<br />';
    }
  }
}