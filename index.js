var irc = require('irc');
var client = new irc.Client('irc.mozilla.org', 'hugbot', {
    channels: ['#amo', '#webdev', '#interns', '#remora', '#breakpad', '#amo-editors', '#'],
});

huggable = {};
hugdelay = {};

function contains(message, list) {
    for(var i=0;i<list.length;i++) {
        var l = list[i];
        if(message.indexOf(l) > -1)
            return true;
    }
}

var cvancounter = 0;
setInterval(function() {cvancounter = Math.max(0, cvancounter - 1);}, 5000);

var hugs = [
    ">--:)--<",
    ">--☺--<",
    ">--(｡◕‿‿◕｡)--<",
    "(づ￣ ³￣)づ",
    "(づ｡◕‿‿◕｡)づ"
];

client.addListener('message', function(from, to, message) {

    if(from == "cvan" || from == "cvane" || from == "i_am_cvan") {
        cvancounter++;
        if(cvancounter == 5) {
            cvancounter = -1;
            console.log(">> cvan is being noisy.");
            client.say(to, "omg " + from + ", quit yer yammerin'");
        }
    } else {cvancounter = 0;}

    if(contains(message, [":(", ":-(", ":'(", ":'-(", "QQ", ":C", "T_T", "):", ")-:", ")':", ")-':", "Something terrible happened"])) {
        if(hugdelay[from])
            return;
        hugdelay[from] = true;
        setTimeout(function() {delete hugdelay[from];}, 1000 * 60 * 60);

        console.log(from + ": " + message);
        if(from == "cvan" || from == "cvane")
            client.say(to, "man up, " + from);
        else
            client.say(to, "(" +from + ")");

    } else if (contains(message.toLowerCase(),
                        ["hate this", " sad", "sad ", "i need a hug",
                         "i'm sad", "fml", "this is crap",
                         "i need a drink"])) {

        if(hugdelay[from])
            return;

        huggable[from] = true;
        console.log(from + ": " + "Needs a hug >> " + message);
        client.say(to, from + ": need a hug, bro?");

    } else if (message.substr(0, 7) == "hugbot:") {
        tlm = message.toLowerCase();
        if(tlm.indexOf("botsnack") > -1) {
            // Botsnack!
            client.say(to, from + ": *BURP*");
        } else if(contains(tlm, ["yes", "yup", "yeah", "yep", "i do", "sure", "hit me up", "go for it", "please"]) &&
               from in huggable) { // Offer hugs!
            delete huggable[from];
            if (from === "cvan")
                client.say(to, from + ": what else is new");
            else {
                var hug = hugs[(Math.random() * hugs.length)|0];
                client.say(to, from + ": " + hug);
            }
        } else if(contains(tlm, ["o/"])) {
            client.say(to, from + ": \\o");
        } else if(contains(tlm, ["\\o"])) {
            client.say(to, from + ": o/");
        }
    }

});
