window.addEventListener("load", function () {
  try {
    const dom = document.querySelector("#scanner-container");
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      alert("enumerateDevices() not supported.");
      return;
    }
    var backCamID;
    
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
        alert( JSON.stringify(device) );
        if( device.kind == "videoinput" && device.label.match(/back/) != null ){
          //alert("Back found!");
          backCamID = device.deviceId;
        }
      });
    })
    .catch(function(err) {
      //alert(err.name + ": " + err.message);
    });
    
    if(typeof(backCamID)=="undefined"){
      alert("back camera not found.");
    }
    
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          multiple: "true",
          target: document.querySelector("#scanner-container"),
          constraints: {
            width: 640,
            height: 480,
            facingMode: backCamID, // or user
          },
        },
        decoder: {
          readers: [
            {
              format: "ean_reader",
              config: {
                supplements: ["ean_5_reader"],
              },
            },
            "upc_reader",
            "code_39_reader",
            "code_39_vin_reader",
          ],
        },
      },
      initCameraSelection: function(){
        var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

        return Quagga.CameraAccess.enumerateVideoDevices()
        .then(function(devices) {
            function pruneText(text) {
                return text.length > 30 ? text.substr(0, 30) : text;
            }
            var $deviceSelection = document.getElementById("deviceSelection");
            while ($deviceSelection.firstChild) {
                $deviceSelection.removeChild($deviceSelection.firstChild);
            }
            devices.forEach(function(device) {
                var $option = document.createElement("option");
                $option.value = device.deviceId || device.id;
                $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                $option.selected = streamLabel === device.label;
                $deviceSelection.appendChild($option);
            });
        });
    },
      function (err) {
        alert(JSON.stringify(err));
        console.log("starting scanning");
        Quagga.start();
      }
    )

    Quagga.onDetected(function (result) {
      console.log(result.codeResult.code);
      const code = result.codeResult.code;
      alert(code);
    });
  } catch (e) {
    alert(JSON.stringify(e));
  }
});
