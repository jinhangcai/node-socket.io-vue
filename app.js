var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
app.use('/static', express.static('static/javascript'));
app.use('/css', express.static('static/css'));
app.use('/images', express.static('static/images'));
app.use('/libs', express.static('libs'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


//在线用户
var onlineUsers = {};

var username = [];
//当前在线人数
var onlineCount = 0;
io.sockets.on('connection', function(socket){

    //监听新用户加入
    socket.on('login', function(objs){
        socket.name = objs.userid;
        if (username.indexOf(objs.username) > -1) {
            io.emit('Registered');
            return;
        }else{
            username.push(objs.username)
            socket.userIndex = username.length;
        }
        if(!onlineUsers.hasOwnProperty(objs.userid)) {
            onlineUsers[objs.userid] = objs.username;
            onlineCount++;
        }
        //向当前客户端发送信息登录成功信息 隐藏登录框
        io.emit(objs.userid,  { user:objs});

        //向所有客户端广播用户加入
        io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:objs});

        //接收用户退出信息
        socket.on(objs.userid+'out',function(obj){
                socket.useramount = obj.amount-1;
                socket.username =  obj.name;
                socket.userid = obj.userid;
                //退出并刷新
                io.emit(obj.userid+'out',{amount:socket.useramount,name:socket.username,userid:socket.userid});

        })
    });

    //接收客户端发送的信息
    socket.on('chat message', function(msg,color){
        io.emit('chat message', msg,socket.name,color);
    });

    //监听用户退出
    socket.on('disconnect', function(msg){
        if(onlineUsers.hasOwnProperty(socket.name)) {
            delete onlineUsers[socket.name];
            onlineCount--;
            socket.disconnect();
            io.emit('back',{amount:socket.useramount, name:socket.username,userid:socket.userid});
            username.splice(socket.userIndex-1, 1);
        }
    });

});



http.listen(3000, function(){
    console.log('listening on *:3000');
});
    