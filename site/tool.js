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
function bindEvent(obj, method, options) {

	if (!options) options = {};
    return function(e) {
		options.pageElement = this;
		e = getEvent(e);
		var ret = obj[method](e, options);
		stopPropagation(e);
		if (options.passthru) 
			return ret;
		else
			return false;
    };
}


//------------------------------------------------------------------------
// Interface Graphic
//------------------------------------------------------------------------

function Graphic(x, y, scale)
{
    this.x = x;
    this.y = y;
    this.renderings = [];
	this.scale = scale ? scale : 1;
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

Graphic.prototype.setScale = function(scale)
{
	this.scale = scale;
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
    this.strokeWidth = 6;
    this.strokeOpacity = 1;
    this.strokeColor = "red";
    this.fill = "none";
    this.fillOpacity = 1; 
	this.fixedScale = false;
	this.fixedStrokeWidth = true;
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

	var r = circle.r;
	if (circle.fixedScale) r = (r/circle.scale).toFixed(8);

	var strokeWidth = circle.strokeWidth;
	if (circle.fixedStrokeWidth) strokeWidth = strokeWidth/circle.scale;

    svgCircle.setAttributeNS(null, "cx", circle.x);
    svgCircle.setAttributeNS(null, "cy", circle.y);
    svgCircle.setAttributeNS(null, "r",  r);
    svgCircle.setAttributeNS(null, "fill",         circle.fill);
    svgCircle.setAttributeNS(null, "fill-opacity", circle.fillOpacity);
    svgCircle.setAttributeNS(null, "stroke",       circle.strokeColor);
    svgCircle.setAttributeNS(null, "stroke-width", strokeWidth);
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

    this.strokeWidth = 6;
    this.strokeColor = "red";
    this.opacity = 1;

	this.fixedScale = true;
	this.fixedStrokeWidth = false;
}
inherits(XMarker, Graphic);

XMarker.prototype.newRendering = function(parentElt)
{
    return new SVGx(parentElt, this);
};


//------------------------------------------------------------------------
// class SVGx: an x marker
//------------------------------------------------------------------------

function SVGx(parentElt, graphicObj)
{
    Rendering.call(this, parentElt, graphicObj);

    var svgNS = "http://www.w3.org/2000/svg";    
    var mark = graphicObj;

    this.renderElt = document.createElementNS(svgNS, "g");
    this.renderElt.setAttributeNS(null, "transform", 'translate(' + mark.x + ',' + mark.y + ')');

	var scale = (1/graphicObj.scale).toFixed(4);
    this.scaleElt = document.createElementNS(svgNS, "g");
    this.scaleElt.setAttributeNS(null, "transform", 'scale(' + scale + ')');

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

    this.scaleElt.appendChild(this.line1);
    this.scaleElt.appendChild(this.line2);

	this.renderElt.appendChild(this.scaleElt);

    parentElt.appendChild(this.renderElt);    
}
inherits(SVGx, Rendering);

SVGx.prototype.render = function(svgText)
{
    var mark = this.graphicObj;

    this.renderElt.setAttributeNS(null, "transform", 'translate(' + mark.x + ',' + mark.y + ')');

	var scale = 1;
	if (mark.fixedScale) scale = (1/mark.scale).toFixed(4);
	
	var strokeWidth = mark.strokeWidth;
	if (mark.fixedStrokeWidth) strokeWidth = (mark.strokeWidth/mark.scale).toFixed(4);
	
    this.scaleElt.setAttributeNS(null, "transform", 'scale(' + scale + ')');
    this.renderElt.setAttributeNS(null, "stroke-width", strokeWidth);
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
    Circle.call(this, x, y, 6);
    this.strokeWidth = 0;
    this.fill = this.strokeColor;
	this.fixedScale = true;
	this.fixedStrokeWidth = false;
}
inherits(CircleMarker, Circle);

//------------------------------------------------------------------------
// class RoostCircle: a circle that can be edited
//------------------------------------------------------------------------

function RoostCircle(cx, cy, r, roostSequence, scale)
{
    cx = parseFloat(cx.toFixed(3));
    cy = parseFloat(cy.toFixed(3));
    r = parseFloat(r.toFixed(3));
    Circle.call(this, cx, cy, r);
    this.deleteHandle = new XMarker(cx, cy, 12);
    this.radiusHandle = new CircleMarker(cx, cy - r);
    this.roostSequence = roostSequence;
	this.setScale(scale ? scale : 1);
}
inherits(RoostCircle, Circle);

RoostCircle.prototype.clone = function()
{
    return new RoostCircle(this.x, this.y, this.r, this.roostSequence, this.scale);
}

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

RoostCircle.prototype.setScale = function(scale)
{
    this.deleteHandle.setScale(scale);
    this.radiusHandle.setScale(scale);
    Circle.prototype.setScale.call(this, scale);
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
    if (this.roostSequence.signalRemove(this)) 
        this.undraw();
};

RoostCircle.prototype.isProvisional = function()
{
	return this.strokeColor == "grey";
}

//--------------------
// Resize
//--------------------
RoostCircle.prototype.startResize = function(e, options)
{
    this.canvas = getCanvas(options.pageElement);
    this.canvas.onmousemove = bindEvent(this, "resize");
    this.strokeOpacity = .5;
    document.onmouseup = bindEvent(this, "finishResize");
    this.redraw();
};

RoostCircle.prototype.resize = function(e, options)
{
    var p = tool.viewportToImage(getMouse(e, this.canvas));
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    this.r = Math.sqrt(dx*dx + dy*dy);
    this.radiusHandle.moveTo(p.x, p.y);
    this.redraw();
};

RoostCircle.prototype.finishResize = function(e, options)
{
    this.strokeOpacity = 1;
    this.canvas.onmousemove = null;
    this.roostSequence.signalEdit(this);
    this.redraw();
    document.onmouseup = null;
};

//--------------------
// Drag
//--------------------
RoostCircle.prototype.startDrag = function(e, options)
{
    this.canvas = getCanvas(options.pageElement);
    this.canvas.onmousemove = bindEvent(this, "drag");
    document.onmouseup = bindEvent(this, "finishDrag");

    var p = tool.viewportToImage(getMouse(e, this.canvas));
    this.offsetx = p.x - this.x;
    this.offsety = p.y - this.y;
    this.strokeOpacity = .5;
    this.redraw();
};

RoostCircle.prototype.drag = function(e)
{
    var p = tool.viewportToImage(getMouse(e, this.canvas));
    var dx = p.x - this.offsetx - this.x;
    var dy = p.y - this.offsety - this.y;

    this.move(parseFloat(dx.toFixed(3)), parseFloat(dy.toFixed(3)));
    this.deleteHandle.move(dx, dy);
    this.radiusHandle.move(dx, dy);
    this.redraw();
};

RoostCircle.prototype.finishDrag = function(e)
{
    this.strokeOpacity = 1;
    this.canvas.onmousemove = null;
    this.roostSequence.signalEdit(this);
    this.redraw();
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
// InfoBox: 
//   helper class to generate the information box HTML element
//   for RoostSequence (see below)
//------------------------------------------------------------------------
function InfoBox(){

    var template = document.getElementById("infoBoxTemplate");
	var parent = template.parentNode;

    this.infoBoxElt = template.cloneNode(true);
    this.infoBoxElt.setAttribute("class", "dynamic");
    this.infoBoxElt.setAttribute("id", "");
    this.infoBoxElt.style.visibility = "visible";
    parent.appendChild(this.infoBoxElt);

    this.sequenceId = getElementByClassName("sequenceId", this.infoBoxElt);
    this.xcoord = getElementByClassName("xcoord", this.infoBoxElt);
    this.ycoord = getElementByClassName("ycoord", this.infoBoxElt);
    this.lat = getElementByClassName("lat", this.infoBoxElt);
    this.lon = getElementByClassName("lon", this.infoBoxElt);
    this.firstTimeLink = getElementByClassName("firstTimeLink", this.infoBoxElt);
	this.firstTimeStamp = getElementByClassName("firstTimeStamp", this.infoBoxElt);
	this.firstTimeSunrise = getElementByClassName("firstTimeSunrise", this.infoBoxElt);
    this.lastTimeLink = getElementByClassName("lastTimeLink", this.infoBoxElt);
	this.lastTimeStamp = getElementByClassName("lastTimeStamp", this.infoBoxElt);
	this.lastTimeSunrise = getElementByClassName("lastTimeSunrise", this.infoBoxElt);
    this.lastTime = getElementByClassName("lastTime", this.infoBoxElt);
    this.extendBackward = getElementByClassName("extendBackward", this.infoBoxElt);
    this.extendForward = getElementByClassName("extendForward", this.infoBoxElt);
    this.comments = getElementByClassName("comments", this.infoBoxElt);
    this.saveButton = getElementByClassName("saveButton", this.infoBoxElt);
    this.revertButton = getElementByClassName("revertButton", this.infoBoxElt);
    this.deleteButton = getElementByClassName("deleteButton", this.infoBoxElt);
}

//------------------------------------------------------------------------
// RoostSequence
//------------------------------------------------------------------------

function RoostSequence()
{
    this.seq_start = Infinity;
    this.seq_end = -Infinity;
    this.tool = tool;
    this.proCircleStart = 1;
    this.proCircleEnd = 1;
    this.databaseID = null;
    this.locallyChanged = 0;
    this.comments = null;
    this.circles = [];
    this.activeCircles = [];
}

RoostSequence.prototype.destroy = function()
{
	this.deleteInfoBox();
    for(var i = 0; i < this.activeCircles.length; i++)
		this.activeCircles[i].undraw();	
}

RoostSequence.prototype.populateFromJSON = function(jsonSeq)
{
	this.proCircleStart = 0;
	this.proCircleEnd = 0;
	this.databaseID = jsonSeq.sequence_id;
	this.comments = jsonSeq.comments;
	
	for (var j = 0; j < jsonSeq.circles.length; j++)
	{
		var x = parseFloat(jsonSeq.circles[j].x);
		var y = parseFloat(jsonSeq.circles[j].y);
		var r = parseFloat(jsonSeq.circles[j].r);
		var frame_number = this.tool.scantime2frameidx(jsonSeq.circles[j].scan_time);
		var c = new RoostCircle(x, y, r, this, this.tool.scale);
		this.insertCircle(c, frame_number);
	}
};

RoostSequence.prototype.toJSONString = function()
{
	var obj = {};

	obj.sequence_id = this.databaseID;
	obj.comments = this.comments;
	obj.circles = [];

    for(var i = this.seq_start; i <= this.seq_end; i++)
	{
		var c = this.circles[i];
		var scan_time = this.tool.frameidx2scantime(i);
		var cobj = {'scan_time':scan_time, 'x':c.x, 'y':c.y, 'r':c.r};
		obj.circles.push(cobj);
	}
	
	return JSON.stringify(obj);
};


RoostSequence.prototype.insertCircle = function(circle, frameNumber, alreadyActiveFlag) 
{
    this.circles[frameNumber] = circle;

	if (alreadyActiveFlag == null || ! alreadyActiveFlag)
		this.activeCircles.push(circle);
	
	if (frameNumber < this.seq_start) 
		this.seq_start = frameNumber;

	if (frameNumber > this.seq_end) 
		this.seq_end = frameNumber;
	
};

// Called when a circle is dragged or resized
RoostSequence.prototype.signalEdit = function(circle)
{
    if(circle.strokeColor == "grey")
    {
        circle.strokeColor = "red";
        this.insertCircle(circle, this.tool.frame, true);
    }
    this.locallyChanged = 1;
    this.updateInfoBox();
    this.tool.updateButtons();
};


// Called when the delete handle of a circle is clicked. 
//
//   - Returns true if the circle should be deleted. 
// 
//   - It may return false if this removal would trigger the removal
//     of the RoostSequence, but the user does not confirm that delete
RoostSequence.prototype.signalRemove = function(circle)
{
	var framenum = this.tool.frame;
	
	if (framenum == this.seq_start && framenum == this.seq_end)
	{
		return this.deleteEvent();
	}
	else if(framenum == this.seq_start - 1)
	{
		if (! circle.isProvisional()) { alert("Invalid remove");}
		this.proCircleStart = 0;
	}
	else if(framenum == this.seq_start)
	{
		if (circle.isProvisional()) { alert("Invalid remove");}
		this.seq_start++;
		this.circles[framenum] = null;
		this.locallyChanged = 1;
	}
	else if (framenum == this.seq_end)
	{
		if (circle.isProvisional()) { alert("Invalid remove");}
		this.seq_end--;
		this.circles[framenum] = null;
		this.locallyChanged = 1;
	}
	else if(framenum == this.seq_end + 1)
	{
		if (! circle.isProvisional()) { alert("Invalid remove");}
		this.proCircleEnd = 0;
	}
	else
	{
		alert("Invalid remove");
	}
    
    this.updateInfoBox();
    return true;
}

RoostSequence.prototype.updateCanvas = function(frame, panes) 
{   
    // undraw all active circles
    for(var i = 0; i < this.activeCircles.length; i++)
		this.activeCircles[i].undraw();

    this.activeCircles = [];    

    // Determine which circle object, if any, to draw in this frame
    var circle = null;
    if (frame >= this.seq_start && frame <= this.seq_end)
    {
        circle = this.circles[frame];
    }
    else if (this.proCircleEnd && frame == this.seq_end + 1)
    {
        circle = this.circles[frame - 1].clone();
        circle.strokeColor = "grey";                
    }
    else if (this.proCircleStart && frame == this.seq_start - 1)
    {
        circle = this.circles[frame + 1].clone();
        circle.strokeColor = "grey";                
    }
    
    // Draw the circle
    if (circle != null)
    {
        for (var i = 0; i < panes.length; i++) 
        {
            circle.draw(panes[i].svg);
            
            // disable delete handle for "interior" frames
            if (frame > this.seq_start && frame < this.seq_end)
            {
                circle.deleteHandle.undraw();
            }
        }
        this.activeCircles.push(circle);
    }
};

RoostSequence.prototype.newInfoBox = function()
{
    if(this.infoBox != null)
	{
		alert("ERROR: this.infoBox should be null!");
		return;
	}
	this.infoBox = new InfoBox(this.id);
	this.updateInfoBox();
}

/*------------------------------------------------------------
 * updateInfoBox: render info box
 *------------------------------------------------------------*/
RoostSequence.prototype.updateInfoBox = function() 
{
    if (this.databaseID != null){
        this.infoBox.sequenceId.innerHTML = this.databaseID;
    }
	else
	{
		this.infoBox.sequenceId.innerHTML = "<i>unsaved</i>";
	}

	var loc = {x: this.circles[this.seq_start].x,
			   y: this.circles[this.seq_start].y };

	var longlat = this.tool.pixel_to_longlat(loc);

	var lon = longlat.x;
	var lat = longlat.y;

    // update location label
    this.infoBox.xcoord.innerHTML = this.circles[this.seq_start].x.toFixed(0);
    this.infoBox.ycoord.innerHTML = this.circles[this.seq_start].y.toFixed(0);

	this.infoBox.lon.href = "http://maps.google.com?q=" + lat.toFixed(8) + "," + lon.toFixed(8);
	this.infoBox.lat.href = "http://maps.google.com?q=" + lat.toFixed(8) + "," + lon.toFixed(8);
    this.infoBox.lon.innerHTML = lon.toFixed(4);
    this.infoBox.lat.innerHTML = lat.toFixed(4);
    
    // update the first time & last time
	var frame = this.tool.frames[this.seq_start];
    this.infoBox.firstTimeStamp.onclick = bindEvent(this, "moveToFirst");
    this.infoBox.firstTimeStamp.innerHTML = frame.scan_time;
    this.infoBox.firstTimeSunrise.onclick = bindEvent(this, "moveToFirst");
	this.infoBox.firstTimeSunrise = frame.minutes_from_sunrise;

	frame = this.tool.frames[this.seq_end];
    this.infoBox.lastTimeStamp.onclick = bindEvent(this, "moveToLast");
    this.infoBox.lastTimeStamp.innerHTML = frame.scan_time;
    this.infoBox.lastTimeSunrise.onclick = bindEvent(this, "moveToLast");
	this.infoBox.lastTimeSunrise = frame.minutes_from_sunrise;

	this.infoBox.extendBackward.onclick = bindEvent(this, "extendBackward");
	this.infoBox.extendForward.onclick = bindEvent(this, "extendForward");

    // update extend links
    if(this.proCircleEnd) {
        this.infoBox.extendForward.setAttribute('disabled', 'disabled');
    }
    else {
        this.infoBox.extendForward.removeAttribute('disabled');
    }
    
    if(this.proCircleStart) {
        this.infoBox.extendBackward.setAttribute('disabled', 'disabled');
    }
    else{
        this.infoBox.extendBackward.removeAttribute('disabled');
    }

    //update comments
    this.infoBox.comments.textbox.onkeydown = function(e) {stopPropagation(e); return true;}
    this.infoBox.comments.textbox.onkeyup = bindEvent(this, "onKeyDownOnComments");
    this.infoBox.comments.textbox.onchange = bindEvent(this, "onChangeOnComments");
    this.infoBox.comments.textbox.value = this.comments;
    
    //update buttons
    if(this.locallyChanged){
        this.infoBox.saveButton.removeAttribute('disabled');
        this.infoBox.saveButton.onclick = bindEvent(this, "saveEvent");
        if (this.databaseID != null)
        {
            this.infoBox.revertButton.removeAttribute('disabled');
        }
        else
        {
            this.infoBox.revertButton.setAttribute('disabled', 'disabled');
        }
        this.infoBox.revertButton.onclick = bindEvent(this, "revertEvent" );

    }
    else {
        this.infoBox.saveButton.setAttribute('disabled', 'disabled');
        this.infoBox.revertButton.setAttribute('disabled', 'disabled');
    }

    this.infoBox.deleteButton.onclick = bindEvent(this, "deleteEvent");
};

RoostSequence.prototype.onKeyDownOnComments = function()
{   
    if(this.comments != this.infoBox.comments.textbox.value){
        this.locallyChanged = 1;
        this.infoBox.comments.textbox.onkeyup = null;
        
        this.infoBox.saveButton.removeAttribute('disabled');
        this.infoBox.saveButton.onclick = bindEvent(this, "saveEvent");
        this.infoBox.revertButton.removeAttribute('disabled');
        this.infoBox.revertButton.onclick = bindEvent(this, "revertEvent" );    
		this.tool.updateButtons();
    }
};

RoostSequence.prototype.onChangeOnComments= function(){
    this.comments = this.infoBox.comments.textbox.value;
    this.locallyChanged = 1;
	this.tool.updateButtons();
};

RoostSequence.prototype.saveRoostSequence = function() 
{
	var roostString = this.toJSONString();

	var url = "ajax/save_roost.php?station=" + this.tool.station + "&year=" + this.tool.year + "&month=" + this.tool.month + "&day=" + this.tool.day;

	xmlhttp= new XMLHttpRequest();	
	xmlhttp.open("POST", url, false);
	xmlhttp.setRequestHeader("Content-Type", "text/plain");
	xmlhttp.send(roostString);
	var retval = JSON.parse(xmlhttp.responseText);
	this.databaseID = retval.sequence_id;
};

RoostSequence.prototype.saveEvent = function()
{
	var confirmation=confirm("Would you like to save?");
	if (confirmation) this.save();
	this.infoBox.saveButton.blur();
	return confirmation;
};

RoostSequence.prototype.save = function()
{
	this.proCircleEnd = 0;
	this.proCircleStart = 0;
	this.locallyChanged = 0;
	this.saveRoostSequence();
	this.updateInfoBox();
};

RoostSequence.prototype.revertEvent = function() 
{
	var confirmation=confirm("Would you like to revert?");
	if (confirmation) this.revert();
	this.infoBox.revertButton.blur();
	return confirmation;
};

RoostSequence.prototype.revert = function() 
{
	if (this.databaseID == null)
	{
		alert("Error: cannot revert unsaved RoostSequence");
	}

    this.seq_start = Infinity;
    this.seq_end = -Infinity;
    this.proCircleStart = 0;
    this.proCircleEnd = 0;
    this.locallyChanged = 0;
    this.circles = [];

	this.retrieveRoostSequence();
	this.updateInfoBox();
	this.tool.updateCanvas();
	this.tool.updateButtons();
}

RoostSequence.prototype.deleteEvent = function() 
{
	this.infoBox.deleteButton.blur();
	var confirmation=confirm("Would you like to delete?");
	if (confirmation == true) { 
		this._delete(); 
	}
	return confirmation;
};

RoostSequence.prototype._delete = function() 
{
	// ajax call to delete from the backend  
	if(this.databaseID != null){
		var url = "ajax/delete_roost.php?sequence_id="+this.databaseID;

		xmlhttp = ajax_get(url);
		if (xmlhttp.responseText.trim() != "1")
		{
			alert("Error: Roost Sequence failed to be deleted");
			return;
		}
	}
	this.tool.removeSequence(this);
};

RoostSequence.prototype.setScale = function(scale) 
{
	for (var i = this.seq_start; i <= this.seq_end; i++)
		this.circles[i].setScale(scale);

	for (var i = 0; i < this.activeCircles.length; i++)
	{
		this.activeCircles[i].setScale(scale);
		this.activeCircles[i].redraw();
	}

};

RoostSequence.prototype.retrieveRoostSequence = function() 
{
    var url = "ajax/get_roosts.php?sequence_id="+this.databaseID;
	xmlhttp = ajax_get(url);
    var sequences = JSON.parse(xmlhttp.responseText);
	this.populateFromJSON(sequences[0]);
};


RoostSequence.prototype.deleteInfoBox = function() {    
    if (this.infoBox != null)
    {
        var parent = this.infoBox.infoBoxElt.parentNode;
        parent.removeChild(this.infoBox.infoBoxElt);
        this.infoBox = null;
    }
};

RoostSequence.prototype.moveToFirst = function() 
{
	this.tool.moveToFrame(this.seq_start);
}

RoostSequence.prototype.moveToLast = function() 
{
	this.tool.moveToFrame(this.seq_end);
}

RoostSequence.prototype.extendForward = function() 
{
    if (this.seq_end  < this.tool.frames.length - 1 )
    {
        this.tool.moveToFrame(this.seq_end + 1);
        this.proCircleEnd = 1;
        this.tool.updateCanvas();
        this.updateInfoBox();
		this.infoBox.extendForward.blur();
        this.tool.updateButtons();
    }
};

RoostSequence.prototype.extendBackward = function(e, options) 
{
    if (this.seq_start  > 0 )
    {
        this.tool.moveToFrame(this.seq_start - 1);
        this.proCircleStart = 1;
        this.tool.updateCanvas();
        this.updateInfoBox();
		this.infoBox.extendBackward.blur();
        this.tool.updateButtons();
	}
};

//------------------------------------------------------------------------
// RadarPane
//  - Renders the pane of a RoostTool
//------------------------------------------------------------------------

function RadarPane(station, products, defaultProduct, tool)
{
	this.products = products; // general info about available products
	this.frameInfo = null;		// info about products for this frame

    var template = document.getElementById("radarPaneTemplate");
	var parent = template.parentNode;

	this.elt = template.cloneNode(true);
	this.elt.setAttribute("class", "radarPane dynamic");
    parent.appendChild(this.elt);

	this.mapImage = getElementByClassName("mapImage", this.elt);
	this.mapImage.src = "static-maps/" + station + ".gif";

	this.radarImage = getElementByClassName("radarImage", this.elt);
    this.canvas = getElementByClassName("canvas", this.elt);
    this.scaleGroup = getElementByClassName("scaleGroup", this.elt);
    this.translateGroup = getElementByClassName("translateGroup", this.elt);
    this.svg = getElementByClassName("svg", this.elt);
    this.resetZoom = getElementByClassName("resetZoom",  this.elt);
    this.zoomIn   = getElementByClassName("zoomIn",   this.elt);
    this.zoomOut  = getElementByClassName("zoomOut",  this.elt);
    this.panNorth = getElementByClassName("panNorth", this.elt);
    this.panSouth = getElementByClassName("panSouth", this.elt);
    this.panEast  = getElementByClassName("panEast",  this.elt);
    this.panWest  = getElementByClassName("panWest",  this.elt);

	// Install handlers

	this.canvas.onmousedown = bindEvent(tool, "startDragCanvas");

	this.resetZoom.onclick    = bindEvent(tool, "resetZoom");
	this.zoomIn.onmousedown   = bindEvent(tool, "zoomIn");
	this.zoomOut.onmousedown  = bindEvent(tool, "zoomOut");

	this.panNorth.onmousedown = bindEvent(tool, "panNorth");
	this.panSouth.onmousedown = bindEvent(tool, "panSouth");
	this.panEast.onmousedown  = bindEvent(tool, "panEast");
	this.panWest.onmousedown  = bindEvent(tool, "panWest");

	this.productSelect = getElementByClassName("productSelect", this.elt);
	this.options = {};
	for (var prod in products)
	{
		var option = document.createElement('option');
		option.setAttribute("value", prod);
		if (prod == defaultProduct)
		{
			option.setAttribute("selected", "selected");
		}
		option.innerHTML = products[prod];
		this.productSelect.appendChild(option);
		this.options[prod] = option;
	}
	this.productSelect.onchange = bindEvent(this, "selectProduct");
	this.imageSize = tool.imageSize;
}

RadarPane.prototype.updateFrame = function(frameInfo)
{
	this.frameInfo = frameInfo;

	// Update the dropdown in case the available products have changed
	for (var prod in this.products)
	{
		if (frameInfo.products[prod] == null)
		{
			this.options[prod].setAttribute("disabled", "disabled");
		}
	}
	
	var url = frameInfo.products[this.productSelect.value];
	
	if (url != null)
		this.radarImage.src = url;
	else 
		this.radarImage.src = "";

	this.updateVisibility();
};

RadarPane.prototype.selectProduct = function()
{
	var prod = this.productSelect.value;
	if (this.frameInfo == null || this.frameInfo.products[prod] == null)
		this.radarImage.src = "";
	else
		this.radarImage.src = this.frameInfo.products[prod];
	this.productSelect.blur();
};


RadarPane.prototype.updateTransform = function(scale, origin)
{
	var transform = "scale(" + scale + ")";
	this.scaleGroup.setAttributeNS(null, "transform", transform);

	var w = Math.round(this.imageSize.x*scale) + "px";
	var h = Math.round(this.imageSize.y*scale) + "px";

	this.mapImage.style.width  = w;
	this.mapImage.style.height = h;

	this.radarImage.style.width  = w;
	this.radarImage.style.height = h;

	var dx = Math.round(origin.x);
	var dy = Math.round(origin.y);

	var transform = "translate(" + dx + "," + dy + ")";
	this.translateGroup.setAttributeNS(null, "transform", transform);

	this.mapImage.style.left = dx + "px";
	this.mapImage.style.top  = dy + "px";

	this.radarImage.style.left = dx + "px";
	this.radarImage.style.top  = dy + "px";
};

RadarPane.prototype.updateVisibility = function()
{
	this.svg.style.visibility = document.getElementById("circleToggle").checked ? "visible" : "hidden";
	this.mapImage.style.visibility = document.getElementById("mapToggle").checked ? "visible" : "hidden";
};

RadarPane.prototype.reset = function()
{
	var parent = this.elt.parentNode;
	parent.removeChild(this.elt);
}

/*------------------------------------------------------------------------
 * Class RoostTool
 *------------------------------------------------------------------------*/

/*--------------------------------------------------
 * Constructor
 *--------------------------------------------------*/
function RoostTool()
{
    this.station = document.getElementById("station_select").value;
    this.year = document.getElementById("year_select").value;
    this.month = document.getElementById("month_select").value;
    this.day = document.getElementById("day_select").value;    
    this.roostSeqObj = [];
    this.activeCircles = [];
    this.controlPoints = [];
    this.markers = [];
    this.sequenceIndex = 0;

    document.getElementById("saveAllButton").setAttribute('disabled', 'disabled');
    document.getElementById("resetButton").setAttribute('disabled', 'disabled');

	this.ajaxInit();			// get data from server

	this.defaultProducts = ["DZ_0.5_DEG", "VR_0.5_DEG", "SW_0.5_DEG"];
	this.nPanes = 2;
	this.panes = [];	

	this.imageSize = {x: 600, y: 600};
	var viewport = document.getElementById("viewport");
	this.viewportSize = {x: viewport.offsetWidth, y: viewport.offsetHeight};

	this.origin = {x:0, y:0};	// location of image origin in viewport coordinates
	this.scale = 1;
	this.zoomFactor = 1.2;
	this.panStep = 30;

	for (var i = 0; i < this.nPanes; i++)
	{
		this.panes[i] = new RadarPane(this.station, this.products, this.defaultProducts[i], this);
	}

	this.resetZoom();
	this.moveToTime(-30);
}

// convert from viewport coordinates to image coordinates
RoostTool.prototype.viewportToImage = function(p)
{
	q = {};
	q.x = (p.x - this.origin.x)/this.scale;
	q.y = (p.y - this.origin.y)/this.scale;
	return q;
};

// convert from image coordinates to viewport coordinates
RoostTool.prototype.imageToViewport = function(p)
{
	q = {};
	q.x = p.x*this.scale + this.origin.x;
	q.y = p.y*this.scale + this.origin.y;
	return q;
};


RoostTool.prototype.resetZoom = function()
{
	this.scale = 1;
	this.setCenter({x: this.imageSize.x/2, y:this.imageSize.y/2});
	this.updateTransform();
}

// set viewport center in image coordinates
RoostTool.prototype.setCenter = function(p)
{
	var viewportCenter = {x: this.viewportSize.x/2, y: this.viewportSize.y/2};

	// adjust origin so q is at center
	q = this.imageToViewport(p);
	this.origin.x += viewportCenter.x - q.x;
	this.origin.y += viewportCenter.y - q.y;
};

RoostTool.prototype.getCenter = function()
{
	// get image coordinates for viewport center

	var viewportCenter = {x: this.viewportSize.x/2, 
						  y: this.viewportSize.y/2};
	return this.viewportToImage(viewportCenter);
};

RoostTool.prototype.zoomTo = function(scale)
{
	// zoom around the center
	var center = this.getCenter();
	this.scale = scale;
	this.setCenter(center);
	this.updateTransform();
};

RoostTool.prototype.zoomIn = function()
{
	this.zoomTo(this.scale*this.zoomFactor);
};

RoostTool.prototype.zoomOut = function()
{
	this.zoomTo(this.scale/this.zoomFactor);
};

RoostTool.prototype.panNorth = function() { 
	this.origin.y -= this.panStep;
	this.updateTransform();
};

RoostTool.prototype.panSouth = function() { 
	this.origin.y += this.panStep;
	this.updateTransform();
};

RoostTool.prototype.panEast = function() { 
	this.origin.x += this.panStep;
	this.updateTransform();
};

RoostTool.prototype.panWest = function() { 
	this.origin.x -= this.panStep;
	this.updateTransform();
};

RoostTool.prototype.updateTransform = function()
{
	for (var i = 0; i < this.roostSeqObj.length; i++)
		this.roostSeqObj[i].setScale(this.scale);

	for (var i = 0; i < this.panes.length; i++)
	{
		this.panes[i].updateTransform(this.scale, this.origin);
	}
};

RoostTool.prototype.startDragCanvas = function(e, options)
{
    this.canvas = options.pageElement;
    this.canvas.onmousemove = bindEvent(this, "dragCanvas");
    document.onmouseup = bindEvent(this, "finishDragCanvas");
	
	this.canvas.style.cursor = "-moz-grabbing";

    var p = getMouse(e, this.canvas);
    this.offsetx = p.x - this.origin.x;
    this.offsety = p.y - this.origin.y;
};

RoostTool.prototype.dragCanvas = function(e)
{
    var p = getMouse(e, this.canvas);
	this.origin.x = p.x - this.offsetx;
	this.origin.y = p.y - this.offsety;
	this.updateTransform();
};

RoostTool.prototype.finishDragCanvas = function(e)
{
	this.canvas.style.cursor = "default";
	this.canvas.onmousemove = null;
    document.onmouseup = null;
};

/*--------------------------------------------------
 * Initialization that requires AJAX
 *--------------------------------------------------*/
RoostTool.prototype.ajaxInit = function()
{
	/*----------------------------------------
	 *  AJAX call
	 *----------------------------------------*/
	var url = "ajax/tool_init.php?station=" + this.station + "&year=" + this.year + "&month=" + this.month+ "&day=" + this.day;
	xmlhttp = ajax_get(url);
	var data = JSON.parse(xmlhttp.responseText);

	this.frames = data.frames;
	this.products = data.products;
	this.stationInfo = data.stationInfo;

	/*----------------------------------------
	 *  Build an index mapping timestamp to framenumber
	 *----------------------------------------*/

	this.scantime2frame = {};
	for (var i = 0; i < this.frames.length; i++)
	{
		var frame = this.frames[i];
		this.scantime2frame[frame.scan_time] = i;
	}

	/*----------------------------------------
	 *  Initialize map projections
	 *----------------------------------------*/
	var lat = parseFloat(this.stationInfo.lat);
	var lon = parseFloat(this.stationInfo.lon);
	var utm_zone = Math.floor( (lon + 180.0) / 6.0 ) + 1;
	var proj_key = "UTM" + utm_zone;
	Proj4js.defs[proj_key] = "+proj=utm +zone=" + utm_zone;
	this.proj_wgs84 = new Proj4js.Proj('WGS84');
	this.proj_utm   = new Proj4js.Proj(proj_key);

	// NB: proj modifies objects in place
	var p = {x: lon, y:lat};

	this.station_loc_utm = this.longlat_to_utm(p);

	var q = this.longlat_to_utm(p);
	var r = this.utm_to_longlat(q);
	var s = this.pixel_to_longlat({x:300,y:300});
	
}

/*--------------------------------------------------
 * Convert scan timestamp to frame index
 *--------------------------------------------------*/
RoostTool.prototype.scantime2frameidx = function(scan_time)
{
	return this.scantime2frame[scan_time];
};

/*--------------------------------------------------
 * Convert frame index to scan timestamp
 *--------------------------------------------------*/
RoostTool.prototype.frameidx2scantime = function(i)
{
	return this.frames[i].scan_time;
};

/*--------------------------------------------------
 * Return timestamp to display on the page
 *--------------------------------------------------*/
RoostTool.prototype.getTimeStamp = function(frame_number)
{
	if (this.frames == null || frame_number < 0 || frame_number >= this.frames.length)
		return 'unknown';
	else 
	{
		var frame = this.frames[frame_number];
		return frame.scan_time.substring(0,5) + " / " + frame.minutes_from_sunrise;
	}
};

function removeAllChildren(elt) {

	if ( elt.hasChildNodes() )
	{
		while ( elt.childNodes.length >= 1 )
		{
			elt.removeChild( elt.firstChild );       
		} 
	}
}

//----------------------------------------
// destroy
//----------------------------------------
RoostTool.prototype.destroy = function(){

    // undisplay frame info bar
    document.getElementById("frameCounter").style.visibility = "hidden";
    document.getElementById("frameTitle").style.visibility = "hidden";

    // reset buttons
    document.getElementById("saveAllButton").setAttribute('disabled', 'disabled');
    document.getElementById("resetButton").setAttribute('disabled', 'disabled');
	
	// remove roost sequence information
	for (var i = 0; i < this.roostSeqObj.length; i++)
	{
		this.roostSeqObj[i].destroy();
	}
	this.roostSeqObj = [];

    document.getElementById("roostSequenceTable").style.visibility = "hidden";

	// empty drawing elements
	for(var i = 0; i < this.panes.length; i++)
	{
		this.panes[i].reset();
	}
};


RoostTool.prototype.onbeforeunload = function()
{
    for (var i = 0; i < this.roostSeqObj.length; i++)
    {
        if (this.roostSeqObj[i].locallyChanged)
        {
            return "There are unsaved changes";
        }
    }
}

RoostTool.prototype.getSequences = function() {

    var url = "ajax/get_roosts.php?station=" + this.station +"&year=" + this.year + "&month=" + this.month + "&day=" + this.day;
	
	xmlhttp = ajax_get(url);

    var sequences = JSON.parse(xmlhttp.responseText);
	
	for (var i = 0; i < sequences.length; i++)
	{		
        var s = new RoostSequence();
		s.populateFromJSON(sequences[i]);
		this.addSequence(s);
    }
    this.updateCanvas();
};

RoostTool.prototype.updateCanvas = function() 
{   
    for(var i = 0; i < this.roostSeqObj.length; i++)
    {
        this.roostSeqObj[i].updateCanvas(this.frame, this.panes);
    }
};

RoostTool.prototype.saveAll = function() {
	var confirmation = confirm("Would you like to save all changes?");
	if (confirmation)
	{
		for(var i=0; i < this.roostSeqObj.length; i++)
		{
			if (this.roostSeqObj[i].locallyChanged == 1) 
				this.roostSeqObj[i].save();
		}
	}
    this.updateButtons();
};

RoostTool.prototype.resetAll = function() {
	var confirmation = confirm("Would you like to discard all local changes?");
	if (confirmation)
	{
		for(var i=0; i < this.roostSeqObj.length; i++)
		{
			if (this.roostSeqObj[i].databaseID != null)
				this.roostSeqObj[i].revert();
			else
				this.roostSeqObj[i]._delete();
		}
	}
    this.updateButtons();
};

RoostTool.prototype.updateButtons = function() {

    document.getElementById("saveAllButton").blur();
    document.getElementById("resetButton").blur();
    
    for(var i = 0 ; i < this.roostSeqObj.length; i++){
        if(this.roostSeqObj[i].locallyChanged){
            document.getElementById("saveAllButton").removeAttribute('disabled');
            document.getElementById("resetButton").removeAttribute('disabled');
            return;
        }
    }
    document.getElementById("saveAllButton").setAttribute('disabled', 'disabled');
    document.getElementById("resetButton").setAttribute('disabled', 'disabled');
};

// This just deletes the sequences from the tool. No changes are made to the DB
RoostTool.prototype.addSequence = function(s) 
{
	s.newInfoBox();
	this.roostSeqObj.push(s);
	document.getElementById("roostSequenceTable").style.visibility = "visible";
    this.updateCanvas();
};

RoostTool.prototype.removeSequence = function(obj) 
{
	obj.destroy();

	for (var i = 0; i < this.roostSeqObj.length; i++)
	{
		if (this.roostSeqObj[i] == obj)
		{
			this.roostSeqObj.splice(i, 1);
			break;
		}
	}

	if (this.roostSeqObj.length == 0)
	{
		document.getElementById("roostSequenceTable").style.visibility = "hidden";
	}
};

RoostTool.prototype.moveToFrame = function(frameNum) {
    this.frame = frameNum;
    this.loadFrame(frameNum);
	this.updateCanvas();
};

RoostTool.prototype.moveToTime = function(time)
{
	for (var i = 0; i < this.frames.length-1 && this.frames[i+1].minutes_from_sunrise < time; i++);
	this.moveToFrame(i);
};

RoostTool.prototype.loadFrame = function(idx) {

	var frameData = this.frames[idx];

	// The HTML elements
	var frameTitle = document.getElementById("frameTitle");
	var frameCounter = document.getElementById("frameCounter");
	var frameNum = document.getElementById("frameNum");
	var totalFrames = document.getElementById("totalFrames");
	var timestamp = document.getElementById("frameTimeStamp");
	var minutesFromSunrise = document.getElementById("minutesFromSunrise");
	var vcp = document.getElementById("vcp");
    var prev = document.getElementById("prevButton");
    var next = document.getElementById("nextButton");

	frameCounter.style.visibility = "visible";
	frameTitle.style.visibility = "visible";
	frameNum.innerHTML = this.frame + 1;
	totalFrames.innerHTML = this.frames.length;
	timestamp.innerHTML = frameData.scan_time;
	vcp.innerHTML = frameData.vcp;
	minutesFromSunrise.innerHTML = frameData.minutes_from_sunrise;

    if (this.frame == 0)
    {
        prev.setAttribute("disabled", "true");
    }
    else
    {
        prev.removeAttribute("disabled");
    }

    if (this.frame >= this.frames.length - 1)
    {
        next.setAttribute("disabled", "true");
    }
    else
    {
        next.removeAttribute("disabled");
    }
	

    for (var i = 0; i < this.panes.length; i++)
    {
		this.panes[i].updateFrame(this.frames[idx]);
    }


};

RoostTool.prototype.prevFrame = function() {
    if (this.frame > 0 )
    {
        this.loadFrame(--this.frame);
        this.updateCanvas();
    }
};

RoostTool.prototype.nextFrame = function() {
    if (this.frame < this.frames.length - 1 )
    {
        this.loadFrame(++this.frame);
        this.updateCanvas();
    }
};

function setThreePointMode(){
    tool.threePointMode();
};

RoostTool.prototype.threePointMode = function(){
	document.getElementById("circleToggle").checked = true;
	updateLayers();
    for (var i = 0; i < this.panes.length; i++)
    {
        this.panes[i].canvas.onmousedown = bindEvent(this, "threePointClick");
        this.panes[i].canvas.style.cursor = "crosshair";
    }
};

RoostTool.prototype.threePointClick = function(event, options) {

    var p = this.viewportToImage(getMouse(event, options.pageElement));

    if (this.controlPoints.length >= 3)
    {
		throw new Error("too many existing control points");
    }

    var mark = new CircleMarker(p.x, p.y);
	mark.setScale(this.scale);
    
    for (var i = 0; i < this.panes.length; i++) {
		mark.draw(this.panes[i].svg);
    }

    this.controlPoints.push(p);
    this.markers.push(mark);

    if (this.controlPoints.length == 3)
    {
    // create a new Circle object (modify this to create a new RoostSequence object instead)
        var c = pointsToCircle(this.controlPoints);
		c.setScale(this.scale);
        if (c)
        {
            var newRoostSequence = new RoostSequence(); 
			newRoostSequence.insertCircle(c, this.frame);
            c.roostSequence = newRoostSequence;
            newRoostSequence.locallyChanged = 1;
            this.sequenceIndex++;

            //canvas need to draw the new circle only... no need to update the canvas;Jafer
            for (var i = 0; i < this.panes.length; i++) 
            {
                c.draw(this.panes[i].svg);
            }
            c.deleteHandle.undraw();

			// add sequence to the tool
            this.addSequence(newRoostSequence);

            this.updateButtons();
            for (var i = 0; i < this.panes.length; i++)
            {
                this.panes[i].canvas.onmousedown = bindEvent(this, "startDragCanvas");
                this.panes[i].canvas.style.cursor = "default";
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

RoostTool.prototype.longlat_to_utm = function(p)
{
	// NB: proj modifies objects in place, so we need to clone p
	// before calling proj
	var q = Proj4js.transform(this.proj_wgs84, this.proj_utm, {x:p.x, y:p.y});
	return q;
};

RoostTool.prototype.utm_to_longlat = function(p)
{
	// NB: proj modifies objects in place, so we need to clone p
	// before calling proj
	var q = Proj4js.transform(this.proj_utm, this.proj_wgs84, {x:p.x, y:p.y});
	return q;	
};

RoostTool.prototype.pixel_to_utm = function(p)
{
	// map size in pixels and meters
	var pixels = 600;
	var meters = 2*150000;
	var m_per_pixel = meters/pixels;
	var center = {x:pixels/2, y:pixels/2};
	
	var q = {};
	q.x = this.station_loc_utm.x + (p.x - center.x)*m_per_pixel;
	q.y = this.station_loc_utm.y - (p.y - center.y)*m_per_pixel;	
	return q;
};

RoostTool.prototype.pixel_to_longlat = function(p)
{
	return this.utm_to_longlat(this.pixel_to_utm(p));
};


function updateLayers(){
	for (var i = 0; i < tool.panes.length; i++)
	{
		tool.panes[i].updateVisibility();
	}
};

//------------------------------------------------------------------------
// initialization
//------------------------------------------------------------------------

var tool;
function RoostToolInit()
{
    GetBrowserInfo();
    if (tool != null) tool.destroy();
	tool = new RoostTool();
    tool.getSequences();
    window.onkeydown = keydown;    
    window.focus();

    window.onbeforeunload = bindEvent(tool, "onbeforeunload", {passthru: true});

    document.getElementById("saveAllButton").style.display = "inline";
    document.getElementById("resetButton").style.display = "inline";

    document.getElementById("saveAllButton").onclick = bindEvent(tool, "saveAll");
    document.getElementById("resetButton").onclick = bindEvent(tool, "resetAll");
}


function ResetTool()
{
	if (tool)
	{
		tool.destroy();
		tool = null;
	}
}


function keydown(e)
{
    if (e.keyCode == 39)		// right arrow
    {
		next();
		return false;
    }
    else if (e.keyCode == 37)	// left arrow
    {
        prev();
        return false;
    }
    else if(e.keyCode == 67)	// c
    {
		var e = document.getElementById("circleToggle");
		e.checked = !e.checked;
        updateLayers();
        return false;
    }
    else if(e.keyCode == 77)	// m
    {
		var e = document.getElementById("mapToggle");
		e.checked = !e.checked;
        updateLayers();
        return false;
    }
    else if(e.keyCode == 78)	// n
    {
		setThreePointMode();
        return false;
    }
    else
    {
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

// Returns FIRST descendent of parent of the specified class
function getElementByClassName(classname, parent)
{
	if (! parent) return null;
    var a = YAHOO.util.Dom.getElementsByClassName(classname, null, parent);
    if (a) 
        return a[0];
    else
        return null;
}

