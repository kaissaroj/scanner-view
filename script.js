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
        facingMode: "environment", // or user
      },
      locator: {
        patchSize: "medium",
        halfSample: false,
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
    if (err) {
      return console.log(err);
    }
    console.log("starting scanning");
    Quagga.start();
  }
);

Quagga.onDetected(function (result) {
  console.log(result.codeResult.code);
  const code = result.codeResult.code;
  alert(code);
});
var resultCollector = Quagga.ResultCollector.create({
  capture: true, // keep track of the image producing this result
  capacity: 20, // maximum number of results to store
  blacklist: [],
  filter: function (codeResult) {
    // alert(codeResult.format);
    // only store results which match this constraint
    // returns true/false
    // e.g.: return codeResult.format === "ean_13";
    return true;
  },
});
