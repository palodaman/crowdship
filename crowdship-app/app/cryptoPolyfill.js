// cryptoPolyfill.js
if (typeof window !== "undefined") {
    window.crypto = {
      getRandomValues: (arr) => {
        if (!(arr && arr instanceof Uint8Array)) {
          throw new TypeError("Expected input to be Uint8Array");
        }
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
    };
  }

  /*This code was developed with the assistance of ChatGPT and Copilot*/