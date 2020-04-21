/**Quagga initialiser starts here*/

$(function () {
    (() => {
      const queryString = window.location.search;
      if (queryString == "?modal") {
        var d = document.getElementsByTagName("video");
        d[0].style.opacity = 1;
      }
    })();
    var readers = [
      {
        format: "ean_reader",
        config: {
          supplements: ["ean_5_reader"],
        },
      },
      "upc_reader",
      "code_128_reader",
    ];
  
    var App = {
      readers: null,
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
            // width: window.innerWidth,
            // height: window.innerHeight,
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
          readers: readers,
        },
        locate: true,
        multiple: true,
      },
      lastResult: null,
      customDecoders: null,
    };
  
    Quagga.onDetected(function (result) {
      var code = result.codeResult.code;
      var format = result.codeResult.format;
      if (Handler.activeCode !== code) {
        Handler.codeReceived(format,code);
      }
    });
  
    var Handler = {
      activeCode: null,
      deviceId: null,
      _isScanning: false,
      _checkingCode: false,
      eanloop: 0,
      changeButtonText: () => {
        const btn = document.getElementById("scan_btn");
        console.log(Handler._isScanning);
        btn.innerText = Handler._checkingCode
          ? `VERIFYING`
          : Handler._isScanning
          ? `SCANNING`
          : `SCAN BARCODE`;
  
        document.getElementById("interactive").style.display =
          !Handler._checkingCode && !Handler._isScanning ? "none" : "block";
        if (!Handler._checkingCode && !Handler._isScanning) {
          App.stop();
        }
      },
      getDeviceLists: async (toStart, callback) => {
        let devices = await navigator.mediaDevices.enumerateDevices();
        const backDevice = devices.filter(
          (device) => device.kind == "videoinput"
        );
        Handler.deviceId = backDevice[backDevice.length - 1].deviceId;
        App.deviceId = Handler.deviceId;
        callback();
      },
      codeReceived: (format, code) => {
      
        if(format != 'ean_13' && Handler.eanloop < 10){
          console.log('again loop');
        }
        else{
          sendData(code);
        }
        console.log('loop',Handler.eanloop )
        Handler.eanloop++;
      },
    };
    Handler.getDeviceLists(1, () => {
      App.init();
    });
    function sendData(code){
        
      const url = `exp://192.168.43.25:19000/--/${code}`;
    var confirmed = confirm('Find !!');
    if(confirmed){
        window.location.href = url;
    }
    }
    
  
  });
  