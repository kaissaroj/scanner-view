
$(function () {
  const decodeImage = async (src, type, callback) => {

    const reader = type == 'ean-extended' ? [
      {
        format: "ean_reader",
        config: {
          supplements: ['ean_5_reader']
        }
      }
    ] : 
    [
      "upc_reader",
      "code_128_reader",
    ];
  
  
    await Quagga.decodeSingle(
      {
        inputStream: {size:1280},
        locator: {patchSize:"medium",halfSample:true},
        numOfWorkers:8,
        decoder: {
          readers:reader
        },  
        locate:true,
        src: src,
      },
      function (result) {
        alert('code find')
        let code = null;
        try {
          code = result.codeResult.code;
        } catch (e) {}
        callback(code);
       
      }
    );
  };
  document.addEventListener("message", function (event) {
    try {
      alert('web listen1');
      decodeImage(event.data,'ean-extended', (code) => {
        !!code && window.ReactNativeWebView.postMessage(code);
        !code && decodeImage(event.data,'normal', (code) => {
          window.ReactNativeWebView.postMessage(code);
        })
      });
    } catch (e) {
      alert("Error");
    }
  });
  
  window.addEventListener("message", function(event) {
    try {
      alert('web listen2');
      decodeImage(event.data,'ean-extended', (code) => {
        !!code && window.ReactNativeWebView.postMessage(code);
        !code && decodeImage(event.data,'normal', (code) => {
          window.ReactNativeWebView.postMessage(code);
        })
      });
    } catch (e) {
      alert("Error");
    }
  });
})
this.document.addEventListener("message", function (event) {
  try {
    alert('web listen3');
    decodeImage(event.data,'ean-extended', (code) => {
      !!code && window.ReactNativeWebView.postMessage(code);
      !code && decodeImage(event.data,'normal', (code) => {
        window.ReactNativeWebView.postMessage(code);
      })
    });
  } catch (e) {
    alert("Error");
  }
});

this.window.addEventListener("message", function(event) {
  try {
    alert('web listen4');
    decodeImage(event.data,'ean-extended', (code) => {
      !!code && window.ReactNativeWebView.postMessage(code);
      !code && decodeImage(event.data,'normal', (code) => {
        window.ReactNativeWebView.postMessage(code);
      })
    });
  } catch (e) {
    alert("Error");
  }
});
})

