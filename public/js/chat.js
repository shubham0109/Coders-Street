var socket = io();

function scrollToBottom (){
    var message = $('#messages');
    var newMessage = message.children('li:last-child');

    var clientHeight = message.prop('clientHeight');
    var scrollTop = message.prop('scrollTop');
    var scrollHeight = message.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + lastMessageHeight + newMessageHeight >= scrollHeight){
        message.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() { 
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if (err){
            alert("Enter valid name and room");
            window.location.href = '/';
        }else {
            console.log("correct");
        }
    });
});

socket.on('disconnect', function() {
    console.log("disconnected");
});

socket.on('userUpdate', function(userList){
    console.log('users: ' + userList);
    var ul = $('<ul></ul>');
    userList.forEach(function (user){
        ul.append($('<li></li>').text(user));
    }); 
    $('#users').html(ul);
});

socket.on('newMsg', function(data) {
    console.log(data);
    var time = moment(data.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var rendered = Mustache.render(template, {
        from : data.from,
        text : data.text,
        createdAt : time
    });
    $('#messages').append(rendered);
    scrollToBottom();
});

$('document').ready(function(){

    $('form').submit(function(e){
        e.preventDefault();
        socket.emit('createMsg', {
            from : "User",
            text : $('input').val()
        }, function(){
            $('input').val('');
        });
    });
});


