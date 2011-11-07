var reset_selection = "<option value=\"null\"/>";

var selector;
function starter()
{
	UserInit();
	ResetTool();
	selector = new Selector();
	selector.updateAllDropdowns();
}

function Selector()
{
	this.station = getURL("station");
	this.year = getURL("year");
	this.month = getURL("month");
	this.day = getURL("day");

	this.selectElts = {station: document.getElementById("station_select"),
					   year:    document.getElementById("year_select"),
					   month:   document.getElementById("month_select"),
					   day:     document.getElementById("day_select") };

	this.body = document.getElementById("body");
}

Selector.prototype.uninstallHandlers = function()
{
	for (var key in this.selectElts) {
		this.selectElts[key].onchange = null;
	}
	this.body.onhashchange = null;
}

Selector.prototype.installHandlers = function()
{
	for (var key in this.selectElts) {
		this.selectElts[key].onchange = bindEvent(this, "selectionChange");
	}
	this.body.onhashchange = starter;
}

// Called when user changes any of the boxes
Selector.prototype.selectionChange = function()
{
	if(tool != null)
	{
		for (var i = 0; i < tool.roostSeqObj.length; i++)
		{
			if (tool.roostSeqObj[i].locallyChanged)
			{
				var answer = confirm("There are unsaved changes. Are you sure you want to change the date?");
				if(answer)
				{
					break;
				}
				else
				{
					return;
				}
			}
		}
	}
	ResetTool();
	for (var key in this.selectElts) {
		this.selectElts[key].blur();
		this[key] = this.selectElts[key].value;
	}
	this.updateAllDropdowns();
};

Selector.prototype.queryString = function()
{
	return "station=" + this.station + "&year=" + this.year + "&month=" + this.month + "&day=" + this.day;
};

// Check inventory and update the dropdowns accordingly
Selector.prototype.updateAllDropdowns = function()
{	
	var url = "ajax/get_inventory.php?" + this.queryString();
	ajax_get(url, bindEvent(this,"inventoryCallback"));	
};

Selector.prototype.inventoryCallback = function(xmlhttp)
{
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		this.uninstallHandlers();

		var inventory = JSON.parse(xmlhttp.responseText);

		for (key in inventory)
		{
			this[key] = Selector.updateDropdown(this.selectElts[key], inventory[key], this[key]);
		}

		if (this.day != "") {
			window.location.hash = "#?" + this.queryString();
			RoostToolInit();
		}

		this.installHandlers();
	}
};

// Populate a dropdown list
Selector.populateDropdown = function(elt, options, selectedKey)
{
	// options is an object that represents options and/or groups of options
	//     key => string:  an option
	//     key => object:  an optgroup
	
	var hasSelection = false;

	for (key in options)
	{
		var theoption = options[key];

		if (typeof(theoption) == 'string')
		{
			// Base case: create the option element

			var opt = document.createElement('option');
			opt.setAttribute("value", key);
			opt.innerHTML = options[key];
			if (key == selectedKey)
			{
				opt.selected = true;
				hasSelection = true;
			}
			elt.appendChild(opt);
		}
		else if (typeof(theoption) == 'object')
		{
			// Create an optgroup and make recursive call to populate it

			var optgroup = document.createElement('optgroup');
			optgroup.setAttribute("label", key);

			var subSelection = this.populateDropdown(optgroup, theoption, selectedKey);
			hasSelection = hasSelection || subSelection;

			elt.appendChild(optgroup);
		}
		else
		{
			alert('An error occurred. Please try later');
		}
	}

	return hasSelection ? selectedKey : "";	
}

Selector.updateDropdown = function(select, options, selectedKey) 
{
	this.emptyDropdown(select);
	return this.populateDropdown(select, options, selectedKey);
}
	
Selector.emptyDropdown = function(select)
{
	select.options.length = 0;

	// Remove all optgroups
	while (select.firstChild) {
		select.removeChild(select.firstChild);
	}
}


// Gets an argument from the query string. Gives precedence to arguments
// that appear in the "hash" (after the # element)
function getURL( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results_search = regex.exec( window.location.search );
    var results_hash = regex.exec( window.location.hash );

	if( results_hash != null )
		return results_hash[1];

	if (results_search != null)
		return results_search[1];

	return "";
}