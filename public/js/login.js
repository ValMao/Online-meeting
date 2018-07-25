/*--- Facebook oAuth ---*/
/*--- login with facebook ---*/
window.fbAsyncInit = function () {
    FB.init({
        appId: '183446822293152',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });

    FB.getLoginStatus(function (response) {
        fbStatusChangeCallback(response);
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.12&appId=183446822293152&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function fbStatusChangeCallback(response) {
    if (response.status === 'connected') {
        fbGetUserName(response.authResponse);
        
        console.log('Logged in and authenticated');
    } else {
        console.log('Not authenticated');
    }
}

function fbCheckLoginState() {
    FB.getLoginStatus(function (response) {
        fbStatusChangeCallback(response);
    });
}

function fbGetUserName(response) {
    var name = "";
    FB.api(
        '/' + response.userID,
        'GET',
        {},
        function (data) {
            name = data.name;
            console.log(data.name);
            // if ($('#user-name'))
            // {
            //     $('#user-name').text(name.split(" ")[0]);
            //     $.cookie('user', name);
            // }
            if (location.pathname.substr(1) == "" || location.pathname.substr(1) == "login") {
                $.cookie('user', name);
                window.location.replace("https://localhost:4000/conference-room/");
            }
                
        }
    );
    return name;
}

/*--- logout with facebook ---*/
function fbLogout() {
    FB.logout(function (response) {
        console.log('logged out');
        
    });
}
/*--- Facebook oAuth End ---*/

/*--- Google oAuth ---*/
/*--- login with google ---*/
var googleUser = {};
function googleLoginInit() {
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '117207114403-dhtkdtjasg9082s4t73hpr2rvd32com7.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
        });
        googleLogin(document.getElementById('google-login-button'));
    });

};

function googleLogin(element) {
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            $.cookie('user', googleUser.getBasicProfile().getName());
            window.location.replace("https://localhost:4000/conference-room/");
        }, function (error) {

        });
}
/*--- logout with google ---*/
function googleLogout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('Google Logged out :)');
        //window.location.replace("https://localhost:4000/");
    })
}
/*--- Google oAuth End ---*/

/*---- Twitter oAuth ---*/
/*--- login with twitter ---*/
var twitterConfig = {
    apiKey: "AIzaSyA4TgandPr6QT8W3hv9dSaj6vY-RfkCuZs",
    authDomain: "conference-room-200902.firebaseapp.com",
    databaseURL: "https://conference-room-200902.firebaseio.com",
    projectId: "conference-room-200902",
    storageBucket: "conference-room-200902.appspot.com",
    messagingSenderId: "117207114403"
};
firebase.initializeApp(twitterConfig);

var twitterProvider = new firebase.auth.TwitterAuthProvider();

function twitterLogin() {
    firebase.auth().signInWithPopup(twitterProvider).then(function (result) {
        var token = result.credential.accessToken;
        var secret = result.credential.secret;
        var user = result.user;
        $.cookie('user', user.displayName);
        console.log(token);
        console.log(secret);
        console.log(user);
        window.location.replace("https://localhost:4000/conference-room/");
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}
/*--- logout with twitter ---*/
function twitterLogout() {
    firebase.auth().signOut().then(function () {
        console.log('twitter logged out');
        //window.location.replace("https://localhost:4000/");
    }).catch(function (error) {
        console.log('twitter logged out error');
    });
}
/*---- Twitter oAuth End ---*/

/*--- Init ---*/
function initLoginPage() {
    if (location.pathname.substr(1).indexOf("login") != -1)
        window.location.replace("https://localhost:4000/");

    var timer = setInterval(function () {
        //check facebook button finished loading
        if (jQuery('iframe .uiGrid ._5h0o')) {
            clearInterval(timer);
            jQuery('#login-loading').fadeOut();
        }
    }, 2500);

    /*--- init google ---*/
    /*--- only google oAuth needs init---*/
    googleLoginInit();

    if (!location.pathname.includes('conference-room'))
        if($.cookie('user'))
        {
            window.location.replace("https://localhost:4000/conference-room");
        }
            
}
jQuery(document).ready(function () {
    initLoginPage();
});

/*--- Logout All---*/
function logoutAll() {
    if ($.cookie('user')){
        $.removeCookie('user', { path: '/' });
        $.removeCookie('user', { path: '/conference-room' });
    }
        
    try {
        fbLogout();
        googleLogout();
        twitterLogout();
        window.location.replace("https://localhost:4000/");
    }
    catch (err) {
        console.log(err.message);
    }

    return $.cookie('user');
}