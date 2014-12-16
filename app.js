var express = require( 'express' );
var http    = require( 'http' );
var path    = require( 'path' );
var app     = express();
var WebSocketServer = require('ws').Server;
var cnt = 0;
 
// all environments
app.set( 'port', process.env.PORT || 3000 );
app.set( 'websocket_port', process.env.PORT || 8080 );
app.use( express.favicon());
app.use( express.logger( 'dev' ));
app.use( express.json());
app.use( express.urlencoded());
app.use( express.methodOverride());
app.use( app.router );
app.use( express.static( path.join( __dirname, 'Public' )));


var wss = new WebSocketServer({port: app.get( 'websocket_port' )});

// development only
if ( 'development' == app.get( 'env' )) {
    app.use( express.errorHandler());
}
 
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
        ws.send('something ' + cnt);
        cnt++;
    });

    ws.on('close', function close() {
        console.log('disconnected');
    });

});

http.createServer( app ).listen( app.get( 'port' ), function(){
    console.log( 'Express server listening on port ' + app.get( 'port' ));
    console.log( 'Websocket server listening on port ' + app.get( 'websocket_port' ));
} );
