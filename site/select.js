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
			if (key == "station")
			{
				this[key] = Selector.updateStationDropdown(this.selectElts[key], inventory[key], this[key]);
			}
			else
			{
				this[key] = Selector.updateDropdown(this.selectElts[key], inventory[key], this[key]);
			}
		}

		if (this.day != "") {
			window.location.hash = "#?" + this.queryString();
			RoostToolInit();
		}

		this.installHandlers();
	}
};

Selector.updateStationDropdown = function(select, optionGroups, selectedKey)
{
	// Remove all current options
	while (select.hasChildNodes()) {
		select.removeChild(select.lastChild);
	}

	while (select.length > 0)
	{
		select.remove(0);
	}
	
	var hasSelection;
	for (group in optionGroups)
	{
		var optgroup = document.createElement('optgroup');
		optgroup.setAttribute("label", group);
		
		for(key in optionGroups[group])
		{
			var opt = document.createElement('option');
			opt.setAttribute("value", key);
			opt.innerHTML = optionGroups[group][key];
			if (key == selectedKey)
			{
				opt.selected = true;
				hasSelection = true;
			}
			optgroup.appendChild(opt);
		}
		select.add(optgroup, null);
	}

	return hasSelection ? selectedKey : "";
}

Selector.updateDropdown = function(select, optionValues, selectedKey)
{
	// Remove all current options
	while (select.length > 0)
	{
		select.remove(0);
	}
	
	var hasSelection;
	for (key in optionValues)
	{
		var opt = document.createElement('option');
		opt.setAttribute("value", key);
		opt.innerHTML = optionValues[key];
		if (key == selectedKey)
		{
			opt.selected = true;
			hasSelection = true;
		}
		select.add(opt, null);
	}

	return hasSelection ? selectedKey : "";
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