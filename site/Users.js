
var actions = {EditRoost: 1, CreateRoost: 2}
function User()
{
    this.permission = 0;
    this.userName = 0;
    this.userID = "";
    this.userAction = actions;
    var cookieFound = this.getUserID();
    if(cookieFound)
    {
        //Call AJAX Login
        this.updateDiv();
    }
    document.getElementById("loginButton").onclick = bindEvent(this,"login");
    document.getElementById("newUserButton").onclick = bindEvent(this,"newUser");
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
            if(userName == roostUserName)
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
    //Call Ajax New User
    var loginUserName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;    
    alert("Creating new user " + loginUserName);
    
    var validNewUser = false;
    if(validNewUser)
    {
        this.storeUserID(this.userName);
        this.updateDiv();
    }
}


User.prototype.login = function()
{
    var loginUserName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    alert("Logging in " + loginUserName);
    //Call Ajax Login
    
    var loginPassed = false;
    if(loginPassed)
    {
        this.storeUserID(this.userName);
        this.updateDiv();       
    }
}

User.prototype.logout = function()
{
    this.deleteUserID();
    this.updateDiv();
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
        document.getElementById("controlBar").removeChild(userLoginDiv);
        userLoginDiv.style.visibility = 'hidden';
        var userLogoutDiv = document.getElementById("userLogoutDiv");
        document.getElementById("controlBar").appendChild(userLogoutDiv);
        userLogoutDiv.style.visibility = 'visible';
    }
    if(this.userName == "")
    {
        var userLogoutDiv = document.getElementById("userLogoutDiv");
        document.getElementById("controlBar").removeChild(userLogoutDiv);
        userLogoutDiv.style.visibility = 'hidden';  
        var userLoginDiv = document.getElementById("userLoginDiv");
        document.getElementById("controlBar").appendChild(userLoginDiv);
        userLoginDiv.style.visibility = 'visible';    
    }
}

User.prototype.addLoginDiv = function()
{
    
}

User.prototype.addLogoutDiv = function()
{
    
}