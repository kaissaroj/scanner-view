window.addEventListener("load", function () {
  const dom = document.querySelector("#scanner-container");
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    alert("enumerateDevices() not supported.");
    return;
  }
  var backCamID;

  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      backCamID = device[devices.length - 1].deviceId;
      start();

      // devices.forEach(function (device) {
      //   if (
      //     device.kind == "videoinput" &&
      //     device.label.match(/back/) != null
      //   ) {
      //     //alert("Back found!");
      //     backCamID = device.deviceId;
      //   }
      // });
    })
    .catch(function (err) {
      //alert(err.name + ": " + err.message);
    });

  if (typeof backCamID == "undefined") {
    alert("back camera not found.");
  }

  function start() {
    alert(backCamID);
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
      function (err) {
        alert(JSON.stringify(err));
        console.log("starting scanning");
        Quagga.start();
      }
    );

    Quagga.onDetected(function (result) {
      console.log(result.codeResult.code);
      const code = result.codeResult.code;
      alert(code);
    });
  }
});
