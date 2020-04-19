const decodeImage = async (src, type, callback) => {

  const reader = type == 'ean-extended' ? [
    {
      format: "ean_reader",
      config: {
        supplements: ["ean_5_reader"]
      }
    }
  ] : 
  [
    "upc_reader",
    "code_128_reader",
  ];

  await Quagga.decodeSingle(
    {
      size: 800,
      locator: {
        patchSize: "large",
        halfSample: true,
      },
      numOfWorkers: 4,
      decoder: {reader
      },
      locate: true,
      multiple: true,
      readers: reader,
      locate: true,
      src: src,
    },
    function (result) {
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
