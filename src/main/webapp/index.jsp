<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >

<head>
<title>The Sanddragon Item Viewer</title>
<link rel="stylesheet" type="text/css" media="print" href="resources/css/SanddragonItemViewer.print.css" />
<link rel="stylesheet" type="text/css" media="screen" href="resources/css/SanddragonItemViewer.css" />
<base href="http://localhost:8080/SanddragonItemViewer/"/>   
<script type="text/javascript" src="resources/js/prototype.js"></script>
<script type="text/javascript" src="resources/js/drag.js">
    /**************************************************
    * dom-drag.js
    * 09.25.2001
    * www.youngpup.net
    * Script featured on Dynamic Drive (http://www.dynamicdrive.com) 12.08.2005
    * License terms found here - http://www.dynamicdrive.com/notice.htm
    **************************************************/
</script>
<script type="text/javascript" src="resources/js/dragresize.js"></script>
<script type="text/javascript" src="resources/js/slider.js"></script>
<script type="text/javascript" src="resources/js/animation.js"></script>
<script type="text/javascript" src="resources/js/fade.js"></script>
<script type="text/javascript" src="resources/js/SanddragonItemViewer.js"></script>
        <script type="text/javascript"> 
            function init() { 
                var itemid = document.getElementById("ItemID").value;
                var pageid = document.getElementById("PageID").value;
                var viewtype = document.getElementById("ViewType").value;

                try {
                    controller = new SanddragonItemViewer("controller", "SanddragonItemViewer", itemid, pageid, viewtype, true);
                    controller.init();
                }
                catch (exception) {
                    alert(exception);
                }
            }
            window.onload = init;                         
        </script>
</head>

<body>
    <form id="form1" onsubmit="return false;">
        <input type="hidden" id="ItemID" value="${param.itemid}" />
        <input type="hidden" id="PageID" value="${param.pageid}" />
        <input type="hidden" id="ViewType" value="${empty param.page1 ? 'single' : param.viewtype}" />
        <input type="hidden" id="itemViewerServer" value="${initParam.Server}" />
        <input type="hidden" id="ViewerServer" value="${initParam.ViewerServer}" />
        <input type="hidden" id="ImageServer" value="${initParam.ImageServer}" />
        <input type="hidden" id="ImageMetadataServer" value="${initParam.ImageMetadataServer}" />
        <input type="hidden" id="WidgetServer" value="${initParam.WidgetServer}" />
        <div id="SanddragonItemViewer"></div>
    </form>
</body>
</html>
