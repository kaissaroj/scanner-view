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
      callback(!!result.codeResult ? result.codeResult.code : null);
    }
  );
};
document.addEventListener("message", function (event) {
  alert(event.data);
  decodeImage(event.data, (code) => {
    alert(code);
    window.ReactNativeWebView.postMessage(code);
  });
});
