// drag resizer 
// http://www.pagecolumn.com/javascript/drag_resize.htm
//

function resize_addEvent(obj, type, fn) {
    if (obj.attachEvent) {
        obj["e" + type + fn] = fn;
        obj[type + fn] = function () { obj["e" + type + fn](window.event); }
        obj.attachEvent("on" + type, obj[type + fn]);
    } else
        obj.addEventListener(type, fn, false);
}

function resize_removeEvent(obj, type, fn) {
    if (obj.detachEvent) {
        obj.detachEvent("on" + type, obj[type + fn]);
        obj[type + fn] = null;
    } else
        obj.removeEventListener(type, fn, false);
}

Function.prototype.bind = function (obj) {
    var _method = this;
    return function () {
        return _method.apply(obj, arguments);
    };
}

function resize_drag(id, glassPane) {
    this.id = id;
    this.direction = "y";
    this.glassPane = glassPane;
}

resize_drag.prototype = {

    init: function (settings) {

        for (var i in settings) {

            this[i] = settings[i];

            for (var j in settings[i]) {
                //if (typeof(this[i][j])=="undefined")
                this[i][j] = settings[i][j];
            }
        }

        this.elem = (this.id.tagName == undefined) ? document.getElementById(this.id) : this.id;
        this.container = this.elem.parentNode;
        this.elem.onmousedown = this._mouseDown.bind(this);

        // BL
        this.scrollOffset = 0;
        this.overY = false;
    },

    _mouseDown: function (e) {
        e = e || window.event;

        this.elem.onselectstart = function () { return false };

        this._event_docMouseMove = this._docMouseMove.bind(this);
        this._event_docMouseUp = this._docMouseUp.bind(this);

        if (this.onstart) this.onstart();
        this.x = e.clientX || e.PageX;
        this.y = e.clientY || e.PageY;

        this.left = parseInt(resize_getstyle(this.elem, "left"));
        this.top = parseInt(resize_getstyle(this.elem, "top"));

        resize_addEvent(document, 'mousemove', this._event_docMouseMove);
        resize_addEvent(document, 'mouseup', this._event_docMouseUp);

        return false;
    },
    _docMouseMove: function (e) {

        this.setValuesClick(e);
        if (this.ondrag) this.ondrag();

        this.glassPane.style.display = "block";
    },

    _docMouseUp: function (e) {
        resize_removeEvent(document, 'mousemove', this._event_docMouseMove);
        if (this.onstop) this.onstop();

        var scrollOffset = this.container.pageYOffset ? this.container.pageYOffset : this.container.scrollTop;
        this.updatePosition(scrollOffset);

        resize_removeEvent(document, 'mouseup', this._event_docMouseUp);
        this.glassPane.style.display = "none";
    },

    setValuesClick: function (e) {
        this.mouseX = e.clientX || e.PageX;
        this.mouseY = e.clientY || e.pageY;

        this.Y = this.top + this.mouseY - this.y;

        this.Y = resize_limit(this.Y, this.limit.y[0], this.limit.y[1]);

        var oldHeight = parseInt(this.container.style.height.replace("px", ""));

        if (!this.startHeight)
            this.startHeight = oldHeight;

        if (this.Y < this.top + this.mouseY - this.y) {
            var startY = this.Y + 15;
            this.elem.style.top = startY + "px";

            this.Y = resize_limit((this.top + this.mouseY - this.y - this.scrollOffset), this.limit.y[0], this.limit.y[1]);

            this.container.style.height = this.Y + "px";

        }
        else if (this.Y - this.scrollOffset >= this.limit.y[0]) {
            this.elem.style.top = this.Y + 15 + "px";

            /*            if (this.direction == "xy") {
            this.X = this.left + this.mouseX - this.x;
            this.X = resize_limit(this.X, this.limit.x[0], this.limit.x[1]);
            this.elem.style.left = this.X + "px";
            this.container.style.width = (this.X + 16) + "px";
            this.container.style.height = (this.Y + 16) + "px";
            }
            else */

            this.container.style.height = this.Y - this.scrollOffset + "px";
        }
    },

    updatePosition: function (scrollOffset) {
        this.top = parseInt(resize_getstyle(this.elem, "top"));
        this.elem.style.top = this.top - this.scrollOffset + scrollOffset + "px";

        this.scrollOffset = scrollOffset;
    }
}

function resize_limit(val, mn, mx) {
    return Math.min(Math.max(val, Math.min(mn, mx)), Math.max(mn, mx));
}

function resize_getstyle(elem, prop) {
    if (document.defaultView) {
        return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
    }
    else if (elem.currentStyle) {
        var prop = prop.replace(/-(\w)/gi, function ($0, $1) {
            //return $0.charAt($0.length - 1).toUpperCase();
            return $1.toUpperCase();
        });
        return elem.currentStyle[prop];
    }
    else return null;
}
