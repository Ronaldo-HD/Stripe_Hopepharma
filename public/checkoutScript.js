
  function getCookie(name) {
    var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    var value = v ? v[2] : null;
    return value && value !== "undefined" ? value : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000 * days)); // Corrected multiplication
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

  function getSubId() {
    var params = new URLSearchParams(document.location.search.substr(1));
    if (!"{subid}".match("{")) {
      return "{subid}";
    }

    var clientSubid = '<?php echo isset($client) ? $client->getSubid() : "" ?>';
    if (clientSubid && !clientSubid.match(">")) {
      return clientSubid;
    }
    if (params.get("_subid")) {
      return params.get("_subid");
    }
    if (params.get("subid")) {
      return params.get("subid");
    }
    if (getCookie("subid")) {
      return getCookie("subid");
    }
    if (getCookie("_subid")) {
      return getCookie("_subid");
    }
  }

  function getToken() {
    var params = new URLSearchParams(document.location.search.substr(1));
    if (!"{token}".match("{")) {
      return "{token}";
    }

    var clientToken = '<?php echo isset($client) ? $client->getToken() : "" ?>';
    if (clientToken && !clientToken.match(">")) {
      return clientToken;
    }
    if (params.get("_token")) {
      return params.get("_token");
    }
    if (params.get("token")) {
      return params.get("token");
    }
    if (getCookie("token")) {
      return getCookie("token");
    }
    return null;
  }

  function getPixel() {
    var params = new URLSearchParams(document.location.search.substr(1));
    if (!"{pixel}".match("{")) {
      return "{pixel}";
    }
    if (params.get("pixel")) {
      return params.get("pixel");
    }
    if (getCookie("pixel")) {
      return getCookie("pixel");
    }
    return null;
  }

  function sendPostback(element, event, status, payout = 0, tid = '', sub_id_1 = '', sub_id_2 = '') {
    var subId = getSubId();
    var postbackUrl = `http://5.149.248.226/b9a85fd/postback?subid=REPLACE&status=REPLACE&payout=REPLACE/postback?subid=${subId}&status=${status}&payout=${payout}&tid=${tid}&sub_id_1=${sub_id_1}&sub_id_2=${sub_id_2}`;
    var redirectUrl = element.getAttribute('href');
    event.preventDefault();

    fetch(postbackUrl)
      .then(response => {
        if (response.ok) {
          console.log("Postback sent successfully");
        } else {
          console.error("Error sending postback");
        }
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      })
      .catch(error => {
        console.error("Error sending request:", error);
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    console.log("Checkout script activated")
    var params = new URLSearchParams(document.location.search.substr(1));
    var subid = getSubId();
    var token = getToken();
    var pixel = getPixel();

    params.set("_token", token);
    setCookie("pixel", pixel);
    setCookie("token", token);
    setCookie("subid", subid);

    document.querySelectorAll("a").forEach(function (link)
 {
      try {
        var url = new URL(link.href);
        params.forEach(function (v, k) {
          url.searchParams.append(k, v);
        });
        link.href = url.toString();
      } catch (e) {
        console.error(`[Exception] Bad params: unexpected link '${link.href}' for new Url()`);
      }
    });

    var SUBID_TEMPLATE_NAME = "subid";
    var TOKEN_TEMPLATE_NAME = "token";
    var PIXEL_TEMPLATE_NAME = "pixel";
    var subIdRegExp = new RegExp(`\{${SUBID_TEMPLATE_NAME}\}`, "g");
    var tokenRegExp = new RegExp(`\{${TOKEN_TEMPLATE_NAME}\}`, "g");
    var pixelRegExp = new RegExp(`\{${PIXEL_TEMPLATE_NAME}\}`, "g");

    document.querySelectorAll('input[type="hidden"]').forEach(function (input) {
      if (subIdRegExp.test(input.value)) {
        input.value = input.value.replaceAll(subIdRegExp, subid);
      }
      if (tokenRegExp.test(input.value)) {
        input.value = input.value.replaceAll(tokenRegExp, token);
      }
      if (pixelRegExp.test(input.value)) {
        input.value = input.value.replaceAll(pixelRegExp, pixel);
      }
    });

    document.querySelectorAll("form").forEach(function (form) {
      params.forEach(function (v, k) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.append(input);
      });
    });
  });
