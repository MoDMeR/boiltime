function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "./welcome.html"});
}
install_notice();

function playSound() {
    ion.sound({
        sounds: [
            {name: "kitchenTimer"}
        ],
        path: "../../sound/",
        preload: true,
        volume: 1.0
    });

    ion.sound.play("kitchenTimer",{
        loop: 2
    });
}

function startTimer() {
    timer = new Timer();
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        timer.start({countdown: true, startValues: {seconds: request.time}});
        timer.addEventListener('targetAchieved', function (e) {
            playSound();
            var startNotif = new Notification("Время прошло", {
			    tag : "start-alarm",
			    body : "Уже пора снимать с плиты!",
			    icon : "/img/icons/128.png"
			});
            startNotif.close();
            timer.stop();
        });
    });
}
startTimer();