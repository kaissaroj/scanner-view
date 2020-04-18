const decodeImage = (src, callback) => {
  Quagga.decodeSingle(
    {
      size: 800,
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
          "code_128_reader",
        ],
      },
      locate: true,
      multiple: true,
      readers: [
        {
          format: "ean_reader",
          config: {
            supplements: ["ean_5_reader"],
          },
        },
        "upc_reader",
        "code_128_reader",
      ],
      locate: true,
      src: src,
    },
    function (result) {
      try {
        callback(result.codeResult.code);
      } catch (e) {
        callback(null);
      }
    }
  );
};
document.addEventListener("message", function (data) {
  alert(data);
  decodeImage(data, (code) => {
    alert(code);
    try {
      window.ReactNativeWebView.postMessage(code);
    } catch (e) {
      alert("Error");
    }
  });
});