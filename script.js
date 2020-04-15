/**Quagga initialiser starts here*/

$(function () {

navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    	alert('Permission');
    });

  var App = {
    deviceId: null,
    init: function () {
      Quagga.init(this.state, function (err) {
        if (err) {
          console.log(err);
          return;
        }
        // App.attachListeners();
        Quagga.start();
      });
    },
    stop: function () {
      Quagga.stop();
    },
    initCameraSelection: function () {
      var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

      return Quagga.CameraAccess.enumerateVideoDevices().then(function (
        devices
      ) {
        function pruneText(text) {
          return text.length > 30 ? text.substr(0, 30) : text;
        }
        var $deviceSelection = document.getElementById("deviceSelection");
        while ($deviceSelection.firstChild) {
          $deviceSelection.removeChild($deviceSelection.firstChild);
        }
        devices.forEach(function (device) {
          var $option = document.createElement("option");
          $option.value = device.deviceId || device.id;
          $option.appendChild(
            document.createTextNode(
              pruneText(device.label || device.deviceId || device.id)
            )
          );
          $option.selected = streamLabel === device.label;
          $deviceSelection.appendChild($option);
        });
      });
    },
    querySelectedReaders: function () {
      return Array.prototype.slice
        .call(document.querySelectorAll(".readers input[type=checkbox]"))
        .filter(function (element) {
          return !!element.checked;
        })
        .map(function (element) {
          return element.getAttribute("name");
        });
    },
    _accessByPath: function (obj, path, val) {
      var parts = path.split("."),
        depth = parts.length,
        setter = typeof val !== "undefined" ? true : false;

      return parts.reduce(function (o, key, i) {
        if (setter && i + 1 === depth) {
          if (typeof o[key] === "object" && typeof val === "object") {
            Object.assign(o[key], val);
          } else {
            o[key] = val;
          }
        }
        return key in o ? o[key] : {};
      }, obj);
    },
    _convertNameToState: function (name) {
      return name
        .replace("_", ".")
        .split("-")
        .reduce(function (result, value) {
          return result + value.charAt(0).toUpperCase() + value.substring(1);
        });
    },
    setState: function (path, value) {
      var self = this;

      if (typeof self._accessByPath(self.inputMapper, path) === "function") {
        value = self._accessByPath(self.inputMapper, path)(value);
      }

      self._accessByPath(self.state, path, value);
      App.detachListeners();
      Quagga.stop();
      App.init();
    },
    state: {
      inputStream: {
        type: "LiveStream",
        constraints: {
          width: window.innerWidth,
          height: window.innerHeight,
          aspectRatio: { min: 1, max: 100 },
          facingMode: "environment", // or user
          deviceId: this.deviceId,
        },
      },
      locator: {
        patchSize: "large",
        halfSample: true,
      },
      numOfWorkers: 4,
      decoder: {
        readers: [
          {
            format: "ean_reader",
            config: {
              supplements: ["ean_5_reader"],
            },
          },
          "upc_reader",
        ],
      },
      locate: true,
      multiple: true,
    },
    lastResult: null,
    customDecoders: null,
  };

  Quagga.onDetected(function (result) {
    var code = result.codeResult.code;
    if (activeCode !== code) {
      codeReceived(code);
    }
  });
  var activeCode = null;
  var deviceId = null;
  const getDeviceLists = async (toStart) => {
    try {
      let devices = await navigator.mediaDevices.enumerateDevices();
      const backDevice = devices.filter(
        (device) => device.kind == "videoinput"
      );
      deviceId = backDevice[backDevice.length - 1].deviceId;
      App.deviceId = deviceId;
      toStart == 1 && App.init();
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };
  function codeReceived(code) {
    try {
      window.ReactNativeWebView.postMessage(code);
    } catch (e) {
      alert(e);
    }
    activeCode = code;
    document.getElementById("id_num").innerText = code;
  }
  document.getElementById("scan_btn").addEventListener("click", function () {
alert(deviceId);
    if (!deviceId) {
      getDeviceLists(1);
    } else {
      App.init();
    }
  });
navigator.permissions.query({name: 'camera'})
 .then((permissionObj) => {
 alert('get permission')
 })
 .catch((error) => {
 alert(error)
 })

  document.addEventListener("message", function (data) {
    alert(data.data);
    if (!deviceId) {
      getDeviceLists(1);
    } else {
      App.init();
    }
  });
});
