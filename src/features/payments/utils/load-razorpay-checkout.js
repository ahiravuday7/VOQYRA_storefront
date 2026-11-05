const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayLoadPromise = null;

function loadRazorpayCheckout() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Razorpay Checkout requires a browser."));
  }

  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }

  if (razorpayLoadPromise) {
    return razorpayLoadPromise;
  }

  razorpayLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_URL}"]`);

    const handleLoad = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);

        return;
      }

      reject(new Error("Razorpay Checkout loaded but did not initialize."));
    };

    const handleError = () => {
      reject(new Error("Unable to load Razorpay Checkout."));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, {
        once: true,
      });

      existingScript.addEventListener("error", handleError, {
        once: true,
      });

      return;
    }

    const script = document.createElement("script");

    script.src = RAZORPAY_CHECKOUT_URL;

    script.async = true;

    script.addEventListener("load", handleLoad, {
      once: true,
    });

    script.addEventListener("error", handleError, {
      once: true,
    });

    document.body.appendChild(script);
  }).catch((error) => {
    razorpayLoadPromise = null;

    throw error;
  });

  return razorpayLoadPromise;
}

export { loadRazorpayCheckout };
