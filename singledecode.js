const decodeImage = async (src, callback) => {
  alert(src);
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
      alert("REsult");
      window.ReactNativeWebView.postMessage(result.codeResult.code);
      try {
        callback(result.codeResult.code);
      } catch (e) {
        alert("error");
        callback(null);
      }
    }
  );
};
document.addEventListener("message", function (event) {
  try {
    decodeImage(event.data, function (code) {
      alert(code);
      try {
        window.ReactNativeWebView.postMessage(code);
      } catch (e) {
        alert("Error");
      }
    });
  } catch (e) {
    alert("Error");
  }
});
