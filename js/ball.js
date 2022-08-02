class Ball {
  constructor(params={}) {
    this.position = params.position || new Vector2d({x: params.x || 10, y: params.y || 10});
    this.velocity = params.velocity || new Vector2d({x: params.vx || 1, y: params.vy || 1});
    this.width = 15;
    this.height = 15;
  }
}