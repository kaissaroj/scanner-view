const decodeImage = async (src) => {
  await Quagga.decodeSingle(
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
      let code = null;
      try {
        code = result.codeResult.code;
      } catch (e) {}
      window.ReactNativeWebView.postMessage(code);
    }
  );
};
document.addEventListener("message", function (event) {
  try {
    decodeImage(event.data);
  } catch (e) {
    alert("Error");
  }
});
