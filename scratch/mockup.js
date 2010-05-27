// BEGIN GLOBALS COPIED FROM LabelMe my_scripts.js
// RETHINK AND REORGANIZE THESE
var bname;
var bversion;

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

// Get the y position of the mouse event.
function GetEventPosX(event) {
    if(IsNetscape()) return event.layerX;
    if(IsMicrosoft()) return event.x+document.getElementById('main_image').scrollLeft;//offsetX;
    return event.offsetX;
}

// Get the y position of the mouse event.
function GetEventPosY(event) {
    if(IsNetscape()) return event.layerY;
    if(IsMicrosoft()) return event.y+document.getElementById('main_image').scrollTop;//offsetY;
    return event.offsetY;
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

function dump(arr,level,maxlevel) {
    var dumped_text = "";
    if(!level) level=0;
	if(!maxlevel) maxlevel=5;
	if(level>=maxlevel) return "";

    //The padding given at the beginning of the line.
    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";
	
    if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				if (value.nodeType)
				{
					dumped_text += level_padding + "'" + item + " => '<DOM_NODE>\n";
				}
				else
				{
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1,maxlevel);
				}
			} 
			else if (typeof(value) != 'function') 
			{
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} 
	else
	{ //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
    return dumped_text;
}

function debug(obj)
{
	w = window.open(null, "debug");
	w.document.open("text/plain", "replace");
	w.document.write(dump(obj,0,3));
	w.document.close();
}
// END GLOBALS COPIED FROM LabelMe my_scripts.js

global = new Object();
global.strokeWidth = 4;
global.strokeColor = "red";
global.fill = "none";

//------------------------------------------------------------------------
// class Point
//------------------------------------------------------------------------
function Point(x, y)
{
    this.x = x;
    this.y = y;
}

function drawPointSVG()
{
	var svg = document.getElementById("canvas_svg");
	if (!svg)
	{
		alert("Error: cannot find canvas");
		return;
	}

	var svgNS = "http://www.w3.org/2000/svg";

	this.svgPoint = document.createElementNS(svgNS, "circle");

	this.svgPoint.setAttributeNS(null, "cx", this.x);
	this.svgPoint.setAttributeNS(null, "cy", this.y);
	this.svgPoint.setAttributeNS(null, "r",  3);

	this.svgPoint.setAttributeNS(null, "fill",         global.fill);
	this.svgPoint.setAttributeNS(null, "stroke",       global.strokeColor);
	this.svgPoint.setAttributeNS(null, "stroke-width", global.strokeWidth);

	svg.appendChild(this.svgPoint);
}

function drawPointVML()
{
	var canvas = document.getElementById("canvas");
	if (!canvas)
	{
		alert("Error: cannot find canvas");
		return;
	}

}

Point.prototype.draw = drawPointSVG;

//------------------------------------------------------------------------
// class Circle
//------------------------------------------------------------------------
function Circle()
{
	this.center = new Point(-1,-1);
	this.r = -1;

    this.controlPoints = new Array();
    this.svgNS = "http://www.w3.org/2000/svg";
    
    this.svgCircle;
    
    // Draw a circle by creating an element like the following example and inserting into DOM
    //  <svg:circle cx="100" cy="100" r="30" fill="red" stroke="blue" stroke-width="5" /> 
    this.draw = function() {

		this.fromThreePoints(this.controlPoints[0], this.controlPoints[1], this.controlPoints[2]);
		
		if (this.r < 0 )
		{
			alert("Invalid circle");
			return;
		}
	
		var svg = document.getElementById("canvas_svg");
		if (!svg)
		{
			alert("Error: cannot find canvas");
			return;
		}

		this.svgCircle = document.createElementNS(this.svgNS, "circle");

		this.svgCircle.setAttributeNS(null, "cx", this.center.x);
		this.svgCircle.setAttributeNS(null, "cy", this.center.y);
		this.svgCircle.setAttributeNS(null, "r",  this.r);

		this.svgCircle.setAttributeNS(null, "fill",         global.fill);
		this.svgCircle.setAttributeNS(null, "stroke",       global.strokeColor);
		this.svgCircle.setAttributeNS(null, "stroke-width", global.strokeWidth);

		svg.appendChild(this.svgCircle);
    };

    this.click = function(x, y) {
		if (this.controlPoints.length < 3)
		{
			var p = new Point(x,y);
			p.draw();
			this.controlPoints.push(p);
		}
    };

    this.isComplete = function() {
		return (this.controlPoints.length >= 3);
    }
}

Circle.prototype.fromThreePoints = function(p1, p2, p3)
{
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

	// msg = "";
	// msg += "p1 = " + dump(p1);
	// msg += "p2 = " + dump(p2);
	// msg += "p3 = " + dump(p3);
	// msg += "mid12 = " + dump(mid12);
	// msg += "mid23 = " + dump(mid23);
	// msg += "slopeA: " + slopeA + "\n";
	// msg += "slopeB: " + slopeB + "\n";
	// msg += "interceptA: " + interceptA + "\n";
	// msg += "interceptB: " + interceptB + "\n";
	// msg += "cx: " + cx + "\n";
	// msg += "cy: " + cy + "\n";
	// msg += "r: " + r + "\n";

	this.center = new Point(cx, cy);
	this.r = r;
};


//------------------------------------------------------------------------
// class Canvas
//------------------------------------------------------------------------
function Canvas()
{
    this.circles = new Array();
    this.pendingCircle = new Circle();

    this.MouseDown = function(event) {
		var x = GetEventPosX(event);
		var y = GetEventPosY(event);
		this.pendingCircle.click(x, y);
		if (this.pendingCircle.isComplete())
		{
			this.pendingCircle.draw();
			this.circles.push(this.pendingCircle);
			this.pendingCircle = new Circle();
		}
	};
}

canvas = new Canvas();
GetBrowserInfo();