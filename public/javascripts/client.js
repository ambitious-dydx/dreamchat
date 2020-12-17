var chatInfra=io.connect('/chat_infra'),
    chatCom=io.connect('/chat_com');

var roomName = decodeURI((RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search)|| [, null])[1]);

if(roomName){
    chatInfra.emit('join_room', { name :roomName});

    chatInfra.emit("user_nickname", "Testing_username");

    chatInfra.on('name_set', (data)=>{
        $('#nameform').hide();
        $('#messages').append('<div class="systemMessage">'+'Hello '+data.name+'</div>');
    });
    chatInfra.on("user_entered", (user)=>{
        $('#messages').append('<div class="systemMessage">' +user.name + ' has joined the room.' + '</div>');
    });
    
    chatInfra.on('message', (message)=>{
        var message = JSON.parse(message);
    $('#messages').append('<div class="' + message.type + '">'+message.message + '</div>');
    });
    
    chatCom.on('message', (message)=>{
        var message = JSON.parse(message);
        $('#messages').append('<div class="' + message.type + '"><span class="name">' +message.username + ':</span> ' +message.message + '</div>');
    });
    
};

$(function(){
    $('#send').click(function(){
        var data={
            type: 'userMessage',
            message: $('#message').val()
        };
        chatCom.send(JSON.stringify(data));
        $('#message').val('');
    });
});

$(function(){
    $('#login a').click(function(){
        console.log("Hiiiiiii");
        chatInfra.nickname=$('#nickname').val()
        console.log(data);
    });

    $('#messages').animate({
        scrollTop: $('#messages').prop("scrollHeight")}, 0);
});
