/**
 * Created by longboard on 2017-10-05.
 */

var dataholder = $('span.dataholder#u2f-data');
var u2fdata = dataholder.data('u2fdata');

setTimeout(function() {
    if (u2fdata) {
        console.log("sign: ", u2fdata);
        console.log("appId: ", u2fdata.appId);
        console.log("challenge: ", u2fdata.challenge);
        console.log("registeredKeys: ", u2fdata.registeredKeys);
        u2f.sign(
            u2fdata.appId,
            u2fdata.challenge,
            u2fdata.registeredKeys,
            function(data) {
                if(data.errorCode) {
                    switch (data.errorCode) {
                        case 4:
                            alert("This device is not registered for this account.");
                            break;
                        default:
                            alert("U2F failed with error code: " + data.errorCode);
                    }
                } else {
                    document.getElementById('tokenResponse').value = JSON.stringify(data);
                    document.getElementById('form').submit();
                }
            }
        );
    }
}, 1000);
