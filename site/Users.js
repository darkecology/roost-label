
var actions = {EditRoost: 1, CreateRoost: 2};
function User()
{
    this.permission = 0;
    this.userName = "";
    this.userID = 0;
    this.userAction = actions;
    
    document.getElementById("loginButton").onclick = bindEvent(this,"login");
    document.getElementById("newUserButton").onclick = bindEvent(this,"newUser");
    document.getElementById("logoutButton").onclick = bindEvent(this,"logout");
    document.getElementById("newAccountButton").onclick = bindEvent(this, "newUserCreation");
    document.getElementById("cancelButton").onclick = bindEvent(this, "cancelNewUserCreation");
    document.getElementById("userName").onkeydown = function(e) {stopPropagation(e); return true;};
    document.getElementById("password").onkeydown = function(e) {stopPropagation(e); return true;};
    document.getElementById("newUserName").onkeydown = function(e) {stopPropagation(e); return true;};
    document.getElementById("newUserPassword").onkeydown = function(e) {stopPropagation(e); return true;};
    var cookieFound = this.getUserID();
    if(cookieFound)
    {
        //Call AJAX Login
        var url = "ajax/user_login.php";
	xmlhttp= new XMLHttpRequest();	
	xmlhttp.open("POST", url, false);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("userID=" + this.userID)
        var responseText = xmlhttp.responseText;
        
        var splitArray = responseText.split(';');
        
        if(splitArray[0] == 0)
        {
            alert("Getting login from cookie failed");
            return;
        }
        this.userName = splitArray[1].substr(10);
        this.permission = splitArray[2].substr(12);
        this.updateDiv();
    }
}
User.prototype.checkPermission = function(roostUserName, action)
{
    if(this.permission == 0)
    {
        return false;
    }
    else if(this.permission == 1)
    {
        if(action == actions.EditRoost)
        {
            if(this.userID == roostUserName)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        if(action == actions.CreateRoost) return true;
    }
    else if(this.permission == 2)
    {
        if(action == actions.EditRoost || action == actions.CreateRoost)
        {
            return true;
        }
    }
    return false;
}

User.prototype.newUser = function()
{
    var newUserDiv = document.getElementById("newUserDiv");
    newUserDiv.style.display = 'block';
    var pageDivWrapper = document.getElementById("pageDivWrapper");
    pageDivWrapper.style.display = 'none';
    var newAccountButton = document.getElementById("newAccountButton");
    newAccountButton.removeAttribute('disabled');
    var cancelButton = document.getElementById("cancelButton");
    cancelButton.removeAttribute('disabled');
}

User.prototype.newUserCreation = function()
{
    var loginUserName = document.getElementById("newUserName").value;
    var password = document.getElementById("newUserPassword").value;
    //Call Ajax New User
    var url = "ajax/new_user.php";
    xmlhttp= new XMLHttpRequest();	
    xmlhttp.open("POST", url, false);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("username=" + loginUserName + "&password=" + password)
    var responseText = xmlhttp.responseText;
    var splitArray = responseText.split(';');
    if(splitArray[0] == 0)
    {
        alert("New user creation failed");
        return;
    }
    this.userName = loginUserName;
    this.permission = 1;
    this.userID = splitArray[1].substr(8);
    this.storeUserID(this.userID);
    this.updateDiv();
    
    var newUserDiv = document.getElementById("newUserDiv");
    newUserDiv.style.display = 'none';
    var pageDivWrapper = document.getElementById("pageDivWrapper");
    pageDivWrapper.style.display = 'block';
}
User.prototype.cancelNewUserCreation = function()
{
    var newUserDiv = document.getElementById("newUserDiv");
    newUserDiv.style.display = 'none';
    var pageDivWrapper = document.getElementById("pageDivWrapper");
    pageDivWrapper.style.display = 'block';
}
User.prototype.login = function()
{
    var loginUserName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    //Call Ajax Login
    var url = "ajax/user_login.php";
    xmlhttp= new XMLHttpRequest();	
    xmlhttp.open("POST", url, false);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("username=" + loginUserName + "&password=" + password);
    var responseText = xmlhttp.responseText;
    var splitArray = responseText.split(';');
    
    if(splitArray[0] == 0)
    {
        alert("Login Failed");
        return;
    }
    
    this.userID = splitArray[1].substr(8);
    this.permission = splitArray[2].substr(12);
    this.userName = loginUserName;
    this.storeUserID(this.userID);
    this.updateDiv();
    tool.updateCanvas();
    for(var i = 0; i < tool.roostSeqObj.length; i++)
    {
        tool.roostSeqObj[i].updateInfoBox();
    }
}

User.prototype.logout = function()
{
    this.deleteUserID();
    window.location.reload();
}

User.prototype.getUserID = function()
{
    cookieName = 'userID';
    if (document.cookie.length>0)
      {
      var c_start=document.cookie.indexOf(cookieName + "=");
      if (c_start!=-1)
        {
        c_start=c_start + cookieName.length+1;
        var c_end=document.cookie.indexOf(";",c_start);
        if (c_end==-1) c_end=document.cookie.length;
        this.userID = unescape(document.cookie.substring(c_start,c_end));
        alert("" + unescape(document.cookie.substring(c_start,c_end)));
        return unescape(document.cookie.substring(c_start,c_end));
        }
      }
    return "";
    
}

User.prototype.storeUserID = function(savedUserID)
{
    var exdate=new Date();
    expiredays = 7;
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie='userID'+ "=" +escape(savedUserID)+ ((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

User.prototype.deleteUserID = function()
{
    cookieName = 'userID';
    document.cookie = cookieName +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
    
}

User.prototype.updateDiv = function()
{
    if(this.userName != "")
    {
        var userLoginDiv = document.getElementById("userLoginDiv");
        userLoginDiv.style.display = 'none'; 
        var userLogoutDiv = document.getElementById("userLogoutDiv");
        userLogoutDiv.style.display = 'block';
        var helloSpan = document.getElementById("helloSpan");
        helloSpan.innerHTML = this.userName;
    }
    if(this.userName == "")
    {
        var userLogoutDiv = document.getElementById("userLogoutDiv");
        userLogoutDiv.style.display = 'none';  
        var userLoginDiv = document.getElementById("userLoginDiv");
        userLoginDiv.style.display = 'block';    
    }
}