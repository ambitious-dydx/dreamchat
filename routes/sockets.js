exports.initialize=(io)=>{

    var self=this;
    this.chatInfra=io.of("/chat_infra");
    this.chatCom=io.of("/chat_com");
    self.socket20=null;

    this.chatInfra.on("connection", (socket)=>{
        socket.on("join_room", (room)=>{
            socket.join(room.name);
            var comSocket = self.socket20;
            comSocket.join(room.name);
            comSocket.room = room.name;
            socket.in(room.name).broadcast.emit('user_entered', {'name':"nickname"});
        });

        socket.on("get_rooms", (rooms)=>{
            for(var room in io.sockets.adapter.rooms){
                console.log("room "+room);
                if(room.indexOf("/chat_infra/")==0){
                    var roomName=room.replace("/chat_infra/", "");
                    rooms[roomName]=io.sockets.managerrooms[room].length;
                }
            }
            socket.emit("rooms_list", rooms);
        });

        socket.on("user_nickname", (data)=>{
            socket.nickname=data.nickname;
            socket.emit('name_set', data);
            socket.send(JSON.stringify({
                type : 'serverMessage',
                message : 'Welcome to the most interesting chat on earth!'
            }));
            socket.broadcast.emit('user_entered', data);
        });
    });

    this.chatCom.on("connection", (socket)=>{
        self.socket20=socket;
        self.socket20.on('message', (message)=>{
            message=JSON.parse(message);

            if(message.type=="userMessage"){
                message.username=self.socket20.nickname;
                self.socket20.in(self.socket20.room).broadcast.send(JSON.stringify(message));
                message.type="myMessage";
                self.socket20.send(JSON.stringify(message));
            }
        });

    });

    io.on('disconnect', function(){
        console.log("User is disconnected from the socket!!!");
    });


};