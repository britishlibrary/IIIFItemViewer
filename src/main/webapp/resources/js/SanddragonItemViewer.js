/*
*
* Item Viewer controller
*
* Copyright (c) 2012, The British Library Board
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of The British Library nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var screenWidth = 0;
var screenHeight = 0;

function maximiseWindow() {
    top.window.moveTo(0, 0);
    top.window.resizeTo(screen.width, screen.height);

    if (document.all)
    { top.window.resizeTo(screen.availWidth, screen.availHeight); }
    else if (document.layers || document.getElementById) {
        if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
            top.window.outerHeight = top.screen.availHeight;
            top.window.outerWidth = top.screen.availWidth;
        }
    }
}

function setScreenSize(controllerDivId) {
    var verticalMargin = 100;
    var horizontalMargin = 0;

    var controllerDiv = document.getElementById(controllerDivId);
    var controllerHeight = parseInt(controllerDiv.style.height.replace("px", ""));
    var controllerWidth = parseInt(controllerDiv.style.width.replace("px", ""));

    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        screenWidth = window.innerWidth - horizontalMargin;
        screenHeight = window.innerHeight - verticalMargin;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        screenWidth = document.documentElement.clientWidth - horizontalMargin;
        screenHeight = document.documentElement.clientHeight - verticalMargin;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        screenWidth = document.body.clientWidth - horizontalMargin;
        screenHeight = document.body.clientHeight - verticalMargin;
    }

    if (controllerHeight != "" && controllerHeight > 0) {
        screenHeight = controllerHeight;
    }

    if (controllerWidth != "" && controllerWidth > 0) {
        screenWidth = controllerWidth;
    }
}

var SanddragonItemViewer = function (controllerName, controllerDivId, itemId, pageId, viewType, isFullScreen, metadataId, viewingIFrameId) {
    var topDiv = null;
    var bottomDiv = null;
    var controllerDiv = null;
    var viewingIFrame = null;
    var viewingIFrameDiv = null;
    var glassPane = null;
    var metadataDiv = null;
    var index = 0;
    var NumViews = 1;
    var AsBook = true;
    var Item = null;
    var PageList = null;
    var startWidth = 0;
    var iframeMsg = null;

    var PageFirstButton = null;
    var PagePrevButton = null;
    var PageNextButton = null;
    var PageLastButton = null;
    var ViewButton = null;

    var Server = "http://wsw772318/";
    var ViewerServer = Server + "";
    var ImageServer = Server + "";
    var ImageMetadataServer = Server + "";
    var WidgetServer = Server + "";

    this.init = function () {
        if (isFullScreen)
            maximiseWindow();

        if (document.getElementById("itemViewerServer").value != "") {
            Server = document.getElementById("itemViewerServer").value;
        }
        if (document.getElementById("ViewerServer").value != "") {
            ViewerServer = Server + document.getElementById("ViewerServer").value;
        }
        if (document.getElementById("ImageServer").value != "") {
            ImageServer = Server + document.getElementById("ImageServer").value;
        }
        if (document.getElementById("ImageMetadataServer").value != "") {
            ImageMetadataServer = Server + document.getElementById("ImageMetadataServer").value;
        }
        if (document.getElementById("WidgetServer").value != "") {
            WidgetServer = Server + document.getElementById("WidgetServer").value;
        }

        setScreenSize(controllerDivId);

        setupLoadScreen();

        this.setupController(getItemMetadata());
    }

    function getItemMetadata() {
        var metadata = '{"ID":"Genji_monogatari_kotoba","ImageList":[';		
        metadata += '{"PageID":"Or.1287_00","ImageID":"Or.1287_00","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_01","ImageID":"Or.1287_01","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_02","ImageID":"Or.1287_02","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_03","ImageID":"Or.1287_03","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_04","ImageID":"Or.1287_04","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_05","ImageID":"Or.1287_05","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_06","ImageID":"Or.1287_06","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_07","ImageID":"Or.1287_07","RoleType":"Page"}';
        metadata += ',{"PageID":"Or.1287_08","ImageID":"Or.1287_08","RoleType":"Page"}';
        metadata += '],"BookMetadata":{"Shelfmark":" Or.1287", "Artist":"Sumiyoshi Jokei, 1599-1670","Title":"Genji monogatari kotoba","PublicationDetails":"[Publication Details]","[Any other fields]":"[Other fields]"}}';

        return metadata;
    }

    function setupLoadScreen() {
        controllerDiv = document.getElementById(controllerDivId);

        controllerDiv.innerHTML = "<div style='color:white;margin-left:10px;margin-top:10px;'>The British Library itemViewer is preparing your viewing of " + itemId + " ........</div>";
    }

    this.setupController = function (metadata) {
        topDiv = document.createElement("div");
        topDiv.id = "bl_top";

        if (metadata.message != null) {
            controllerDiv.innerHTML = "<div style='color:white;margin-left:10px;margin-top:10px;'>The British Library itemViewer experienced an error in preparing your viewing of " + itemId + ".</div>";
            controllerDiv.innerHTML += "<div style='color:white;margin-left:10px;margin-top:10px;'>We’d really like to have your feedback on the beta service; use the Explore the British Library <a style='color:yellow;' href='http://forms.bl.uk/explore-the-british-library-feedback/'>feedback link</a> and enter comments in the message box provided.</div>";
            controllerDiv.innerHTML += "<div style='color:white;margin-left:10px;margin-top:10px;'>Please include the word ‘itemVIEWER’ with the item number shown above. Thank you.</div>";

            return;
        }

        Item = eval('(' + metadata + ')');

        glassPane = document.createElement("img");

        controllerDiv = document.getElementById(controllerDivId);
        controllerDiv.style.overflow = "hidden";
        controllerDiv.style.position = "relative";
        controllerDiv.innerHTML = "";

        setupBanner(Item);

        controllerDiv.insertBefore(topDiv, controllerDiv.firstChild);

        if (metadata == null) {
            /* <!-- show error message --> */
            var errorMessage = document.createElement("div");
            errorMessage.className = "bl_error";
            errorMessage.innerHTML = "";
            errorMessage.style.top = screenHeight / 2 + "px";
            errorMessage.style.left = screenWidth / 2 - 150 + "px";

            controllerDiv.appendChild(errorMessage);
        }
        else {
            PageList = Item.ImageList;

            bottomDiv = document.createElement("div");
            bottomDiv.id = controllerName + ".bl_bottom";
            bottomDiv.className = "bl_bottom rounded-corners";
            bottomDiv.onmouseover = showNav;
            bottomDiv.onmouseout = hideNav;

            if (viewType == "open") {
                NumViews = 2;
            }

            handleKeyStrokes();

            setupIFrame(true);

            viewingIFrameDiv.appendChild(bottomDiv);

            bottomDiv.style.top = (screenHeight - 130) + "px";

            setupSlider();

            setupNav();

            if (pageId != "") {
                var startIndex = PageList.length;
                while (startIndex-- > 0) {
                    if (PageList[startIndex].PageID === pageId) break;
                }
                index = startIndex;

                setSliderValue(slider1, index + 1);
            }
            else {
                index = 0;

                var startIndex = PageList.length;
                while (startIndex-- > 0) {
                    if (PageList[startIndex].RoleType === "Title") break;
                }
                index = startIndex;
                if (index < 0)
                    index = 0;

                setViews();
            }
        }
    }

    function handleKeyStrokes() {
        document.onkeyup = function (e) {
            var key = null;

            if (e)
                key = e.keyCode;
            else
                key = window.event.keyCode;

            if (key == 37) {    // left
                decSlider();
            }
            if (key == 39) {    // right
                incSlider();
            }
            if (key == 38) {    // up
                firstPage();
            }
            if (key == 40) {    // down
                lastPage();
            }
        }
    }

    var navDiv = null;
    var PrintButton = null;
    var PrintLink = null;
    var DownloadButton = null;
    var DownloadLink = null;

    function setupNav() {
        navDiv = document.createElement("div");
        navDiv.className = "bl_navBar";
        navDiv.style.marginLeft = (screenWidth / 2) - (sliderWidth / 2) - 35 + "px";

        ViewButton = document.createElement("img");

        ViewButton.src = ViewerServer + (viewType === "open" ? "resources/js/images/singleView.png" : "resources/js/images/openView.png");

        var ViewLink = document.createElement("a");
        ViewLink.className = "bl_navButton";
        ViewLink.style.marginRight = "20px";
        ViewLink.onmouseover = function () {
            ViewButton.src = ViewerServer + (viewType === "open" ? "resources/js/images/singleView_over.png" : "resources/js/images/openView_over.png");
            ViewLink.title = viewType === "open" ? 'Single view' : 'Double view';
        };
        ViewLink.onmouseout = function () {
            ViewButton.src = ViewerServer + (viewType === "open" ? "resources/js/images/singleView.png" : "resources/js/images/openView.png");
        };
        ViewLink.onclick = OnViewChange;

        ViewLink.appendChild(ViewButton);
        navDiv.appendChild(ViewLink);

        PagePrevButton = document.createElement("img");
        PagePrevButton.src = ViewerServer + "resources/js/images/doc_prev.png";
        PagePrevButton.onclick = decSlider;

        var PagePrevLink = document.createElement("a");
        PagePrevLink.className = "bl_navButton";
        PagePrevLink.title = 'Previous view';
        PagePrevLink.onmouseover = function () {
            PagePrevButton.src = ViewerServer + "resources/js/images/doc_prev_over.png";
        };
        PagePrevLink.onmouseout = function () {
            PagePrevButton.src = ViewerServer + "resources/js/images/doc_prev.png";
        };

        PagePrevLink.appendChild(PagePrevButton);
        navDiv.appendChild(PagePrevLink);

        PageNextButton = document.createElement("img");
        PageNextButton.src = ViewerServer + "resources/js/images/doc_next.png";

        PageNextButton.style.marginRight = "20px";
        PageNextButton.onclick = incSlider;

        var PageNextLink = document.createElement("a");
        PageNextLink.className = "bl_navButton";
        PageNextButton.title = 'Next view';
        PageNextLink.onmouseover = function () {
            PageNextButton.src = ViewerServer + "resources/js/images/doc_next_over.png";
        };
        PageNextLink.onmouseout = function () {
            PageNextButton.src = ViewerServer + "resources/js/images/doc_next.png";
        };

        PageNextLink.appendChild(PageNextButton);
        navDiv.appendChild(PageNextLink);

        bottomDiv.appendChild(navDiv);
    }

    function firstPage() {
        if (PageFirstButton.disabled) {
            return;
        }
        setSliderValue(slider1, 1);
    }

    function lastPage() {
        if (PageLastButton.disabled) {
            return;
        }
        setSliderValue(slider1, PageList.length + (NumViews == 2 ? 1 : 0));
    }

    function setupIFrame(isInitial) {
        var frameWidth = screenWidth;
        var frameHeight = screenHeight;

        if (isInitial) {
            if (viewingIFrameId != null) {
                viewingIFrameDiv = document.getElementById(viewingIFrameId);
                frameWidth = viewingIFrameDiv.style.width;
                frameHeight = viewingIFrameDiv.style.height;
            }
            else {
                viewingIFrameDiv = document.createElement("div");

                controllerDiv.appendChild(viewingIFrameDiv);
            }

            viewingIFrame = document.createElement("iframe");
        }

        viewingIFrameDiv.className = "bl_iframe";
        viewingIFrameDiv.style.position = "relative";
        viewingIFrameDiv.style.marginTop = "0px";
        viewingIFrameDiv.style.marginLeft = "0px";
        viewingIFrameDiv.style.marginBottom = "10px";
        viewingIFrameDiv.appendChild(viewingIFrame);

        glassPane.src = ViewerServer + "resources/js/images/spacer.gif";
        glassPane.style.position = "fixed";
        glassPane.style.top = 100;
        glassPane.style.left = 0;
        glassPane.style.width = "100%";
        glassPane.style.height = "100%";
        glassPane.style.zIndex = 1000;
        glassPane.style.display = "none";

        viewingIFrameDiv.appendChild(glassPane);

        viewingIFrame.style.cssFloat = "left";
        viewingIFrame.style.position = "relative";
        viewingIFrame.frameBorder = 0;
        viewingIFrame.marginWidth = 0;

        viewingIFrame.width = frameWidth;
        viewingIFrame.height = frameHeight;

        startWidth = viewingIFrame.width;

        // message listener
        var onmessage = function (e) {
            iframeMsg = e.source;
        }
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', onmessage, false);
        }
        else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', onmessage);
        }
    }

    var isInitialView = true;
    var leftViewOpened = false;

    function OnViewChange() {
        var type = (ViewButton.src === ViewerServer + "resources/js/images/singleView_over.png" ||
                    ViewButton.src === ViewerServer + "resources/js/images/singleView.png") ? "s" : "o";

        viewType = type === "o" ? "open" : "single";

        if (type == "s") {
            if (leftViewOpened)
                index--;

            ViewButton.src = ViewerServer + "resources/js/images/openView.png";

            NumViews = 1;

            viewingIFrame.width = startWidth;
        }
        else if (type == "o") {
            leftViewOpened = index % 2 == 1;

            ViewButton.src = ViewerServer + "resources/js/images/singleView.png";

            NumViews = 2;
            AsBook = true;
        }
        else {
            NumViews = 2;
            AsBook = false;
        }

        if (NumViews == 2) {
            isInitialView = false;

            pageValues = new Array();
            for (i = 0; i <= PageList.length; i += 2) {
                pageValues[i / 2] = i;
            }
            var options = new Object();
            options.values = pageValues;

            slider1.setValues(options, PageList.length % 2 == 0 ? 10 : 0);
        }
        else if (!isInitialView) {
            if (index > PageList.length - 1)
                index = PageList.length - 1;

            pageValues = new Array();
            for (i = 0; i <= PageList.length - 1; i++) {
                pageValues[i] = i;
            }

            var options = new Object();
            options.values = pageValues;

            slider1.setValues(options, 0);
        }

        setViews();

        setControls();
    }

    function setViews() {
        setPages();

        setControls();
    }

    function setPages() {
        var offset = 0;
        var lastPage = false;

        if (NumViews == 2 && index % 2 != 0)
            index++;    // for open book view

        if (index < 0)
            index = 0;
        var imgindex = index; // +offset;

        if (NumViews == 1) {
            if (imgindex > PageList.length - 1)
                imgindex = PageList.length - 1;

            var data = loadImageMetadata(PageList[imgindex].ImageID);

            var params = "NumViews=1&page1=" + PageList[imgindex].ImageID +
            "&width1=" + data.width +
            "&height1=" + data.height +
            "&jp2levels1=" + data.scale_factors.length;

            updateViewerIFrame(params);

        }
        else if (NumViews == 2) {
            if (imgindex > PageList.length - 1)
                lastPage = true;

            if (lastPage || imgindex < PageList.length) {
                var page1 = "";
                var page2 = "";

                if (imgindex > 0) {
                    var data1 = loadImageMetadata(PageList[imgindex - 1].ImageID);

                    page1 = PageList[imgindex - 1].ImageID +
                    "&width1=" + data1.width +
                    "&height1=" + data1.height +
                    "&jp2levels1=" + data1.scale_factors.length;
                }

                if (imgindex < PageList.length) {
                    var data2 = loadImageMetadata(PageList[imgindex].ImageID);

                    page2 = PageList[imgindex].ImageID +
                    "&width2=" + data2.width +
                    "&height2=" + data2.height +
                    "&jp2levels2=" + data2.scale_factors.length;
                }

                var params = "NumViews=2&page1=" + page1 +
                            "&page2=" + page2;

                updateViewerIFrame(params);
            }
            else {
                // invalid
            }
        }
    }

    function updateViewerIFrame(params) {
        viewingIFrame.src = WidgetServer + "?" + params;
    }

    function setControls() {
        startFadeTimer();

        PageNextButton.disabled = false;
        PagePrevButton.disabled = false;
        PageFirstButton.disabled = false;
        PageLastButton.disabled = false;

        if (index <= NumViews - 1) {
            PagePrevButton.disabled = true;
            PageFirstButton.disabled = true;
        }
        else if (index >= PageList.length - NumViews + (PageList.length % 2 == 0 ? 1 : 0)) {
            PageNextButton.disabled = true;
            PageLastButton.disabled = true;
        }

        controlsUpdated = true;
        setSliderValue(slider1, index + 1);
    }

    // prevent text selection

    function disableSelect(el) {
        if (el.addEventListener) {
            el.addEventListener("mousedown", disabler, "false");
        } else {
            el.attachEvent("onselectstart", disabler);
        }
    }

    function enableSelect(el) {
        if (el.addEventListener) {
            el.removeEventListener("mousedown", disabler, "false");
        } else {
            el.detachEvent("onselectstart", disabler);
        }
    }

    function disabler(e) {
        if (e.preventDefault) { e.preventDefault(); }
        return false;
    }

    var controlsUpdated = false;

    // metadata set up
    var metadataBar = null;
    var metadataContent = null;
    var metadataCheck = null;
    var detailsLabel = null;
    var inMetadata = false;
    var metadataDefaultTop = "80px";
    var metadataDefaultLeft = "";
    var metadataResizeHandle = null;
    var metadataResize = null;

    function setupBanner(Item) {
        var bannerDiv = document.createElement("div");
        bannerDiv.id = "bl_banner";
        disableSelect(bannerDiv);

        var bannerImg = document.createElement("img");
        bannerImg.src = ViewerServer + "resources/js/images/banner.png";
        bannerDiv.appendChild(bannerImg);

        topDiv.appendChild(bannerDiv);

        var bannerContent = document.createElement("div");
        bannerContent.id = "bl_bannerContent";

        bannerDiv.appendChild(bannerContent);

        var titleDiv = document.createElement("div");
        if (Item === null) {
            titleDiv.innerHTML = "An error occurred in retrieving the item";
        }
        else
            titleDiv.innerHTML = Item.BookMetadata.Title;
        titleDiv.style.width = (screenWidth - 370) + "px";
        titleDiv.id = "bl_title";

        bannerContent.appendChild(titleDiv);

        if (Item != null) {
            var detailsAnchor = document.createElement("div");
            detailsAnchor.className = "bl_details";
            titleDiv.appendChild(detailsAnchor);

            detailsLabel = document.createElement("div");
            detailsLabel.appendChild(document.createTextNode("show details"));
            detailsLabel.onclick = function () {
                toggleMetadata();
            };
            detailsAnchor.appendChild(detailsLabel);

            if (metadataId) {
                metadataDiv = document.getElementById(metadataId);
            }
            else {
                metadataDiv = document.createElement("div");
                controllerDiv.appendChild(metadataDiv);

                metadataDiv.id = 'bl_metadata';
                metadataDiv.className = "bl_metadata rounded-corners";
            }

            metadataDiv.style.display = "none";
            metadataDiv.style.height = "300px";
            metadataDiv.style.top = metadataDefaultTop;
            metadataDefaultLeft = screenWidth - 200 + "px";
            metadataDiv.style.left = metadataDefaultLeft;

            metadataBar = document.createElement("div");
            metadataBar.id = "bl_metadataBar";

            try {
                if (typeof (document.body.style.MozBorderRadius) !== "undefined" ||
                    typeof (document.body.style.WebkitBorderRadius) !== "undefined" ||
                    typeof (document.body.style.KhtmlBorderRadius) !== "undefined") {
                    metadataBar.className = "bl_metadataBar top-rounded-corners";
                }
                else
                    metadataBar.className = "bl_metadataBar rounded-corners";
            } catch (err) {
                metadataBar.className = "bl_metadataBar rounded-corners";
            }

            metadataBar.appendChild(document.createTextNode("Details"));

            disableSelect(metadataBar);

            var closeMetadata = document.createElement("div");
            closeMetadata.style.color = "red";
            closeMetadata.style.display = "inline";
            closeMetadata.innerHTML = "&nbsp;X";
            closeMetadata.style.cursor = "pointer";
            closeMetadata.onclick = toggleMetadata;
            metadataBar.appendChild(closeMetadata);

            metadataContent = document.createElement("div");
            metadataContent.id = "bl_metadataContent";
            metadataContent.className = "bl_metadataContent rounded-corners";

            for (var key in Item.BookMetadata) {
                if (Item.BookMetadata.hasOwnProperty(key)) {
                    if (Item.BookMetadata[key] != "") {
                        var metadata = document.createElement("div");
                        var metadataLabel = document.createElement("span");
                        metadataLabel.appendChild(document.createTextNode(key.replace(/([a-z])([A-Z])/, "$1 $2") + ": "));
                        metadataLabel.style.fontWeight = "bold";
                        metadata.appendChild(metadataLabel);

                        metadata.appendChild(document.createTextNode(Item.BookMetadata[key]));

                        metadataContent.appendChild(metadata);
                    }
                }
            }

            metadataBar.glassPane = glassPane;

            Drag.init(metadataBar, metadataDiv);

            metadataDiv.appendChild(metadataBar);
            metadataDiv.appendChild(metadataContent);
        }
    }

    function toggleMetadata() {
        if (metadataDiv.style.display == "none") {
            detailsLabel.innerHTML = "";
            detailsLabel.appendChild(document.createTextNode("hide details"));
            metadataDiv.style.display = "block";

            if (metadataResizeHandle == null && metadataContent.scrollHeight > metadataContent.clientHeight) {
                metadataResize = document.createElement("div");
                metadataResize.id = "bl_resizeMetadata";
                metadataResize.style.display = "block";
                metadataResize.style.top = metadataContent.clientHeight - 5 + "px";
                metadataResize.style.backgroundImage = "url('" + ViewerServer + "resources/js/images/resizey.png" + "')";

                metadataContent.appendChild(metadataResize);

                metadataResizeHandle = new resize_drag("metadataResizeHandle", glassPane);
                metadataResizeHandle.init({ id: "bl_resizeMetadata", direction: "y", limit: { x: [100, 580], y: [metadataContent.clientHeight - 15, metadataContent.scrollHeight]} });

                metadataContent.onscroll = function () {
                    var scrollOffset = metadataContent.pageYOffset ? metadataContent.pageYOffset : metadataContent.scrollTop;
                    metadataResizeHandle.updatePosition(scrollOffset);
                };
            }

            if (metadataBar.lastMouseY < 100)
                metadataDiv.style.top = metadataDefaultTop;
            else if (metadataBar.lastMouseY > screenHeight - 150)
                metadataDiv.style.top = metadataDefaultTop;

            if (metadataBar.lastMouseX < 150)
                metadataDiv.style.left = metadataDefaultLeft;
            else if (metadataBar.lastMouseX > screenWidth - 5)
                metadataDiv.style.left = metadataDefaultLeft;
        }
        else {
            hideMetadata();
        }
    }

    function hideMetadata() {
        detailsLabel.innerHTML = "";
        detailsLabel.appendChild(document.createTextNode("show details"));

        metadataDiv.style.display = "none";
    }

    // image metadata functions 
    function stripslashes(str) {
        str = str.replace(/\\'/g, '\'');
        str = str.replace(/\\"/g, '"');
        str = str.replace(/\\0/g, '\0');
        str = str.replace(/\\\\/g, '\\');
        return str;
    }

    function loadImageMetadata(id) {
        var data = null;
        var url = ImageMetadataServer + id + "/info.json";

        var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
        if (window.ActiveXObject) {
            for (var i = 0; i < arrActiveX.length; i++) {
                try {
                    req = new ActiveXObject(arrActiveX[i]);
                    break;
                } catch (e) {
                    continue;
                }
            }
        } else if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        }

        try {
            req.open("GET", url, false);
            req.send(null);
        } catch (e) {
            req = null;
        }

        var resp = req.responseText;

        resp = stripslashes(resp.replace("\"{", "{").replace("}\"", "}"), "\"", "'");
        data = eval('(' + resp + ')');

        return data;
    }

    // navigation functions

    var fadeTimer = null;
    var isNavIn = false;

    function startFadeTimer() {
        if (bottomDiv != null) {
            bottomDiv.style.display = "block";
            bottomDiv.style.visibility = "visible";
            bottomDiv.style.opacity = 0.7;
            bottomDiv.style.filter = 'alpha(opacity=80)';
            bottomDiv.FadeState = null;
            if (fadeTimer != null) {
                clearTimeout(fadeTimer);
            }

            fadeTimer = setTimeout(controllerName + ".fadeBottom()", 5000);
        }
    }

    this.fadeBottom = function () {
        if (!isNavIn) {
            clearTimeout(fadeTimer);
            fade(bottomDiv.id);
        }
    }

    function showNav() {
        isNavIn = true;
    }

    function hideNav() {
        isNavIn = false;
        startFadeTimer();
    }

    // slider functions

    var tThumbnail = null;
    var isMouseDown = false;
    var pageValues = new Array();
    var mainImageTimer = null;
    var slider1 = null;
    var sliderWidth = null;
    var handleimg = null;
    var sliderThumbnailContainer = null;
    var lastSliderValue = null;

    function setupSlider() {
        // setup order labels
        if (NumViews == 1) {
            for (i = 0; i <= PageList.length - 1; i++) {
                pageValues[i] = i;
            }
        }
        else {
            for (i = 0; i <= PageList.length; i += 2) {
                pageValues[i / 2] = i;
            }
        }

        sliderWidth = screenWidth / 2;

        // setup the slider divs
        var navslideDiv = document.createElement("div");
        navslideDiv.id = "bl_navslide";
        navslideDiv.className = "no-print";
        navslideDiv.style.width = sliderWidth + "px";
        navslideDiv.style.marginLeft = "60px";

        var track = document.createElement("div");
        track.id = "bl_track";
        track.style.width = sliderWidth - 30 + "px";

        PageFirstButton = document.createElement("img");
        PageFirstButton.src = ViewerServer + "resources/js/images/doc_first.png";
        PageFirstButton.id = "bl_firstpage";
        PageFirstButton.onclick = firstPage;
        PageFirstButton.title = 'First view';

        var PageFirstLink = document.createElement("a");
        PageFirstLink.className = "bl_navButton";
        PageFirstLink.onmouseover = function () {
            PageFirstButton.src = ViewerServer + "resources/js/images/doc_first_over.png";
        };
        PageFirstLink.onmouseout = function () {
            PageFirstButton.src = ViewerServer + "resources/js/images/doc_first.png";
        };

        PageFirstLink.appendChild(PageFirstButton);
        track.appendChild(PageFirstLink);

        var trackEnd = document.createElement("div");
        trackEnd.id = "bl_track_end";
        navslideDiv.appendChild(trackEnd);

        PageLastButton = document.createElement("img");
        PageLastButton.src = ViewerServer + "resources/js/images/doc_last.png";
        PageLastButton.id = "bl_lastpage";
        PageLastButton.onclick = lastPage;

        PageLastButton.className = "bl_navButtonImg";
        PageLastButton.title = 'Last view';
        PageLastButton.onmouseover = function () {
            PageLastButton.src = ViewerServer + "resources/js/images/doc_last_over.png";
        };
        PageLastButton.onmouseout = function () {
            PageLastButton.src = ViewerServer + "resources/js/images/doc_last.png";
        };
        PageLastButton.onclick = lastPage;
        //        PageLastButton.style.left = track.style.width + 49 + "px";
        track.appendChild(PageLastButton);

        navslideDiv.appendChild(track);

        var handle = document.createElement("div");
        handle.id = "bl_handle";
        handle.onmousedown = function () {
            isMouseDown = true;
        };
        handle.onmouseup = function () {
            isMouseDown = false;
            resetThumbnailTimer();
        };

        handle.onmouseover = function () {
            handleimg.src = ViewerServer + "resources/js/images/slider_over.png";
        };

        handle.onmouseout = function () {
            handleimg.src = ViewerServer + "resources/js/images/slider.png";
        };

        navslideDiv.appendChild(handle);

        handleimg = document.createElement("img");
        handleimg.src = ViewerServer + "resources/js/images/slider.png";
        handleimg.style.width = "74px"; //"35px";
        handleimg.style.height = "35px"; //"27px";

        handle.appendChild(handleimg);

        var sliderText = document.createElement("div");
        sliderText.id = "bl_slider-text";
        sliderText.style.width = "60px";
        sliderText.onmousedown = function () {
            showSliderText();
        };
        sliderText.appendChild(document.createTextNode("1"));

        handle.appendChild(sliderText);

        var decslider = document.createElement("div");
        decslider.id = "bl_decslider";
        decslider.appendChild(document.createTextNode("<"));
        decslider.onclick = function () {
            decSlider();
        };

        handle.appendChild(decslider);

        var sliderNewtext = document.createElement("input");
        sliderNewtext.id = "bl_slider-newtext";
        sliderNewtext.style.size = "2";
        sliderNewtext.style.height = "20px";

        handle.appendChild(sliderNewtext);

        var incslider = document.createElement("div");
        incslider.id = "bl_incslider";
        incslider.appendChild(document.createTextNode(">"));
        incslider.onclick = function () {
            incSlider();
        };

        handle.appendChild(incslider);

        sliderThumbnailContainer = document.createElement("div");
        sliderThumbnailContainer.id = "bl_slider-thumbnailContainer";
        sliderThumbnailContainer.style.display = "none";
        sliderThumbnailContainer.style.height = "100px";
        sliderThumbnailContainer.style.width = "200px";
        sliderThumbnailContainer.style.marginTop = "-220px";

        var sliderThumbnail = document.createElement("div");
        sliderThumbnail.id = "bl_slider-thumbnail";
        sliderThumbnail.style.textAlign = "center";
        sliderThumbnail.style.width = "100px";

        sliderThumbnailContainer.appendChild(sliderThumbnail);

        controllerDiv.appendChild(sliderThumbnailContainer);

        bottomDiv.appendChild(navslideDiv);
        bottomDiv.style.left = (screenWidth / 2) - (sliderWidth / 2) - 80 + "px";

        // horizontal slider control
        slider1 = new Control.Slider('bl_handle', 'bl_track', {
            range: $R(0, PageList.length - 1),
            values: pageValues,
            onSlide: function (v) {
                $('bl_slider-text').innerHTML =
                    (NumViews == 2 ?
                                (v > 0 ? parseInt(v) : "") + " - " +
                                (v < PageList.length ? parseInt(v + 1).toFixed() : "") :
                                parseInt(v + 1).toFixed());

                startTimer(v.toFixed());
                hideSliderText();
            },
            onChange: function (v) {
                $('bl_slider-text').innerHTML =
                        (NumViews == 2 ?
                            (v > 0 ? parseInt(v) : "") + " - " + (v < PageList.length ? parseInt(v + 1).toFixed() : "") :
                            parseInt(v + 1).toFixed());

                hideSliderText();
                resetThumbnailTimer();
                if (controlsUpdated)
                    controlsUpdated = false;
                else {
                    setMainImageTimer(v.toFixed());
                }
            }
        });

        if (NumViews == 2)
            slider1.setTracklengthOffset(10);
    }

    function startTimer(val) {
        clearTimeout(tThumbnail);

        tThumbnail = null;
        tThumbnail = setTimeout(controllerName + ".setSliderThumbnail(" + val + ")", 100);
    }

    function resetThumbnailTimer() {
        $('bl_slider-thumbnailContainer').style.display = "none";

        isMouseDown = false;
        clearTimeout(tThumbnail);
    }

    function keyupSliderText(e) {
        if (e.keyCode == 13) {
            slideup('bl_slider-newtext');
            setSliderValue(slider1, $('bl_slider-newtext').value);
        }
    }

    function showSliderText() {
        document.getElementById('bl_slider-newtext').value = $('bl_slider-text').innerHTML;

        $('bl_slider-newtext').observe('keyup', keyupSliderText);

        slidedown('bl_slider-newtext');

        document.getElementById('bl_slider-newtext').focus();
        document.getElementById('bl_slider-newtext').select();
    }

    function hideSliderText() {
        document.getElementById('bl_slider-newtext').style.display = "none";
        slideup('bl_slider-newtext');
    }

    function setMainImageTimer(val) {
        clearTimeout(mainImageTimer);
        mainImageTimer = setTimeout(controllerName + ".setMainImage(" + val + ")", 300);
    }

    this.setMainImage = function (val) {
        index = val;
        setViews();
        resetThumbnailTimer();
    }

    this.setSliderThumbnail = function (val) {
        var loading = false;

        if (val < PageList.length) {
            {
                var img = PageList[val].ImageID;
                var leftimg = null;

                if (NumViews == 2 && val > 0) {
                    if (PageList[val - 1].preloaded)
                        leftimg = PageList[val - 1].ImageID;
                    else {
                        loading = true;
                    }
                }

                if (!isMouseDown) {
                    return;
                }

                {
                    var thumbnailHTML = "";

                    thumbnailHTML = "<img style='border:1px solid black; background-color:white; padding: 2px;' src='" + getImageURL(img) + "'>";

                    if (leftimg) {
                        thumbnailHTML = "<img style='border:1px solid black; background-color:white; padding: 2px;' src='" + getImageURL(leftimg) + "'>"
                                                            + thumbnailHTML;
                    }

                    $('bl_slider-thumbnail').innerHTML = "<div style='width:" + (leftimg ? 150 : 75) + "px'>" + thumbnailHTML + "</div>";

                    revealThumbnail(leftimg ? 37 : 0);
                }
            }
        }
    }

    function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }

        return rv;
    }

    function revealThumbnail(offset) {
        var ie7_8Offset = (!offset && (getInternetExplorerVersion() == 8 || getInternetExplorerVersion() == 7)) ? 15 : 0;
        sliderThumbnailContainer.style.left = parseInt(bottomDiv.style.left.replace("px", "")) + parseInt(slider1.handles[0].style.left.replace("px", "")) + 60 - ie7_8Offset - offset + "px";
        slidedown('bl_slider-thumbnailContainer');
    }

    function getImageMetadataURL(pos, callback, pageside) {
        var url = ImageServer + "ImageMetadata/" + (pageside ? pageside + "/" : "") + pos + "/" + PageList[pos].ImageID + "?callback=" + controllerName + "." + callback;
        return url;
    }

    function getImageURL(img) {
        var url = ImageServer + img + "/full/!70,70/0/native.jpg";
        return url;
    }

    function incSlider() {
        if (slider1.value <= PageList.length - NumViews)
            slider1.setValue(slider1.value + NumViews);
    }

    function decSlider() {
        if (slider1.value > NumViews - 1)
            slider1.setValue(slider1.value - NumViews);
    }

    function setSliderValue(slider, value) {
        // due to onChange code above we need this or 
        // a 0 will be put in the text box when you delete the value
        if (value == '') return;

        var regDigit = /\d+/;
        var regNonDigit = /[^0-9]/;

        if (regNonDigit.test(value)) {
            value = value.match(regDigit);
        }

        if (isNaN(value))
            slider1.setValue(0);
        else {
            slider1.setValue(value - 1);
        }

        resetThumbnailTimer();
    }
}