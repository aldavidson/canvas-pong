class Vector2d {
  constructor(params={}) {
    this.x = params.x || 0;
    this.y = params.y || 0;
  }

  plus(other_vector2d) {
    return new Vector2d({
      x: this.x + other_vector2d.x,
      y: this.y + other_vector2d.y,
    });
  }

  minus(other_vector2d) {
    return new Vector2d({
      x: this.x - other_vector2d.x,
      y: this.y - other_vector2d.y,
    });
  }

  dot(other_vector2d) {
    return this.x * other_vector2d.x + this.y * other_vector2d.y;
  }

  get mod() {
    return Math.sqrt( this.x * this.x + this.y * this.y );
  }
}