function Box(params) {
  this.position = params.position || new Vector2d({x: params.x || 10, y: params.y || 10});
  this.width = params.width || 10;
  this.height = params.height || 10;
  this.color = params.color || '#ffffff';  
}
