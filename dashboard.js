var requestNumber=0;
function startLoraswitch() { 
    $(document).ajaxStart(function() { if(requestNumber == 0) { $.mobile.loading("show", { textVisible: true }); disableControls(); }; requestNumber++; });
    $(document).ajaxStop(function() { requestNumber--; if(requestNumber == 0) { $.mobile.loading('hide'); enableControls(); } });
    $(document).ready(function() { runAndSetInterval(refreshUI,150000); $("#flip").change(updateSwitch);    console.log( "ready!" ); });
}

function refreshUI() { getSwitch();	}

function disableControls() {
        $("#flip").flipswitch('disable');
}

function enableControls()	{
        $("#flip").flipswitch('enable');
}

function updateSwitch()	{
//		alert("updateSwitch");
    var flipId = this.id == "flip" ? "FLIP" : "UNKNOWN";
    var flipValue = this.value == "on" ? "1" : "0";
    var url="http://loraswitch.kmt.orange-labs.fr/switch/" + flipValue;
    ajaxRequest(url, "PUT", onSwitchUpdateSuccess, "Switch Update ERROR.");
}

function getSwitch() {
    ajaxRequest("http://loraswitch.kmt.orange-labs.fr/power/status", "GET", onSwitchGetSuccess, "Switch Get Status ERROR.");
}

function ajaxRequest(requestedUrl, requestType, successFunc, message) {
    $.ajax({
            url: requestedUrl,
            type: requestType,
            timeout: 30000,
            dataType: "json",
            cache: false,
            error: function(error) { onError(message,error); },
            success: function(data) { successFunc(data); }
        });
}

function formatDate(dateStr) {
    var date = new Date(dateStr*1000);
    var sMonth = padValue(date.getMonth() + 1);
    var sDay = padValue(date.getDate());
    var sYear = date.getFullYear();
    var sHour = date.getHours();
    var sMinute = padValue(date.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);
    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

return sMonth + "-" + sDay + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

function onSwitchUpdateSuccess(data) {
//		alert("onSwitchUpdateSuccess");
}

function onSwitchGetSuccess(data) {
//		alert("onSwitchGetSuccess");
    if(data.power == "1") {
        $("#upIcon").attr('src',"./ON.jpg");
        $("#upStatusLastUpdateHeader").html("220V ON");
    } else {
        $("#upIcon").attr('src',"./OFF.jpg");
        $("#upStatusLastUpdateHeader").html("220V OFF");
    }
    $("#upStatusLastUpdateContent").html("Last update "+formatDate(data.timestamp));

    var battery="Battery ";
    if(data.battery >= 4000) {
        battery+="<span class=\"greenText\">GOOD</span>";
    }
    else {
        battery+="<span class=\"redText\">BAD</span>";
    }
    $("#upStatusBatteryHeader").html(battery);
    $("#upStatusBatteryContent").html("Level "+data.battery+" mV");

    $("#upStatusBatteryHeader").html(battery);

    $("#upStatusSignalHeader").html("Network signal");
    $("#upStatusLastSignalContent").html(data.signalLevel+"/5");

    var status=data.relay == "1" ? "on" : "off";
    $("#flip").off("change").val(status).flipswitch('refresh');
    $("#flip").change(updateSwitch);
    $("#switchStatus").html(data.MESSAGE);
    $("#switchStatus").show("slow"); // setTimeout(function(){ $("#switchStatus").hide("slow"); }, 300000);
}

function onError(message, error) { displayStatus(); $('#content').html(message+" "+error.status+"/"+error.responseText+"/ Please try again later!"); }

function displayStatus() { $("#downStatus").show("slow"); setTimeout(hideStatus, 30000); }

function hideStatus() { $("#downStatus").hide("slow"); }

function runAndSetInterval(fn, t) { fn(); return(setInterval(fn, t)); }