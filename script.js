window.addEventListener("load", function () {
  alert(!!Quagga);
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
        alert(JSON.stringify(err));
      }
      alert("start scanning");
      console.log("starting scanning");
      Quagga.start();
    }
  );

  Quagga.onDetected(function (result) {
    console.log(result.codeResult.code);
    const code = result.codeResult.code;
    alert(code);
  });
});
