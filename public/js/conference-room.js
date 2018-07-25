var connection = new RTCMultiConnection();

var roomId = document.getElementById('room-id');
roomId.value = connection.token();

connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

//get local video & audio
connection.session = {
    audio: true,
    video: true
}
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

//append video to containers
var localVideoContainer = document.getElementById('local-video-container');
var remoteVideosContainer = document.getElementById('remote-videos-container');

connection.onstream = function (event) {
    var video = event.mediaElement;
    if (event.type === 'local')
        localVideoContainer.appendChild(video);
    if (event.type === 'remote')
        remoteVideosContainer.appendChild(video);
    video.play();


    
}

connection.onstreamended = connection.onleave = connection.onclose = function (event) {
    var video = document.getElementById(event.streamid);
    if (!video) return;
    video.parentNode.removeChild(video);
};

/*handle room full
allow 4 user (1 initiator + 3 remote participants)*/
connection.maxParticipantsAllowed = 3;
connection.onRoomFull = function () {
    alert("This Room is Full");
    window.location.reload();
    return;
}

/*----join a new room. if the room is not existing, then create new one----*/
$('#btn-join').click(function () {
    connection.connectionDescription = connection.openOrJoin(roomId.value || 'default-room-id');
    document.getElementById('profile').append("Room ID: " + roomId.value);
    $('#room-section').fadeOut();
    $("#local-video-container").show();
    loadingEffect();
    timer();
    buttonHoverEffect();
    $('.face-masking-icons').show();
    console.log(connection.connectionDescription);
});

function checkRoomExisting() {
    let exist = false;
    connection.checkPresence(roomId.value, (isRoomExists, roomid) => {
        if (isRoomExists) {
            console.log('exist');
            exist = true;
        }
        else {
            console.log('not exist');
            exist = false;
        }
    });
    return exist;
}

/*--- leave and rejoin a room ---*/
connection.autoCloseEntireSession = false;

//effect for loading page
function loadingEffect() {
    jQuery('#loading').show();
    setTimeout(function () { jQuery('#loading').fadeOut(200); }, 2000);
};

//effects for video button 
function buttonHoverEffect() {
    $(".video-buttons").on("mouseenter", function () {
        $(".btn-group-options").fadeIn("200");
    });
    $(".video-buttons").on("mouseleave", function () {
        $(".btn-group-options").fadeOut("200");
    });
};

//effects for face maksing icons
$(".face-masking-icons").on("mouseenter", function () {
    $(".face-masking-icon").toggle( "slide" );
});
$(".face-masking-icons").on("mouseleave", function () {
    $(".face-masking-icon").toggle("right");
});

let trumpInited, trumpClicked = false;
$('.face-masking-icon').click(()=>{
    console.log('trump clicked');
    
    if(trumpInited && trumpClicked)
    {
        console.log('trump down');
        $('#_imageData, #mask').hide();
    }
    else if(trumpInited && !trumpClicked){
        console.log('trump on');
        $('#_imageData, #mask').show();
    }

    if(!trumpInited && !trumpClicked){
        console.log('trump on');
        initFaceMasking();
        trumpInited = true;
        setTimeout(()=>$('#_imageData, #mask').show(), 3000);
    }

    trumpClicked = !trumpClicked;
})



//video timer init
function timer() {
    $('#timer').timer({
        format: '%H:%M:%S'
    });
}

//convert seconds to minutes
function secondsToHms(time) {
    time = Number(time);
    var h = Math.floor(time / 3600);
    var m = Math.floor(time % 3600 / 60);
    var s = Math.floor(time % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

//enable tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

/*--- Conference Room init ---*/
function initConferenceRoomPage() {
    //login check
    if (!$.cookie('user')) {
        window.location.replace("https://localhost:4000/");
    }
    else {
        $('#init-loading').hide();
        if($.cookie('user') != "")
            $('#user-name').text($.cookie('user').split(" ")[0]);
    }
}


$(document).ready(function () {
    /*--- init ----*/
    initConferenceRoomPage();
});

/*--- side bar buttons functions --*/
//unable local video, other people would not be able to see you
$("#btnMuteVideo").click(function () {
    if(trumpInited){
        var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled;
        if (localVideo == true) {
            $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled = false;
        } else {
            $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled = true;
        }
    }
    else
    {
        var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled;
        if (localVideo == true) {
            $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled = false;
        } else {
            $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled = true;
        }
    }
        
});

//unable local audio, pther people would not be able to hear you. Mute both sides when testing
$("#btnMuteAudio").click(function () {
    var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled;
    if (localVideo == true) {
        $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled = false;
    } else {
        $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled = true;
    }
});

$("#btnFullScreen").click(function () {
    var video = $(".full-screen-container").get(0);
    if (video.requestFullScreen) {
        video.requestFullScreen();
    } else if (video.webkitRequestFullScreen) {
        video.webkitRequestFullScreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    };
});

$("#btnHangUp").click(function () {
    if (connection.getAllParticipants().length > 0) {
        $("#local-video-container video").hide();
        $(".video-buttons").hide();
        $("#rejoin").slideDown();
        var videoTime = $('#timer').data("seconds");
        var displayTime = secondsToHms(videoTime);
        $("#videoTime").html("Video time is " + displayTime);
        $('#timer').timer('remove');
        
        connection.checkPresence(connection.sessionid, function (isRoomExist, roomid) {
            if (connection.isInitiator) {
                console.log('You are room owner!');
                if(trumpInited){
                    var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled;
                    if (localVideo == true)
                        $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled = false;
                }
                else{
                    var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled;
                    if (localVideo == true)
                        $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled = false;
                }
                    
                $('#leave-forever').show();
            }
            else {
                connection.leave();
            }
        });


    } else {
        window.location.reload();
    }

    $('#temp-leave').show();
});

$("#leave-forever").click(function () {
    connection.leave();
    window.location.reload();
});


$("#btnRejoin").click(function () {
    console.log("rejoin");
    $("#local-video-container video").show();
    $(".video-buttons").show();
    $("#rejoin").hide();
    timer();
    sessionId = connection.sessionid;
    console.log(sessionId);
    console.log("initiator" + connection.isInitiator);

    if (!connection.isInitiator) {
        connection.connect(sessionId);
    }
    else {
        if(trumpInited){
            var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled;
            if (localVideo == false)
                $("#local-video-container video").get(0).srcObject.getTracks()[0].enabled = true;
        }
        else{
            var localVideo = $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled;
            if (localVideo == false)
                $("#local-video-container video").get(0).srcObject.getTracks()[1].enabled = true;
        }
    }

    $('#temp-leave').fadeOut();
    console.log(connection.getAllParticipants().length);
})
