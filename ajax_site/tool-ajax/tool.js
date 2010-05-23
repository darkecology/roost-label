// BEGIN GLOBALS COPIED FROM LabelMe my_scripts.js
// RETHINK AND REORGANIZE THESE
var bname;
var bversion;

function getEvent(e)
{
    return e || window.event;
}

function stopPropagation(e)
{
    if (e.stopPropagation) 
	e.stopPropagation();
    else 
	e.cancelBubble = true;
}

function GetBrowserInfo() {
    bname = navigator.appName;
    if(IsMicrosoft()) {
		var arVersion = navigator.appVersion.split("MSIE");
		bversion = parseFloat(arVersion[1]);
	}
    else if(IsNetscape() || IsSafari()) {
		bversion = parseInt(navigator.appVersion);
		//check for Safari.  
		if(navigator.userAgent.match('Safari')) bname = 'Safari';
	}
	else bversion = 0;
}

function getMouse(event, obj)
{
    var x,y;
    if (IsNetscape())
    {
	x = event.layerX;
	y = event.layerY;
    }
    else if (IsMicrosoft())
    {
	x = event.x + obj.scrollLeft;
	y = event.y + obj.scrollTop;
    }
    else
    {
	x = event.offsetX;
	y = event.offsetY;
    }
    return new Point(x, y);
}

function IsNetscape() {
    return (bname.indexOf("Netscape")!=-1);
}

function IsMicrosoft() {
    return (bname.indexOf("Microsoft")!=-1);
}

function IsSafari() {
    return (bname.indexOf("Safari")!=-1);
}

function IsChrome() {
    return (bname.indexOf("chrome")!=-1);
}

/* Insert parent object into the prototype chain so that child will inherit parent methods */
function inherits(child, parent)
{
    child.prototype = new parent();
}

/* Return an anonymous function that can be called later with the
 * effect of calling obj.method() */
function bindEvent(obj, method){
    return function(e) {
	e = getEvent(e);
	obj[method](e, this);
	stopPropagation(e);
	return false;
    }
}


//------------------------------------------------------------------------
// Interface Graphic
//------------------------------------------------------------------------

function Graphic(x, y)
{
    this.x = x;
    this.y = y;
    this.renderings = [];
}


Graphic.prototype.move = function(dx, dy)
{
    this.x += dx;
    this.y += dy;
};

Graphic.prototype.moveTo = function(x, y)
{
    this.x = x;
    this.y = y;
};

Graphic.prototype.draw = function(obj)
{
    if (!obj)
    {
	alert("Error: null object");
	return;
    }

    var r = this.newRendering(obj);
    r.render();
    this.renderings.push(r);
};

Graphic.prototype.newRendering = function()
{
    throw new Error("Call to pure virtual method");
}

Graphic.prototype.redraw = function()
{
    for (var i = 0; i < this.renderings.length; i++)
    {
	this.renderings[i].render();
    }
};

Graphic.prototype.undraw = function()
{
    for (var i = 0; i < this.renderings.length; i++)
    {
	this.renderings[i].unrender();
    }
    this.renderings = [];
};

Graphic.prototype.listen = function(eventname, obj, methodname)
{
    for (var i = 0; i < this.renderings.length; i++)
    {
	this.renderings[i].listen(eventname, obj, methodname);
    }
};

Graphic.prototype.setStyle = function(property, value)
{
    for (var i = 0; i < this.renderings.length; i++)
    {
	this.renderings[i].setStyle(property, value);
    }
};


//------------------------------------------------------------------------
// Interface Rendering
//------------------------------------------------------------------------

function Rendering(parentElt, graphicObj)
{
    this.parentElt = parentElt;
    this.graphicObj = graphicObj;
    this.renderElt = null;
}

Rendering.prototype.render = function()
{
    throw new Error("Call to pure virtual method");    
};

Rendering.prototype.unrender = function()
{
    if (this.renderElt)
    {
	this.parentElt.removeChild(this.renderElt);
    }
};
    
Rendering.prototype.listen = function(eventname, obj, methodname)
{
    this.renderElt[eventname] = bindEvent(obj, methodname);
};

Rendering.prototype.setStyle = function(property, value)
{
    this.renderElt.style[property] = value;
};

//------------------------------------------------------------------------
// class Circle
//------------------------------------------------------------------------
function Circle(cx, cy, r)
{
    Graphic.call(this, cx, cy);
    this.r = r;

    // default appearance properties
    this.strokeWidth = 4;
    this.strokeOpacity = 1;
    this.strokeColor = "red";
    this.fill = "none";
    this.fillOpacity = 1; 
}
inherits(Circle, Graphic);

Circle.prototype.newRendering = function(parent)
{
    return new SVGCircle(parent, this);
}

//------------------------------------------------------------------------
// class SVGCircle: render a circle using SVG
//------------------------------------------------------------------------

function SVGCircle(parentElt, circle)
{
    Rendering.call(this, parentElt, circle);
    var svgNS = "http://www.w3.org/2000/svg";
    this.renderElt = document.createElementNS(svgNS, "circle");
    parentElt.appendChild(this.renderElt);
};
inherits(SVGCircle, Rendering);

SVGCircle.prototype.render = function()
{
    var svgCircle = this.renderElt;
    var circle = this.graphicObj;

    svgCircle.setAttributeNS(null, "cx", circle.x);
    svgCircle.setAttributeNS(null, "cy", circle.y);
    svgCircle.setAttributeNS(null, "r",  circle.r);
    svgCircle.setAttributeNS(null, "fill",         circle.fill);
    svgCircle.setAttributeNS(null, "fill-opacity", circle.fillOpacity);
    svgCircle.setAttributeNS(null, "stroke",       circle.strokeColor);
    svgCircle.setAttributeNS(null, "stroke-width", circle.strokeWidth);
    svgCircle.setAttributeNS(null, "stroke-opacity", circle.strokeOpacity);
};

//------------------------------------------------------------------------
// class TextMarker
//------------------------------------------------------------------------
function TextMarker(x, y, text)
{
    Graphic.call(this, x, y);

    this.x = x;
    this.y = y;
    this.text = text;
    
    this.textAnchor = "middle";
    this.fill = "red";
    this.fontFamily = "Verdana";
    this.fontSize = 20;
    this.strokeWidth = 5;
    this.opacity = 1;
}
inherits(TextMarker, Graphic);

TextMarker.prototype.newRendering = function(parentElt)
{
    return new SVGText(parentElt, this);
};

//------------------------------------------------------------------------
// class SVGText: render a TextMarker using SVG
//------------------------------------------------------------------------

function SVGText(parentElt, textGraphic)
{
    Rendering.call(this, parentElt, textGraphic);

    var svgNS = "http://www.w3.org/2000/svg";    
    this.renderElt = document.createElementNS(svgNS, "text");
    this.textNode = document.createTextNode(textGraphic.text);
    this.renderElt.appendChild(this.textNode);
    parentElt.appendChild(this.renderElt);
}
inherits(SVGText, Rendering);

SVGText.prototype.render = function()
{
    var svgText = this.renderElt;
    var textGraphic = this.graphicObj;

    svgText.setAttributeNS(null, "x",           textGraphic.x);
    svgText.setAttributeNS(null, "y",           textGraphic.y);
    svgText.setAttributeNS(null, "text-anchor", textGraphic.textAnchor);
    svgText.setAttributeNS(null, "alignment-baseline", "middle");
    svgText.setAttributeNS(null, "fill",        textGraphic.fill);
    svgText.setAttributeNS(null, "opacity",     textGraphic.opacity);
    svgText.setAttributeNS(null, "font-family", textGraphic.fontFamily);
    svgText.setAttributeNS(null, "font-size",   textGraphic.fontSize);

    this.textNode.nodeValue = textGraphic.text;
};

//------------------------------------------------------------------------
// class XMarker
//------------------------------------------------------------------------
function XMarker(x, y, w)
{
    Graphic.call(this, x, y);

    this.x = x;
    this.y = y;
    this.w = w;

    this.strokeWidth = 4;
    this.strokeColor = "red";
    this.opacity = 1;
}
inherits(XMarker, Graphic);

XMarker.prototype.newRendering = function(parentElt)
{
    return new SVGx(parentElt, this);
};


//------------------------------------------------------------------------
// class SVGCircle: render a circle using SVG
//------------------------------------------------------------------------

function SVGx(parentElt, graphicObj)
{
    Rendering.call(this, parentElt, graphicObj);

    var svgNS = "http://www.w3.org/2000/svg";    
    var mark = graphicObj;

    this.renderElt = document.createElementNS(svgNS, "g");
    this.renderElt.setAttributeNS(null, "transform", 'translate(' + mark.x + ',' + mark.y + ')');

    this.line1 = document.createElementNS(svgNS, "line");
    this.line1.setAttributeNS(null, "x1", -mark.w/2);
    this.line1.setAttributeNS(null, "y1", -mark.w/2);
    this.line1.setAttributeNS(null, "x2",  mark.w/2);
    this.line1.setAttributeNS(null, "y2",  mark.w/2);

    this.line2 = document.createElementNS(svgNS, "line");
    this.line2.setAttributeNS(null, "x1", -mark.w/2);
    this.line2.setAttributeNS(null, "y1",  mark.w/2);
    this.line2.setAttributeNS(null, "x2",  mark.w/2);
    this.line2.setAttributeNS(null, "y2", -mark.w/2);

    this.renderElt.appendChild(this.line1);
    this.renderElt.appendChild(this.line2);

    parentElt.appendChild(this.renderElt);    
}
inherits(SVGx, Rendering);

SVGx.prototype.render = function(svgText)
{
    var mark = this.graphicObj;

    this.renderElt.setAttributeNS(null, "transform", 'translate(' + mark.x + ',' + mark.y + ')');

    this.renderElt.setAttributeNS(null, "stroke-width", mark.strokeWidth);
    this.renderElt.setAttributeNS(null, "stroke",       mark.strokeColor);
    this.renderElt.setAttributeNS(null, "opacity",      mark.opacity);
};

//------------------------------------------------------------------------
// class Point
//------------------------------------------------------------------------
function Point(x, y)
{
    this.x = x;
    this.y = y;
}

function CircleMarker(x, y)
{
    Circle.call(this, x, y, 5);
    this.strokeWidth = 0;
    this.fill = this.strokeColor;
}
inherits(CircleMarker, Circle);

//------------------------------------------------------------------------
// class RoostCircle: a circle that can be edited
//------------------------------------------------------------------------

function RoostCircle(cx, cy, r)
{
    Circle.call(this, cx, cy, r);
    this.deleteHandle = new XMarker(cx, cy, 8);
    this.radiusHandle = new CircleMarker(cx, cy - r);
}
inherits(RoostCircle, Circle);

RoostCircle.prototype.draw = function(obj)
{
    Circle.prototype.draw.call(this, obj);
    this.setStyle("cursor", "move");
    this.listen("onmousedown", this, "startDrag");

    this.radiusHandle.draw(obj);
    this.radiusHandle.setStyle("cursor", "pointer");
    this.radiusHandle.listen("onmousedown", this, "startResize");

    this.deleteHandle.draw(obj);
    this.deleteHandle.listen("onmousedown", this, "remove");
    this.deleteHandle.setStyle("cursor", "pointer");
};

RoostCircle.prototype.redraw = function()
{
    this.deleteHandle.redraw();
    this.radiusHandle.redraw();
    Circle.prototype.redraw.call(this);
}

RoostCircle.prototype.undraw = function()
{
    this.deleteHandle.undraw();
    this.radiusHandle.undraw();
    Circle.prototype.undraw.call(this);
};

RoostCircle.prototype.remove = function(e)
{    
    this.undraw();
};

//--------------------
// Resize
//--------------------
RoostCircle.prototype.startResize = function(e, callObj)
{
    this.canvas = getCanvas(callObj);
    this.canvas.onmousemove = bindEvent(this, "resize");
    this.strokeOpacity = .5;
    document.onmouseup = bindEvent(this, "finishResize");
    this.redraw();
};

RoostCircle.prototype.resize = function(e, callObj)
{
    var p = getMouse(e, this.canvas);
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    this.r = Math.sqrt(dx*dx + dy*dy);
    this.radiusHandle.moveTo(p.x, p.y);
    this.redraw();
};

RoostCircle.prototype.finishResize = function(e, callObj)
{
    this.strokeOpacity = 1;
    this.redraw();
    this.canvas.onmousemove = null;
};

//--------------------
// Drag
//--------------------
RoostCircle.prototype.startDrag = function(e, callObj)
{
    this.canvas = getCanvas(callObj);
    this.canvas.onmousemove = bindEvent(this, "drag");
    document.onmouseup = bindEvent(this, "finishDrag");

    var p = getMouse(e, this.canvas);
    this.offsetx = p.x - this.x;
    this.offsety = p.y - this.y;
    this.strokeOpacity = .5;
    this.redraw();
};

RoostCircle.prototype.drag = function(e, callObj)
{
    var p = getMouse(e, this.canvas);    
    var dx = p.x - this.offsetx - this.x;
    var dy = p.y - this.offsety - this.y;

    this.move(dx, dy);
    this.deleteHandle.move(dx, dy);
    this.radiusHandle.move(dx, dy);
    this.redraw();
};

RoostCircle.prototype.finishDrag = function(e, callObj)
{
    this.strokeOpacity = 1;
    this.redraw();
    this.canvas.onmousemove = null;
};

function getCanvas(elt)
{
    for ( ; elt.parentNode; elt=elt.parentNode)
    {
	if (elt.getAttribute("class") == "canvas")
	    return elt;
    }
    return null;
}


//------------------------------------------------------------------------
// pointsToCircle
//------------------------------------------------------------------------

function pointsToCircle(p)
{
    if (p.length < 3)
    {
	throw new Error("Not enough control points");
    }

    var p1 = p[0];
    var p2 = p[1];
    var p3 = p[2];

    // A is the perpendicular bisector of p1 and p2
    //   It goes through mid12 with slope -dx12/dy12
    // B is the perpendicular bisector of p2 and p3
    
    var mid12, dx12, dy12;
    var mid23, dx23, dy23;
    var slopeA, slopeB, interceptA, interceptB;
    var done = false;
    
    while (! done)
    {
	mid12 = new Point((p1.x + p2.x)/2, (p1.y + p2.y)/2);
	mid23 = new Point((p2.x + p3.x)/2, (p2.y + p3.y)/2);
	
	dx12 = p2.x - p1.x;
	dy12 = p2.y - p1.y;
		
	dx23 = p3.x - p2.x;
	dy23 = p3.y - p2.y;

	if (dx12 == dx23 && dy12 == dy23)
	{
	    alert("Error: points must not be collinear");
	    return;
	}

	done = true;

	if (dy12 == 0 && dy23 == 0)
	{
	    alert("Error: points are collinear");
	    return;
	}
	else if (dy12 == 0)
	{
	    // swap p2 and p3 so 13 becomes the vertical segment
	    var tmp = p2;
	    p2 = p3;
	    p3 = tmp;
	    done = false;
	}
	else if (dy23 == 0)
	{
	    // swap p1 and p2 so 13 becomes the vertical segment
	    var tmp = p1;
	    p1 = p2;
	    p2 = tmp;
	    done = false;
	}
    }

    slopeA = -dx12/dy12;
    interceptA = mid12.y - slopeA*mid12.x;

    slopeB = -dx23/dy23;
    interceptB = mid23.y - slopeB*mid23.x;

    if (Math.abs(slopeA - slopeB) < .001)
    {
	alert("Error: points are collinear");
	return;
    }

    var cx, cy, r;
    cx = (interceptB - interceptA)/(slopeA - slopeB);
    cy = slopeA*cx + interceptA;
    r  = Math.sqrt((p1.x - cx)*(p1.x - cx) + (p1.y - cy)*(p1.y - cy));

    return new RoostCircle(cx, cy, r);
};


//------------------------------------------------------------------------
// RoostTool
//------------------------------------------------------------------------

function RoostTool()
{
    this.svgElements = [document.getElementById("svgDZ"), 
			document.getElementById("svgVR"),
			document.getElementById("svgSW")];

    this.canvasElements = [document.getElementById("canvasDZ"),
			   document.getElementById("canvasVR"),
			   document.getElementById("canvasSW")];

    this.circles = [];
    this.controlPoints = [];
    this.markers = [];

    // AJAX call to get list of frames and then navigate to initial frame

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    this.xmlhttp = xmlhttp;
    xmlhttp.onreadystatechange = bindEvent(this, "getFrameCallback");
	
	var station = gup('station');
	var year = gup('year');
	var month = gup('month');
	var day = gup('day');
	var url_php_request = "getFrames.php?station=" + station + "&year=" + year + "&month=" + month+ "&day=" + day;
	
	
    xmlhttp.open("GET",url_php_request,true);
    xmlhttp.send();
}

RoostTool.prototype.getFrameCallback = function() {
    if (this.xmlhttp.readyState==4 && this.xmlhttp.status==200)
    {
	this.frames = JSON.parse(this.xmlhttp.responseText);
	this.frame = 0;
	this.loadFrame(this.frame);
    }
};

RoostTool.prototype.loadFrame = function(idx) {

    var XX = ["DZ", "VR", "SW"];
    var station = gup('station');
	var year = gup('year');
	var month = gup('month');
	if (month < 10) { month = "0" + month;}
	var day = gup('day');
	if (day < 10) { day = "0" + day;}
	
    for (var i = 0; i < XX.length; i++)
    {
	var url = "image/" + station + year + month + day + "_" + this.frames[idx] + "_V04_" + XX[i] + ".mapl.gif";
	var elt = document.getElementById("img" + XX[i]);
	elt.src = url;
    }
};

RoostTool.prototype.prevFrame = function() {
    if (this.frame > 0 )
    {
	this.loadFrame(--this.frame);
    }
};

RoostTool.prototype.nextFrame = function() {
    if (this.frame < this.frames.length - 1 )
    {
	this.loadFrame(++this.frame);
    }
};

RoostTool.prototype.threePointMode = function(){
    for (var i = 0; i < this.canvasElements.length; i++)
    {
	this.canvasElements[i].onmousedown = bindEvent(this, "threePointClick");
    }
};

RoostTool.prototype.threePointClick = function(event, obj) {

    var p = getMouse(event, obj);

    if (this.controlPoints.length >= 3)
    {
	throw new Error("too many existing control points");
    }

    var mark = new CircleMarker(p.x, p.y);
    
    for (var i = 0; i < this.svgElements.length; i++) {
	mark.draw(this.svgElements[i]);
    }

    this.controlPoints.push(p);
    this.markers.push(mark);

    if (this.controlPoints.length == 3)
    {
	var c = pointsToCircle(this.controlPoints);

	if (c)
	{
	    for (var i = 0; i < this.svgElements.length; i++) {
		c.draw(this.svgElements[i]);
	    }
	    this.circles.push(c);
	}

	for (var i=0; i < this.markers.length; i++)
	{
	    this.markers[i].undraw();
	}
	this.controlPoints = [];
	this.markers = [];
    }
};

//------------------------------------------------------------------------
// initialization
//------------------------------------------------------------------------
var tool;
function init()
{
    GetBrowserInfo();
    tool = new RoostTool();
    tool.threePointMode();
    document.onkeydown = keydown;    
}

function keydown(e)
{
    if (e.keyCode == 39)
    {
	next();
	return false;
    }
    else if (e.keyCode == 37)
    {
	prev();
	return false;
    }
}

function prev()
{
    tool.prevFrame();
}

function next()
{
    tool.nextFrame();
}


function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}