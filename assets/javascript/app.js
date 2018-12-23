var numberOfPlayers=0;
var config = {
    apiKey: "AIzaSyCxoz8glnJARfZJS7z7Zrnd8TJXos-Gqa4",
    authDomain: "rps-multiplayer-19445.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-19445.firebaseio.com",
    projectId: "rps-multiplayer-19445",
    storageBucket: "",
    messagingSenderId: "933782108610"
};
firebase.initializeApp(config);
var database = firebase.database();

database.ref().on("value", function(snapshot) {
    if(snapshot.val()==null){
        firebase.database().ref('chat/').set({
            chatRoom: ""
        });
    }
    if(snapshot.hasChild("players")==false){
        if(sessionStorage.getItem("username")==null&&numberOfPlayers==0)
        {
            var player = prompt("Please enter your name", "");
            sessionStorage.clear();
            sessionStorage.setItem("username", player);
            sessionStorage.setItem("chatname", player);
            writeUserData(player, "0", "0", "");
        }
    }
    else{
        if(snapshot.hasChild("players")){
            numberOfPlayers = Object.keys(snapshot.val().players).length;
        }
        if(snapshot.hasChild("chat")==true)
        {
            $("#chat-room").html(snapshot.val().chat.chatRoom);
        }
        if(sessionStorage.getItem("username")==null&&numberOfPlayers==1)
        {
            var player = prompt("Please enter your name", "");
            sessionStorage.clear();
            sessionStorage.setItem("username", player);
            sessionStorage.setItem("chatname", player);
            writeUserData(player, "0", "0", "");
        }
        //TODO player.username is undefined for some reason. maybe timeout is needed? 
        for(var i=0; i<numberOfPlayers; i++){
            var player = snapshot.val().players[Object.keys(snapshot.val().players)[i]];
            $("#player"+(i+1)+"-name").text(player.username + "\n Wins: " +player.wins + " Losses: "+ player.losses);
            $("#player"+(i+1)+"-name").html($("#player"+(i+1)+"-name").html().replace(/\n/g,'<br/>'));
        }
        if(numberOfPlayers==2 && sessionStorage.getItem("chatname")==null){
            var chatPlayer = prompt("Please enter your name for the chat", "");
            sessionStorage.clear();
            sessionStorage.setItem("chatname", chatPlayer);
        }
        //there are two players so get player/opponent and start game.
        if(numberOfPlayers==2){
            var currentPlayerName = sessionStorage.getItem("username");
            var player;
            var opponent;
            if(snapshot.val().players[Object.keys(snapshot.val().players)[0]]!=currentPlayerName){
                opponent = snapshot.val().players[Object.keys(snapshot.val().players)[0]];
                player = snapshot.val().players[Object.keys(snapshot.val().players)[1]];
            }
            else{
                opponent = snapshot.val().players[Object.keys(snapshot.val().players)[1]];
                player = snapshot.val().players[Object.keys(snapshot.val().players)[0]];
            }

            //both players have a choice. hide stuff and win check, update photos
            if((player.playerChoice!=""&&opponent.playerChoice!="")){	
                $("#game-stats").show();  
                $("#rock").hide();  
                $("#paper").hide();  
                $("#scissors").hide();  
                
                choiceTranslation
                // $("#game-stats").text(snapshot.val().players[Object.keys(snapshot.val().players)[0]].username + " used " + snapshot.val().players[Object.keys(snapshot.val().players)[0]].playerChoice + " and " + snapshot.val().players[Object.keys(snapshot.val().players)[1]].username + " used " + snapshot.val().players[Object.keys(snapshot.val().players)[1]].playerChoice+". ");
                $("#game-stats").text(snapshot.val().players[Object.keys(snapshot.val().players)[0]].username + " used " + choiceTranslation(snapshot.val().players[Object.keys(snapshot.val().players)[0]].playerChoice) + " and " + snapshot.val().players[Object.keys(snapshot.val().players)[1]].username + " used " + choiceTranslation(snapshot.val().players[Object.keys(snapshot.val().players)[1]].playerChoice)+". ");

                //set photo after both have picked
                setTimeout( function timer(){
                    if(snapshot.val().players[Object.keys(snapshot.val().players)[0]].username==currentPlayerName){
                        var image1 = snapshot.val().players[Object.keys(snapshot.val().players)[0]].playerChoice+".png";
                        var image2 = snapshot.val().players[Object.keys(snapshot.val().players)[1]].playerChoice+".png";
                        $("#player1choice").attr("src", image1);
                        $("#player1choice").remove();
                        $("#player2choice").remove();
                        $("#player1-name").append("<img src='assets/images/"+image1+"' id='player1choice' alt='player1' height='150' width='150'>");
                        $("#player2-name").append("<img src='assets/images/"+image2+"' id='player2choice' alt='player2' height='150' width='150'>");

                    }
                    else{
                        var image1 = snapshot.val().players[Object.keys(snapshot.val().players)[0]].playerChoice+".png";
                        var image2 = snapshot.val().players[Object.keys(snapshot.val().players)[1]].playerChoice+".png";
                        $("#player2choice").attr("src", image2);
                        $("#player1choice").remove();
                        $("#player2choice").remove();
                        $("#player1-name").append("<img src='assets/images/"+image1+"' id='player1choice' alt='player1' height='150' width='150'>");
                        $("#player2-name").append("<img src='assets/images/"+image2+"' id='player2choice' alt='player1' height='150' width='150'>");
                    }
                }, 5 );

                //Win checking
                if(player.playerChoice===opponent.playerChoice){
                    winLoss(player, opponent, "tie");
                    $("#game-stats").append("<br/>"+" It was a tie.");
                }
                else if(player.playerChoice=="rock"){
                    if(opponent.playerChoice=="scissors"){
                        winLoss(player, opponent, "won");
                        $("#game-stats").append("<br/>"+player.username + " won that round.");
                    }
                    else{
                        winLoss(player, opponent, "lost");
                        $("#game-stats").append("<br/>"+opponent.username + " won that round.");
                    }
                }
                else if(player.playerChoice=="scissors"){
                    if(opponent.playerChoice=="rock"){
                        winLoss(player, opponent, "lost");
                        $("#game-stats").append("<br/>"+opponent.username + " won that round.");
                    }
                    else{
                        winLoss(player, opponent, "won");
                        $("#game-stats").append("<br/>"+player.username + " won that round.");
                    }
                }
                else if(player.playerChoice=="paper"){
                    if(opponent.playerChoice=="scissors"){
                        winLoss(player, opponent, "lost");
                        $("#game-stats").append("<br/>"+opponent.username + " won that round.");
                    }
                    else{
                        winLoss(player, opponent, "won");
                        $("#game-stats").append("<br/>"+player.username + " won that round.");
                    }
                }
                else{
                    
                }
            }
        }
    }
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});


function choiceTranslation(str1){
    if(str1=="rock"){
        return "Atari";
    }
    else if(str1=="paper"){
        return "Wallace";
    }
    else{
        return "Tyrell";
    }
}

//write to firebase wins/losses
function winLoss(player, opponent, outcome){
    setTimeout( function timer(){
        if(outcome=="won"){
            writeUserData(player.username, parseInt(player.wins)+1, player.losses, "");
            writeUserData(opponent.username, opponent.wins, parseInt(opponent.losses)+1, "");
        }
        else if (outcome=="lost"){
            writeUserData(player.username, player.wins, parseInt(player.losses)+1, "");
            writeUserData(opponent.username, parseInt(opponent.wins)+1, opponent.losses, "");
        }
        else{
            writeUserData(player.username, player.wins, player.losses, "");
            writeUserData(opponent.username, opponent.wins, opponent.losses, "");
        }
        $("#game-stats").hide();
        $("#rock").show();  
        $("#paper").show();  
        $("#scissors").show();
    }, 7000 );
}

//pad the chat time
function pad(n) {
    return n<10 ? '0'+n : n;
}

$(window).on("unload", function(e) {
    event.preventDefault();
    if(sessionStorage.getItem("username")!=null){
        var dt = new Date();
        var theTime = "("+pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + ":" + pad(dt.getSeconds())+")";
        $("#chat-room").prepend("<p>"+sessionStorage.getItem("username") +" "+ theTime +": " +"Goodbye!" +"</p>");
        firebase.database().ref('chat/').set({
            chatRoom: $("#chat-room").html()
        });
        $("#chatComment").val("");
        firebase.database().ref('players/' + sessionStorage.getItem("username")).remove();
        numberOfPlayers--;
    }
    if(numberOfPlayers<=1){
        $("#chat-room").empty();
        firebase.database().ref('chat/').set({
            chatRoom: $("#chat-room").html()
        });
        $("#chatComment").val("");
    }
});
$("#rock").on("click", function(event) {
    if(sessionStorage.getItem("username")!=null){
        database.ref("players/"+sessionStorage.getItem("username")+"/playerChoice").set($(this).attr('id'));
        if($("#player1-name:contains('"+sessionStorage.getItem("username")+"')").length)
        {
            if(typeof $("#player1choice").attr("src") === "undefined"){
                $("#player1-name").append("<img src='assets/images/rock.png' id='player1choice' alt='rock' height='150' width='150'>");
            }
        }
        else{
            if(typeof $("#player2choice").attr("src") === "undefined"){
                $("#player2-name").append("<img src='assets/images/rock.png' id='player2choice' alt='rock' height='150' width='150'>");
            }
        }
    }
});
$("#paper").on("click", function(event) {
    if(sessionStorage.getItem("username")!=null){
        database.ref("players/"+sessionStorage.getItem("username")+"/playerChoice").set($(this).attr('id'));
        if($("#player1-name:contains('"+sessionStorage.getItem("username")+"')").length)
        {
            if(typeof $("#player1choice").attr("src") === "undefined"){
                $("#player1-name").append("<img src='assets/images/paper.png' id='player1choice' alt='paper' height='150' width='150'>");
            }
        }
        else{
            if(typeof $("#player2choice").attr("src") === "undefined"){
                $("#player2-name").append("<img src='assets/images/paper.png' id='player2choice' alt='paper' height='150' width='150'>");
            }
        }
    }
});
$("#scissors").on("click", function(event) {
    if(sessionStorage.getItem("username")!=null){
        database.ref("players/"+sessionStorage.getItem("username")+"/playerChoice").set($(this).attr('id'));
        if($("#player1-name:contains('"+sessionStorage.getItem("username")+"')").length)
        {
            if(typeof $("#player1choice").attr("src") === "undefined"){
                $("#player1-name").append("<img src='assets/images/scissors.png' id='player1choice' alt='scissors' height='150' width='150'>");
            }
        }
        else{
            if(typeof $("#player2choice").attr("src") === "undefined"){
                $("#player2-name").append("<img src='assets/images/scissors.png' id='player2choice' alt='scissors' height='150' width='150'>");
            }
        }
    }        
});
$("#submit").on("click", function(event) {
    event.preventDefault();
    if(sessionStorage.getItem("username")!=null||sessionStorage.getItem("chatname")!="null"){
        var dt = new Date();
        var theTime = "("+pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + ":" + pad(dt.getSeconds())+")";
        $("#chat-room").prepend("<p>"+sessionStorage.getItem("chatname") +" "+ theTime +": " + $("#chatComment").val().trim()+"</p>");
        firebase.database().ref('chat/').set({
            chatRoom: $("#chat-room").html()
        });
        $("#chatComment").val("");
    }
});

$("#quit-button").on("click", function(event) {
    event.preventDefault();
    if(sessionStorage.getItem("username")!=null){
        var dt = new Date();
        var theTime = "("+pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + ":" + pad(dt.getSeconds())+")";
        $("#chat-room").prepend("<p>"+sessionStorage.getItem("username") +" "+ theTime +": " +"Goodbye!" +"</p>");
        firebase.database().ref('chat/').set({
            chatRoom: $("#chat-room").html()
        });
        $("#chatComment").val("");
        firebase.database().ref('players/' + sessionStorage.getItem("username")).remove();
        numberOfPlayers--;
    }
    if(numberOfPlayers<=1){
        $("#chat-room").empty();
        firebase.database().ref('chat/').set({
            chatRoom: $("#chat-room").html()
        });
        $("#chatComment").val("");
    }
    window.close();
});

function writeUserData(name, wins, losses, playerChoice) {
    firebase.database().ref('players/' + name).set({
        username: name,
        wins: wins,
        losses : losses,
        playerChoice: playerChoice
    });
}