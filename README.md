# canvas-pong
The classic Atari Pong game from 1972, written in Javascript &amp; rendered on a HTML5 Canvas. 

Why? Just because.
Well, OK, partly because I wanted to refresh my rusty JS skills, partly as a fun exercise to work through with my daughter, and partly because games were the reason I first got into computers as an 8 year old myself, but I haven't actually done any game coding for .... sheesh, about twenty years.

So don't expect this to be a shining example of best practice, more of a testbed for some approaches.

## Compatibility

The Javascript uses Classes, so [according to MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#browser_compatibility) it won't run on Internet Explorer, but should run on Edge and all other 'modern' browsers.

## To run

You'll need to run a local HTTP server, to get round the CORS restrictions on loading Javascript via file:// URLs. I use [Node http-server](https://www.npmjs.com/package/http-server) myself.

Once http-server is installed, just run:
```
http-server -c-1
```
from the root directory, and load `http://localhost:8080/` in your browser.

Click 'Play' to play. Default controls are:

player 1 - `W` up / `S` down

player 2 - `up arrow` up / `down arrow`



