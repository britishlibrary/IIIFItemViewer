// Code taken from http://www.switchonthecode.com/tutorials/javascript-tutorial-simple-fade-animation

var TimeToFade = 1000.0;

function fade(eid) {
    var element = document.getElementById(eid);
    if (element == null)
        return;

    if (element.FadeState == null) {
        if (element.style.opacity == null
        || element.style.opacity == ''
        || element.style.opacity == '1') {
            element.FadeState = 2;
        }
        else {
            element.FadeState = -2;
        }
    }

    if (element.FadeState == 1 || element.FadeState == -1) {
        element.FadeState = element.FadeState == 1 ? -1 : 1;
        element.FadeTimeLeft = TimeToFade - element.FadeTimeLeft;
    }
    else {
        element.FadeState = element.FadeState == 2 ? -1 : 1;
        element.FadeTimeLeft = TimeToFade;
        setTimeout("viewerAnimateFade(" + new Date().getTime() + ",'" + eid + "')", 33);
    }
}

function viewerAnimateFade(lastTick, eid) {
    var curTick = new Date().getTime();
    var elapsedTicks = curTick - lastTick;

    var element = document.getElementById(eid);

    if (element.FadeTimeLeft <= elapsedTicks) {
        //        element.style.opacity = element.FadeState == 1 ? '1' : '0';
        //element.style.filter = 'alpha(opacity = ' + (element.FadeState == 1 ? '100' : '0') + ')';
        //element.FadeState = element.FadeState == 1 ? 2 : -2;
        //        element.style.display = "none";
        element.style.opacity = '0';
        element.style.filter = 'alpha(opacity = ' + '0' + ')';
        element.FadeState = -2;
        return;
    }

    element.FadeTimeLeft -= elapsedTicks;
    var newOpVal = element.FadeTimeLeft / TimeToFade;
    // always fade
    //    if (element.FadeState == 1)
    //        newOpVal = 1 - newOpVal;

    element.style.opacity = newOpVal;
    element.style.filter = 'alpha(opacity = ' + (newOpVal * 100) + ')';

    setTimeout("viewerAnimateFade(" + curTick + ",'" + eid + "')", 33);
}