// animation

var timerlen = 5;
var slideAniLen = 250;

var timerID = new Array();
var startTime = new Array();
var obj = new Array();
var endHeight = new Array();
var moving = new Array();
var dir = new Array();

function slidedown(objname, isReverse) {
    if (moving[objname])
        return;

    if (isReverse) {
        if (document.getElementById(objname).style.display == "none")
            return; // cannot slide down something that is already hidden

        dir[objname] = "downrev";
    }
    else {
        if (document.getElementById(objname).style.display != "none")
            return; // cannot slide down something that is already visible

        dir[objname] = "down";
    }

    moving[objname] = true;
    startslide(objname);
}

function slideup(objname, isReverse) {
    if (moving[objname])
        return;

    if (isReverse) {
        if (document.getElementById(objname).style.display != "none")
            return; // cannot slide up something that is already visible

        dir[objname] = "uprev";
    }
    else {
        if (document.getElementById(objname).style.display == "none")
            return; // cannot slide up something that is already hidden

        dir[objname] = "up";
    }

    moving[objname] = true;
    startslide(objname);
}

function startslide(objname) {
    obj[objname] = document.getElementById(objname);

    /*    if (dynamicHeight)
    endHeight[objname] = getDynamicHeight(objname);
    else*/
    endHeight[objname] = parseInt(obj[objname].style.height.replace("px", ""));

    startTime[objname] = (new Date()).getTime();

    if (dir[objname] == "down") {
        obj[objname].style.height = "10px";
    }
    else if (dir[objname] == "uprev") {
        obj[objname].style.height = "1px";
        obj[objname].style.marginTop = -50 - parseInt(obj[objname].style.height.replace("px", "")) + "px";
    }
    //obj[objname].style.display = "block";
    obj[objname].style.display = "inline-block";

    timerID[objname] = setInterval('slidetick(\'' + objname + '\');', timerlen);
}

function slidetick(objname) {
    var elapsed = (new Date()).getTime() - startTime[objname];

    if (elapsed > slideAniLen)
        endSlide(objname)
    else {
        var d = Math.round(elapsed / slideAniLen * endHeight[objname]);
        if (dir[objname] == "up")
            d = endHeight[objname] - d;
        else if (dir[objname] == "uprev") {
            obj[objname].style.marginTop = -20 - d + "px";
        }

        obj[objname].style.height = d + "px";
    }

    return;
}

function endSlide(objname) {
    clearInterval(timerID[objname]);

    if (dir[objname] == "up")
        obj[objname].style.display = "none";
    else if (dir[objname] == "downrev")
        obj[objname].style.display = "none";

    obj[objname].style.height = endHeight[objname] + "px";

    delete (moving[objname]);
    delete (timerID[objname]);
    delete (startTime[objname]);
    delete (endHeight[objname]);
    delete (obj[objname]);
    delete (dir[objname]);

    return;
}

var endHeightDynamic;

function getDynamicHeight(objname) {
    return document.getElementById(objname).scrollHeight;
}

