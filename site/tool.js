// BEGIN GLOBALS COPIED FROM LabelMe my_scripts.js
// RETHINK AND REORGANIZE THESE
var bname;
var bversion;

function bookmark_us(url, title)
{
	if (window.sidebar) // firefox
	{
		window.sidebar.addPanel(title, url, "");
	}
	else if(window.opera && window.print) // opera
	{ 
		var elem = document.createElement('a');
		elem.setAttribute('href',url);
		elem.setAttribute('title',title);
		elem.setAttribute('rel','sidebar');
		elem.click();
	}
	else if(document.all)// ie
	{
		window.external.AddFavorite(url, title);
	}
}


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
    };
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

function RoostCircle(cx, cy, r, roostSequence)
{
	cx = parseFloat(cx.toFixed(3));
	cy = parseFloat(cy.toFixed(3));
	r = parseFloat(r.toFixed(3));
    Circle.call(this, cx, cy, r);
    this.deleteHandle = new XMarker(cx, cy, 8);
    this.radiusHandle = new CircleMarker(cx, cy - r);
	this.roostSequence = roostSequence;
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
RoostCircle.prototype.drawDeleteHandle = function(obj){
	this.deleteHandle.draw(obj);
    this.deleteHandle.listen("onmousedown", this, "remove");
    this.deleteHandle.setStyle("cursor", "pointer");
};


RoostCircle.prototype.redraw = function()
{
    this.deleteHandle.redraw();
    this.radiusHandle.redraw();
    Circle.prototype.redraw.call(this);
};

RoostCircle.prototype.undraw = function()
{
    this.deleteHandle.undraw();
    this.radiusHandle.undraw();
    Circle.prototype.undraw.call(this);
};

RoostCircle.prototype.remove = function(e)
{    
    this.undraw();
	if(this.strokeColor == "red")
	{
		this.roostSequence.circles[this.roostSequence.tool.frame] = null;
		if(this.roostSequence.tool.frame == this.roostSequence.seq_start){
			this.roostSequence.seq_start++;
		}else{
			this.roostSequence.seq_end--;
		}
		
		this.roostSequence.locallyChanged = 1;
	}
	
	if(this.strokeColor == "grey" && this.roostSequence.tool.frame == this.roostSequence.seq_end +1){
		this.roostSequence.proCircleEnd = 0;
	}
	
	if(this.strokeColor == "grey" && this.roostSequence.tool.frame == this.roostSequence.seq_start -1){
		this.roostSequence.proCircleStart = 0;
	}
	this.roostSequence.updateInfoBox();
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
    
    this.canvas.onmousemove = null;
	if(this.strokeColor == "grey")
	{
		this.strokeColor = "red";
		if(tool.frame !=0 && tool.frame != tool.frames_DV.length-1)
			this.deleteHandle.undraw();
		this.roostSequence.insertCircle(this, tool.frame);
	}
	//we need ot update the info box so the user can save changes 
	this.roostSequence.locallyChanged = 1;
	this.roostSequence.updateInfoBox();
	this.redraw();
	document.onmouseup = null;
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

    this.move(parseFloat(dx.toFixed(3)), parseFloat(dy.toFixed(3)));
    this.deleteHandle.move(dx, dy);
    this.radiusHandle.move(dx, dy);
    this.redraw();
};

RoostCircle.prototype.finishDrag = function(e, callObj)
{
    this.strokeOpacity = 1;
    
    this.canvas.onmousemove = null;
	if(this.strokeColor == "grey")
	{
		this.strokeColor = "red";
		if(tool.frame !=0 && tool.frame != tool.frames_DV.length-1)
			this.deleteHandle.undraw();
		this.roostSequence.insertCircle(this, tool.frame);
		
		this.roostSequence.updateInfoBox();
	}
	this.redraw();
	this.roostSequence.locallyChanged = 1;

	//wrong -> if the first circle is dragged, the location label in the infoBox need to be changed
	//actually we need to update infobox everytime 
	//if(this.roostSequence.tool.frame==this.roostSequence.seq_start)
	this.roostSequence.updateInfoBox();
	document.onmouseup = null;
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
	    return 0;
	}

	done = true;

	if (dy12 == 0 && dy23 == 0)
	{
	    alert("Error: points are collinear");
	    return 0;
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
		return 0;
    }

    var cx, cy, r;
    cx = (interceptB - interceptA)/(slopeA - slopeB);
    cy = slopeA*cx + interceptA;
    r  = Math.sqrt((p1.x - cx)*(p1.x - cx) + (p1.y - cy)*(p1.y - cy));
	if (r >= 250)
	{
		alert("Error: Radius must be less than 250px");
		return 0;
	}

    return new RoostCircle(cx, cy, r);
}

//------------------------------------------------------------------------
// RoostSequence
//------------------------------------------------------------------------

function RoostSequence(frameNum, circle)
{
	this.seq_start = frameNum;
	this.seq_end = frameNum;
	this.tool = window.tool;
	this.proCircleStart = 1;
	this.proCircleEnd = 1;
	this.sequenceId = null;
	this.locallyChanged = 0;
	this.sequenceIndex = this.tool.sequenceIndex;
	this.comments = null;
	this.circles = [];
	if(frameNum != null){
		this.circles[frameNum] = circle;
		if(frameNum == 0)
			this.proCircleStart = 0;
		if(frameNum == tool.frames_DV.length -1 )
			this.proCircleEnd = 0;
	}
}

RoostSequence.prototype.updateInfoBox = function() 
{
	//if the infobox isn't exist, create one and add it to the info panel
	if(document.getElementById(this.sequenceIndex) == null){
		addInfoBox(this.sequenceIndex);
	}

	//keep the infoBox associated with this.RoostSequence in a variable
	var infoBoxElement = document.getElementById(this.sequenceIndex);
	var infoBoxId = document.getElementById("infoBoxId_"+this.sequenceIndex);
	var infoBoxXcoord = document.getElementById("xcoord_"+this.sequenceIndex);
	var infoBoxYcoord = document.getElementById("ycoord_"+this.sequenceIndex);
	var infoBoxFirstTime = document.getElementById("firstTime_"+this.sequenceIndex);
	var infoBoxLastTime = document.getElementById("lastTime_"+this.sequenceIndex);
	var infoBoxExtendBackwardLink = document.getElementById("extendBackwardLink_"+this.sequenceIndex);
	var infoBoxExtendForwardLink = document.getElementById("extendForwardLink_"+this.sequenceIndex);
	var infoBoxComments = document.getElementById("comments_"+this.sequenceIndex);
	var infoBoxSave = document.getElementById("save_"+this.sequenceIndex);
	var infoBoxRevert = document.getElementById("revert_"+this.sequenceIndex);
	var infoBoxDelete = document.getElementById("delete_"+this.sequenceIndex);

	//sequenceId will be null when it is newly created during the current session and the user haven't saved it yet
	// therefore we don't have a unique id for the sequence yet.
	if (this.sequenceId != null){
		infoBoxId.innerHTML = this.tool.station+"_"+this.tool.year+this.tool.month+this.tool.day+"_"+this.sequenceId;
	}


	//update location label
	infoBoxXcoord.innerHTML = parseInt(this.circles[this.seq_start].x);
	infoBoxYcoord.innerHTML = parseInt(this.circles[this.seq_start].y);
	
	/*test
	if (this.seq_start == null)
	{	var mm;}
	else if (tool.frames_timeStamp == null){
		var mm;
	}else if ( infoBoxFirstTime.innerHTML == null){
		var mm;
	}else if(infoBoxFirstTime == null){
		var mm;
	}
	*/
	
	

	//update the first time & last time
	var firstTime = tool.frames_timeStamp[this.seq_start];
	var firstTimeParsed = firstTime.substring(0,2) + ":" + firstTime.substring(2,4) + ":" + firstTime.substring(4,6);
	var lastTime = tool.frames_timeStamp[this.seq_end];
	var lastTimeParsed = lastTime.substring(0,2) + ":" + lastTime.substring(2,4) + ":" + lastTime.substring(4,6);
	infoBoxFirstTime.innerHTML = firstTimeParsed;
	infoBoxLastTime.innerHTML = lastTimeParsed;

	//update extend links
	if(this.proCircleEnd){
		infoBoxExtendForwardLink.innerHTML = "still editing ...";
		infoBoxExtendForwardLink.setAttribute('disabled', 'disabled');
		infoBoxExtendForwardLink.setAttribute('href', '');
		infoBoxExtendForwardLink.setAttribute('onclick', 'return false');
	}else{
		infoBoxExtendForwardLink.onclick = bindEvent(this, "extendForward");
		infoBoxExtendForwardLink.innerHTML = "extend forward";
		infoBoxExtendForwardLink.removeAttribute('disabled');
	}
		
	if(this.proCircleStart){
		infoBoxExtendBackwardLink.innerHTML = "still editing ...";
		infoBoxExtendBackwardLink.setAttribute('disabled', 'disabled');
		infoBoxExtendBackwardLink.setAttribute('href', '');
		infoBoxExtendBackwardLink.setAttribute('onclick', 'return false');
	}else{
		infoBoxExtendBackwardLink.onclick = bindEvent(this, "extendBackward");
		infoBoxExtendBackwardLink.innerHTML = "extend backward";
		infoBoxExtendBackwardLink.removeAttribute('disabled');
	}

	



	//infoBoxComments.textarea.onchange = alert2;

	//update comments
	infoBoxComments.textarea.onkeyup = bindEvent(this, "onKeyDownOnComments");

	infoBoxComments.textarea.onchange = bindEvent(this, "onChangeOnComments");

	//if(this.comments != null)
		infoBoxComments.textarea.value = this.comments;
	

	//update save button
	if(this.locallyChanged){
		infoBoxSave.removeAttribute('disabled');
		//infoBoxSave.setAttribute('onclick', 'alert("binding")');
		infoBoxSave.onclick = bindEvent(this, "saveEvent");

		infoBoxRevert.removeAttribute('disabled');
		infoBoxRevert.onclick = bindEvent(this, "revertEvent" );


	}else{
		infoBoxSave.setAttribute('disabled', 'disabled');
		infoBoxRevert.setAttribute('disabled', 'disabled');
	}
	
	infoBoxDelete.onclick = bindEvent(this, "deleteEvent");

};

RoostSequence.prototype.onKeyDownOnComments = function(){
	var infoBoxComments = document.getElementById("comments_"+this.sequenceIndex);
	var infoBoxSave = document.getElementById("save_"+this.sequenceIndex);
	var infoBoxRevert = document.getElementById("revert_"+this.sequenceIndex);

	if(this.comments != infoBoxComments.textarea.value){
		this.locallyChanged = 1;
		infoBoxComments.textarea.onkeyup = null;
		
		infoBoxSave.removeAttribute('disabled');
		infoBoxSave.onclick = bindEvent(this, "saveEvent");
		infoBoxRevert.removeAttribute('disabled');
		infoBoxRevert.onclick = bindEvent(this, "revertEvent" );	
	}
};

RoostSequence.prototype.onChangeOnComments= function(){
	var infoBoxComments = document.getElementById("comments_"+this.sequenceIndex);
	this.comments = infoBoxComments.textarea.value;
	this.locallyChanged = 1;	
};



RoostSequence.prototype.saveRoostSequence = function() 
{

	var xmlString = "<?xml version='1.0'?>"
					+ "<roost>"
					+ "<station>"
					+ this.tool.station
					+ "</station>"
					+ "<year>"
					+ this.tool.year
					+ "</year>"
					+ "<month>"
					+ this.tool.month
					+ "</month>"
					+ "<day>"
					+ this.tool.day
					+ "</day>"
					+ "<comments>"
					+ this.comments
					+ "</comments>"
					+ "<userId>annonymous</userId>";

	if (this.sequenceId == null){
		xmlString += "<sequenceId>null</sequenceId>";
	}else{
		xmlString += "<sequenceId>"
					 + this.sequenceId
					 + "</sequenceId>";

	}
	for(var i = 0; i < this.circles.length; i++){
		if(this.circles[i] != null){
			xmlString += "<circle>"
					+ "<x>"
					+ this.circles[i].x
					+ "</x>"
					+ "<y>"
					+ this.circles[i].y
					+ "</y>"
					+ "<r>"
					+ this.circles[i].r
					+ "</r>"
					+ "<frameNumber>"
					+ i
					+ "</frameNumber>"
					+ "</circle>";
		}
	}

	xmlString += "</roost>";

	var url = "ajax/save_roost.php";

	xmlhttp= new XMLHttpRequest();
	
	xmlhttp.open("POST", url, true);
	
	
	// Tell the server you're sending it XML
	xmlhttp.setRequestHeader("Content-Type", "text/xml");
	
	// Set up a function for the server to run when it's done
	xmlhttp.onreadystatechange = bindEvent(this, "saveRoostSequenceCallBack");

	
	
	// Send the request
	xmlhttp.send(xmlString);

};

RoostSequence.prototype.saveRoostSequenceCallBack = function(){
	
	if(xmlhttp.readyState ==4 && xmlhttp.status ==200){
		this.sequenceId = trim(xmlhttp.responseText);
		document.getElementById("infoBoxId_"+this.sequenceIndex).innerHTML = this.tool.station+"_"+this.tool.year+this.tool.month+this.tool.day+"_"+this.sequenceId;
	}
};


RoostSequence.prototype.insertCircle = function(circle, frameNumber) 
{
	this.circles[frameNumber] = circle;
	if(this.proCircleEnd && this.circles[frameNumber - 1] != null)
	{
		this.seq_end++;
	}
	else if (this.proCircleStart && this.circles[frameNumber + 1] != null)
	{
		this.seq_start--;
	}
};

RoostSequence.prototype.saveEvent = function() 
{
	this.proCircleEnd = 0;
	this.proCircleStart = 0;
	this.locallyChanged = 0;
	this.saveRoostSequence();
	this.updateInfoBox();
};

RoostSequence.prototype.revertEvent = function() 
{
	if (this.sequenceId != null)
	{
		//this.deleteEvent();
		//this.tool.deleteRoostSequence(this.sequenceIndex);
		this.circles = [];
		this.proCircleStart = 0;
		this.proCircleEnd = 0;
		this.retrieveRoostSequence();
		this.locallyChanged = 0;
		this.updateInfoBox();
	}
	else 
	{
		this.deleteEvent();
	}
	this.tool.updateCanvas();
	this.tool.updateButtons();
};

RoostSequence.prototype.retrieveRoostSequence = function() 
{
	
	var url = "ajax/retrieve_roost.php?sequenceID="+this.sequenceId;
	

	xmlhttp= new XMLHttpRequest();
	
	xmlhttp.open("GET", url, false);
	
	// Tell the server you're sending it XML
	//xmlhttp.setRequestHeader("Content-Type", "text/xml");
	
	// Set up a function for the server to run when it's done
	//xmlhttp.onreadystatechange = bindEvent(this, "retrieveRoostSequenceCallBack");
	
	// Send the request
	xmlhttp.send();
	this.retrieveRoostSequenceCallBack();
};

RoostSequence.prototype.retrieveRoostSequenceCallBack = function(){
	
		var xmlDoc = xmlhttp.responseXML;
		
		//create circles 
		//newSequence.comments = sequences[sequenceIndex].getElementsByTagName("Comments")[0].textContent;
		this.comments = xmlDoc.getElementsByTagName("comments")[0].textContent;
		
		c = xmlDoc.getElementsByTagName("circle");
		for(var i = 0; i< c.length; i++){
			
			var x = c[i].getElementsByTagName("X")[0].childNodes[0].nodeValue;
			x = parseFloat(x);
			var y = c[i].getElementsByTagName("Y")[0].childNodes[0].nodeValue;
			y = parseFloat(y);
			var r = c[i].getElementsByTagName("R")[0].childNodes[0].nodeValue;
			r = parseFloat(r);
			var frameNumber = c[i].getElementsByTagName("FrameNumber")[0].childNodes[0].nodeValue;
			frameNumber = parseInt(frameNumber);
			var circle = new RoostCircle(x, y, r, this);
			this.insertCircle(circle, frameNumber);
			if (i == 0)
			{
				this.seq_start = frameNumber;
			}
			this.seq_end = frameNumber;
		}
};


RoostSequence.prototype.deleteEvent = function() 
{
	//ajax call to delete from the backend	
	if(this.sequenceId != null){
		var url = "ajax/deleteSequence.php?sequenceID="+this.sequenceId;
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",url,true);
		xmlhttp.send();	
		
		//this.ajaxDeleteRoost();
		xmlhttp.onreadystatechange=function() {	
			if (xmlhttp.readyState==4 && xmlhttp.status==200){					
				if (xmlhttp.responseText.trim() != "1")
				{
					alert("Error: Roost Sequence failed to be deleted");
					return;
				}
			}
		}
	}
	//delete infoBox
	this.deleteInfoBox();	

	//remove the data structure of this roost sequence
	//delete from the canvas
	this.tool.deleteRoostSequence(this.sequenceIndex);

};

RoostSequence.prototype.deleteInfoBox = function(){
	var infoPanelElement = document.getElementById("infoPanel");
	var len = infoPanelElement.childNodes.length;
	var indx;
	for(var i = 0 ; i < len; i++){
		if (this.sequenceIndex == 0)
			indx = "0";
		else
			indx = this.sequenceIndex;
		if(infoPanelElement.childNodes[i].id != undefined && infoPanelElement.childNodes[i].id == indx){
			infoPanelElement.removeChild(infoPanelElement.childNodes[i]);
			break;
		}
		
	}
};


RoostSequence.prototype.extendForward = function() 
{
	if (this.seq_end  < this.tool.frames_DV.length - 1 )
    {
		this.tool.moveToFrame(this.seq_end + 1);
		this.proCircleEnd = 1;
		this.tool.updateCanvas();
		this.updateInfoBox();
		this.tool.updateButtons();
    }
};

RoostSequence.prototype.extendBackward = function() 
{
    if (this.seq_start  > 0 )
	{
		this.tool.moveToFrame(this.seq_start - 1);
		this.proCircleStart = 1;
		this.tool.updateCanvas();
		this.updateInfoBox();
		this.tool.updateButtons();    }

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

    //this.annotations = [];
	this.roostSeqObj = [];
	this.activeCircles = [];
	this.controlPoints = [];
	this.markers = [];
	this.sequenceIndex = 0;
	this.hiddenCircles = 0;
    // AJAX call to get list of frames and then navigate to initial frame

    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
		var xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    this.xmlhttp = xmlhttp;
    //xmlhttp.onreadystatechange = bindEvent(this, "getFrameCallback");
	
	this.station = document.getElementById("station_select").value;
	this.year = document.getElementById("year_select").value;
	this.month = document.getElementById("month_select").value;
	this.day = document.getElementById("day_select").value;
	
	var url_php_request = "ajax/frame_list.php?station=" + this.station + "&year=" + this.year + "&month=" + this.month+ "&day=" + this.day;
	xmlhttp.open("GET",url_php_request,false);
    xmlhttp.send();
	
	
	//call back 	
	//---------------------------------------------
	var ajaxStr = trim(xmlhttp.responseText);
	
	var ajaxArr_DV = ajaxStr.split('&&')[0].split('~');
	var ajaxArr_VR = ajaxStr.split('&&')[1].split('~');
	var ajaxArr_SW = ajaxStr.split('&&')[2].split('~');
	var ajaxArr_timeStamp = ajaxStr.split('&&')[3].split('~');
		
	this.frames_DV = ajaxArr_DV;
	this.frames_VR = ajaxArr_VR;
	this.frames_SW = ajaxArr_SW;
	this.frames_timeStamp = ajaxArr_timeStamp;
	
	
	this.frame = 0; 
	this.loadFrame(this.frame);
	//------------------------------------------

	document.getElementById("frameSpan").style.visibility = "visible";


	//var station = gup('station');
	//var year = gup('year');
	//var month = gup('month');
	//var day = gup('day');
		
	document.getElementById("visibility_select").onchange = visibilityChange;
	visibilityChange();
    
	//Set up the bookmark link.
	var bookmarkLink = document.getElementById("bookmarkLink");
	var urlTitle = "Roost Site -- station:"+this.station+" year:"+this.year+" month:"+this.month+" day:"+this.day;
	var url = "javascript:bookmark_us('"+ location.protocol + location.host + location.pathname +"?station="+this.station+"&year="+this.year+"&month="+this.month+"&day="+this.day+"',\'"+urlTitle+"')";
	bookmarkLink.setAttribute("href",url);
	
	//Get Sequences Information.
	this.getSequences();
};

RoostTool.prototype.resetToolObject = function(){
	//empty the infoPanel
	document.getElementById("infoPanel").innerHTML = "";
	

	//undraw all circles
	for(var i = 0; i < this.activeCircles.length; i++)
	{
		if(this.activeCircles[i] != null)
		   this.activeCircles[i].undraw();
	}
	//empty the activeCircle array
	this.activeCircles = [];
	
	//reset Sequence Objects
	this.roostSeqObj = [];


	//reset sequence index 
	this.sequenceIndex = 0;

    // AJAX call to get list of frames and then navigate to initial frame
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
	var xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    this.xmlhttp = xmlhttp;
    //xmlhttp.onreadystatechange = bindEvent(this, "getFrameCallback");
	
	this.station = document.getElementById("station_select").value;
	this.year = document.getElementById("year_select").value;
	this.month = document.getElementById("month_select").value;
	this.day = document.getElementById("day_select").value;
	
	var url_php_request = "ajax/frame_list.php?station=" + this.station + "&year=" + this.year + "&month=" + this.month+ "&day=" + this.day;
	xmlhttp.open("GET",url_php_request,false);
    xmlhttp.send();
	

	//call back 	
	//---------------------------------------------
	var ajaxStr = trim(xmlhttp.responseText);
	
	var ajaxArr_DV = ajaxStr.split('&&')[0].split('~');
	var ajaxArr_VR = ajaxStr.split('&&')[1].split('~');
	var ajaxArr_SW = ajaxStr.split('&&')[2].split('~');
	var ajaxArr_timeStamp = ajaxStr.split('&&')[3].split('~');
		
	this.frames_DV = ajaxArr_DV;
	this.frames_VR = ajaxArr_VR;
	this.frames_SW = ajaxArr_SW;
	this.frames_timeStamp = ajaxArr_timeStamp;
	
	
	this.frame = 0; 
	this.loadFrame(this.frame);
	//------------------------------------------




	//var station = gup('station');
	//var year = gup('year');
	//var month = gup('month');
	//var day = gup('day');
	
	
	document.getElementById("visibility_select").onchange = visibilityChange;
	visibilityChange();
    
	//Set up the bookmark link.
	var bookmarkLink = document.getElementById("bookmarkLink");
	var urlTitle = "Roost Site -- station:"+this.station+" year:"+this.year+" month:"+this.month+" day:"+this.day;
	var url = "javascript:bookmark_us('"+ location.protocol + location.host + location.pathname +"?station="+this.station+"&year="+this.year+"&month="+this.month+"&day="+this.day+"',\'"+urlTitle+"')";
	bookmarkLink.setAttribute("href",url);
	
	//Get Sequences Information.
	this.getSequences();
};

RoostTool.prototype.getSequences = function() {
	var xmlDoc;
	tool = 	this;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp=new XMLHttpRequest();
    }else{
		// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
	var url = "ajax/get_roosts.php?station=" + this.station +"&year=" + this.year + "&month=" + this.month + "&day=" + this.day;    
	xmlhttp.open("GET", url ,false);
    xmlhttp.send();
	
    
	
    
		
	xmlDoc = xmlhttp.responseXML;
	var sequences = xmlDoc.childNodes[0].childNodes;
	for(var sequenceIndex = 0; sequenceIndex < sequences.length; sequenceIndex++)
	{
		var sequenceEnd = 0;
		var newSequence = new RoostSequence(null, null);
		newSequence.proCircleStart = 0;
		newSequence.proCircleEnd = 0;
		newSequence.sequenceId = sequences[sequenceIndex].getElementsByTagName("SequenceID")[0].textContent; 
		newSequence.comments = sequences[sequenceIndex].getElementsByTagName("Comments")[0].textContent;
		if (newSequence.comments == "null")
			newSequence.comments = "";
		
		var circles = sequences[sequenceIndex].getElementsByTagName("Circle");
		for(var circleIndex = 0; circleIndex < circles.length; circleIndex++)
		{
			var x = circles[circleIndex].getElementsByTagName("X")[0].textContent;
			var y = circles[circleIndex].getElementsByTagName("Y")[0].textContent;
			var r = circles[circleIndex].getElementsByTagName("R")[0].textContent;
			var frameNumber = circles[circleIndex].getElementsByTagName("FrameNumber")[0].textContent;
			x = parseFloat(x);
			y = parseFloat(y);
			r = parseFloat(r);
			frameNumber = parseInt(frameNumber);
			if (circleIndex == 0)
			{
				newSequence.seq_start = frameNumber;
			}
			sequenceEnd = frameNumber;
			var newCircle = new RoostCircle(x, y, r, newSequence);
			newSequence.circles[frameNumber] = newCircle;
		}
		newSequence.seq_end = sequenceEnd;
		tool.roostSeqObj[tool.sequenceIndex] = newSequence;
		tool.sequenceIndex++;
		newSequence.updateInfoBox();
	}
	tool.updateCanvas();

	
};


function visibilityChange() {
	var visible = document.getElementById("visibility_select").value;
	if (visible == 1) 
	{
		//change the width of canvas
		document.getElementById("wrapper").style.width = "1240px";

		document.getElementById("imgDZ").style.display = "block";
		document.getElementById("imgVR").style.display = "none";
		document.getElementById("imgSW").style.display = "none";
	}
	if (visible == 2) 
	{
		//change the width of canvas
		document.getElementById("wrapper").style.width = "1240px";

		document.getElementById("imgDZ").style.display = "block";
		document.getElementById("imgVR").style.display = "block";
		document.getElementById("imgSW").style.display = "none";
	}
	if (visible == 3)
	{
		//change the width of canvas
		document.getElementById("wrapper").style.width = "1860px";

		document.getElementById("imgDZ").style.display = "block";
		document.getElementById("imgVR").style.display = "block";
		document.getElementById("imgSW").style.display = "block";
	}
};

RoostTool.prototype.updateCanvas = function() 
{
	//undraw all circles in the activeCircle array
	for(var i = 0; i < this.activeCircles.length; i++)
	{
		if(this.activeCircles[i] != null)
		   this.activeCircles[i].undraw();
	}
	//empty the activeCircle array
	this.activeCircles = [];
	
	//draw all circles that belongs to this frame number
	for(var roostSequenceIndex = 0; roostSequenceIndex < this.roostSeqObj.length; roostSequenceIndex++)
	{
		var curRoostSeq = this.roostSeqObj[roostSequenceIndex];
		if ( curRoostSeq != null){
			
			
			if (curRoostSeq.circles[this.frame] != null)
			{
				for (var i = 0; i < this.svgElements.length; i++) 
				{
					curRoostSeq.circles[this.frame].draw(this.svgElements[i]);
				}
				this.activeCircles.push(curRoostSeq.circles[this.frame]);
			}
			else if(curRoostSeq.proCircleEnd && this.frame == curRoostSeq.seq_end + 1)
			{
				if (curRoostSeq.circles[this.frame - 1] != null)
				{
					var proCircle = clone(curRoostSeq.circles[this.frame - 1]);//new RoostCircle(curRoostSeq.circles[this.frame - 1].x, curRoostSeq.circles[this.frame - 1].y, curRoostSeq.circles[this.frame - 1].r, curRoostSeq);		
					proCircle.strokeColor = "grey";
					//proCircle.radiusHandle.fill = "grey";
					//proCircle.deleteHandle.strokeColor = "grey";
					for (var i = 0; i < this.svgElements.length; i++) 
					{
						proCircle.draw(this.svgElements[i]);
					}
					this.activeCircles.push(proCircle);
				}
			}
			else if (curRoostSeq.proCircleStart && this.frame == curRoostSeq.seq_start - 1)
			{
				if (curRoostSeq.circles[this.frame + 1] != null)
				{
					
					var proCircle = clone(curRoostSeq.circles[this.frame +1]);//new RoostCircle(curRoostSeq.circles[this.frame + 1].x, curRoostSeq.circles[this.frame + 1].y, curRoostSeq.circles[this.frame + 1].r, curRoostSeq);		
					proCircle.strokeColor = "grey";
					//proCircle.radiusHandle.fill = "red";
					//proCircle.deleteHandle.strokeColor = "red";
					for (var i = 0; i < this.svgElements.length; i++) 
					{
						proCircle.draw(this.svgElements[i]);
					}
					this.activeCircles.push(proCircle);
				}		
			}
			//var m = curRoostSeq.circles[this.frame].deleteHandle.rendering.length;
			if(curRoostSeq.circles[this.frame] != null)
				curRoostSeq.circles[this.frame].deleteHandle.undraw();
			var len = 0;
			for(var i = 0 ; i < curRoostSeq.circles.length; i++){
				if (curRoostSeq.circles[i] != null)
					len++;
			}
			
			if(len > 1)
			{
				if (curRoostSeq.circles[0] != null && this.frame == 0)
				{
					for (var i = 0; i < this.svgElements.length; i++)
					{
						curRoostSeq.circles[this.frame].drawDeleteHandle(this.svgElements[i]);	
					}					
				}
				else if (curRoostSeq.circles[curRoostSeq.tool.frames_DV.length-1] != null && this.frame == curRoostSeq.tool.frames_DV.length-1)
				{
					for (var i = 0; i < this.svgElements.length; i++)
					{
						curRoostSeq.circles[this.frame].drawDeleteHandle(this.svgElements[i]);	
					}
				}
			
				
				if(!curRoostSeq.proCircleStart && curRoostSeq.proCircleEnd)
				{
					if (this.frame == curRoostSeq.seq_start)
						for (var i = 0; i < this.svgElements.length; i++) {
							curRoostSeq.circles[this.frame].drawDeleteHandle(this.svgElements[i]);	
						}
				}
				else if(curRoostSeq.proCircleStart && !curRoostSeq.proCircleEnd)
				{
					if (this.frame == curRoostSeq.seq_end)
						for (var i = 0; i < this.svgElements.length; i++) {
							curRoostSeq.circles[this.frame].drawDeleteHandle(this.svgElements[i]);	
						}
				}
				else if(!curRoostSeq.proCircleStart && !curRoostSeq.proCircleEnd)
				{
					if (this.frame == curRoostSeq.seq_start || this.frame == curRoostSeq.seq_end)
						for (var i = 0; i < this.svgElements.length; i++) {
							curRoostSeq.circles[this.frame].drawDeleteHandle(this.svgElements[i]);	
						}
				}	
			}
			
		}
	}
	
};

RoostTool.prototype.saveAll = function() {
	for(var sequenceIndex in this.roostSeqObj)
	{
		if (this.roostSeqObj[sequenceIndex] != null && this.roostSeqObj[sequenceIndex].locallyChanged == 1)
		{
			this.roostSeqObj[sequenceIndex].saveEvent();
		}
	}
	this.updateButtons();
};

RoostTool.prototype.resetAll = function() {
	var frameNumber = this.frame;
	this.resetToolObject();
	this.updateButtons();
	this.moveToFrame(frameNumber);
	this.updateCanvas();
};

RoostTool.prototype.updateButtons = function() {
	
	for(var i = 0 ; i < this.roostSeqObj.length; i++){
		if(this.roostSeqObj[i] != null && this.roostSeqObj[i].locallyChanged){
			document.getElementById("saveAllButton").removeAttribute('disabled');
			document.getElementById("resetButton").removeAttribute('disabled');
			return;
		}
	}
	document.getElementById("saveAllButton").setAttribute('disabled', 'disabled');
	document.getElementById("resetButton").setAttribute('disabled', 'disabled');
};


RoostTool.prototype.deleteRoostSequence = function(roostSequenceindex) 
{
	this.roostSeqObj[roostSequenceindex] = null;
	
	//bug if decrement
	//this.sequenceIndex--;

	//update canvas
	this.updateCanvas();
};



RoostTool.prototype.moveToFrame = function(frameNum) {
	this.loadFrame(frameNum);
	this.frame = frameNum;
};

RoostTool.prototype.getFrameCallback = function() {
    if (this.xmlhttp.readyState==4 && this.xmlhttp.status==200)
    {
		
		var ajaxStr = trim(this.xmlhttp.responseText);
	
		var ajaxArr_DV = ajaxStr.split('&&')[0].split('~');
		var ajaxArr_VR = ajaxStr.split('&&')[1].split('~');
		var ajaxArr_SW = ajaxStr.split('&&')[2].split('~');
		var ajaxArr_timeStamp = ajaxStr.split('&&')[3].split('~');
		
		this.frames_DV = ajaxArr_DV;
		this.frames_VR = ajaxArr_VR;
		this.frames_SW = ajaxArr_SW;
		this.frames_timeStamp = ajaxArr_timeStamp;
	
	
		this.frame = 0; 
		this.loadFrame(this.frame);
    }
};

RoostTool.prototype.loadFrame = function(idx) {

    var XX = ["DZ", "VR", "SW"];
	var framesImages = [];
	framesImages[0] = this.frames_DV[idx];
	framesImages[1] = this.frames_VR[idx];
	framesImages[2] = this.frames_SW[idx];
    
	for (var i = 0; i < XX.length; i++)
    {
		var img_url = framesImages[i];
		var elt = document.getElementById("img" + XX[i]);
		elt.src = img_url;
    }

	var prev = document.getElementById("prev");
	var next = document.getElementById("next");

	if (this.frame == 0)
	{
		prev.setAttribute("disabled", "true");
	}
	else
	{
		prev.removeAttribute("disabled");
	}

	if (this.frame >= this.frames_DV.length - 1)
	{
		next.setAttribute("disabled", "true");
	}
	else
	{
		next.removeAttribute("disabled");
	}
	
	var frameSpan = document.getElementById("frameSpan");
	frameSpan.innerHTML = "Frame " + this.frame + " of " + (this.frames_DV.length - 1);
};

RoostTool.prototype.prevFrame = function() {
    if (this.frame > 0 )
    {
		this.loadFrame(--this.frame);
		this.updateCanvas();
    }
};

RoostTool.prototype.nextFrame = function() {
    if (this.frame < this.frames_DV.length - 1 )
    {
		this.loadFrame(++this.frame);
		this.updateCanvas();
    }
};

function setThreePointMode(){
	tool.threePointMode();
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
	// create a new Circle object (modify this to create a new RoostSequence object instead)
		var c = pointsToCircle(this.controlPoints); 
		//var c2 = clone(c);
		if (c)
		{
			//no need to create a new roost circle; we can use var c 
			//roostC = new RoostCircle(c.x, c.y, c.r, this);
			
			var newRoostSequence =new RoostSequence(this.frame, c); 
			this.roostSeqObj.push(newRoostSequence);
			c.roostSequence = newRoostSequence;
			//The newRoostSequence has not been saved yet.
			newRoostSequence.locallyChanged = 1;
			this.sequenceIndex++;
			//canvas need to draw the new circle only... no need to update the canvas;Jafer
			//this.updateCanvas();
			for (var i = 0; i < this.svgElements.length; i++) 
			{
				//c2.draw(this.svgElements[i]);
				c.draw(this.svgElements[i]);
			}
			c.deleteHandle.undraw();
			this.activeCircles.push(c);
			c.roostSequence.updateInfoBox();
			this.updateButtons();
			for (var i = 0; i < this.canvasElements.length; i++)
			{
				this.canvasElements[i].onmousedown = "";
			}
		}
		

		for (var i=0; i < this.markers.length; i++)
		{
			this.markers[i].undraw();
		}
		this.controlPoints = [];
		this.markers = [];
    }
};

function hideCircles(){
	if(!tool.hiddenCircles)
	{
		document.getElementById('svgDZ').style.visibility = 'hidden';
		document.getElementById('svgVR').style.visibility = 'hidden';
		document.getElementById('svgSW').style.visibility = 'hidden';
		tool.hiddenCircles = 1;
	}
	else
	{
		document.getElementById('svgDZ').style.visibility = 'visible';
		document.getElementById('svgVR').style.visibility = 'visible';
		document.getElementById('svgSW').style.visibility = 'visible';
		tool.hiddenCircles = 0;
	}
};

//------------------------------------------------------------------------
// initialization
//------------------------------------------------------------------------

function RoostToolInit()
{
    GetBrowserInfo();
    if (tool != null){
		//var prevActiveCircles = tool.activeCircles; 
		//tool = new RoostTool();
		//tool.activeCircles = prevActiveCircles;
		//update canvas
		//tool.updateCanvas();
		//tool.threePointMode();
		tool.resetToolObject();
		
	}else{
		tool = new RoostTool();
	}
    document.onkeydown = keydown;    
	

	document.getElementById("saveAllButton").style.display = "inline";
	document.getElementById("resetButton").style.display = "inline";


	document.getElementById("saveAllButton").onclick = bindEvent(tool, "saveAll");
	document.getElementById("resetButton").onclick = bindEvent(tool, "resetAll");


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
    }else {
		return true;
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

function trim (str, charlist) {
    // Strips whitespace from the beginning and end of a string  
    // 
    // version: 1004.2314
    // discuss at: http://phpjs.org/functions/trim
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6
    var whitespace, l = 0, i = 0;
    str += '';
    
    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }
    
    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }
    
    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    
    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}



//-----------------------------------------------------------------------
// Global function: clone()
//----------------------------------------------------------------------

function clone(obj){

	var mmm = obj.constructor.toString();
    if(obj == null || typeof(obj) != 'object' || obj.constructor.toString().match(/function RoostSequence/i) || obj.constructor.toString().match(/\[object HTMLDivElement/i))

        return obj;

    var temp = new obj.constructor(); // changed (twice)

    for(var key in obj)

        temp[key] = clone(obj[key]);

    return temp;

}

//------------------------------------------------------------------------
// Global Function: addInfoBox();
//------------------------------------------------------------------------


function addInfoBox(infoBoxIndx){
	var infoPanel = document.getElementById("infoPanel");	
	var newInfoBox = document.createElement("div");
	newInfoBox.setAttribute('class', "infoBox");
	newInfoBox.setAttribute('id', infoBoxIndx);
	
	//td[table#][tr#]#
	var table1 = document.createElement("table");
	var table2 = document.createElement("table");
	
	
	//first table
	var tr11 = document.createElement("tr");
	var tr12 = document.createElement("tr");
	var tr13 = document.createElement("tr");

	var td111 = document.createElement("td");
	td111.setAttribute('id', "infoBoxId_"+infoBoxIndx);
	td111.innerHTML = "unsaved_"+infoBoxIndx;
	
	var td112 = document.createElement("td");
	
	td112.innerHTML = "Location( <span id=\"xcoord_" + infoBoxIndx + "\">0</span> ,<span id=\"ycoord_" + infoBoxIndx + "\">0</span> )";
	
	tr11.appendChild(td111);
	tr11.appendChild(td112);
	

	tr12.innerHTML = "<td>First Appears:<span id=\"firstTime_" + infoBoxIndx + "\">00:00:00</span></td><td>(<a id=\"extendBackwardLink_" + infoBoxIndx + "\" href=\"\">still editing...</a>)</td>";
	
	tr13.innerHTML = "<td>Last Appears:<span id=\"lastTime_" + infoBoxIndx + "\">24:59:59</span></td><td>(<a id=\"extendForwardLink_" + infoBoxIndx + "\" href=\"\">still editing...</a>)</td>";
	

	//second table
	var tr21 = document.createElement("tr");
	var tr22 = document.createElement("tr");
	var tr23 = document.createElement("tr");

	tr21.innerHTML = "<td>Comments:</td>";
	tr22.innerHTML = "<td><form id=\"comments_" + infoBoxIndx + "\"><textarea  name=\"textarea\" cols=\"40\" rows=\"5\"></textarea></form></td>";
	tr23.innerHTML = "<td><button class=\"button\" type=\"button\" id=\"delete_" + infoBoxIndx + "\">Delete</button>"
		+ "<button class=\"button\" type=\"button\" id=\"revert_" + infoBoxIndx + "\">Revert</button>"
		+ "<button class=\"button\" type=\"button\" id=\"save_" + infoBoxIndx + "\">Save</button>"
		+ "</td>";	


	table1.appendChild(tr11);
	table1.appendChild(tr12);	
	table1.appendChild(tr13);	


	table2.appendChild(tr21);
	table2.appendChild(tr22);	
	table2.appendChild(tr23);	


	newInfoBox.appendChild(table1);
	newInfoBox.appendChild(table2);
	

	infoPanel.appendChild(newInfoBox);
        
}
