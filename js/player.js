class Player {
  constructor(params={}) {
    this.position = params.position || new Vector2d({x: params.x || 10, y: params.y || 10});
    this.velocity = params.velocity || new Vector2d();
    this.name = params.name || 'Player';
    this.score = params.score || 0;
    this.height = params.height || 80;
    this.width = params.width || 15;
  }
}