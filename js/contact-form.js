$(document).ready(function () {
  "use strict";

  var $form = $("#contactForm");

  if (!$form.length) {
    return;
  }

  var $submitButton = $form.find('button[type="submit"]');
  var $status = $("#contactFormStatus");
  var defaultButtonText = $submitButton.text().trim();

  function showStatus(type, message) {
    $status
      .removeClass("d-none alert-success alert-danger alert-info")
      .addClass("alert-" + type)
      .text(message);
  }

  $form.on("submit", function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    $status.addClass("d-none").text("");
    $submitButton.prop("disabled", true).text("Enviando...");

    $.ajax({
      url: $form.attr("action"),
      method: "POST",
      data: $form.serialize(),
      dataType: "json"
    })
      .done(function (response) {
        if (!response || response.success !== true) {
          showStatus("danger", "Não foi possível enviar a mensagem. Tente novamente.");
          return;
        }

        showStatus("success", response.message);
        $form[0].reset();
      })
      .fail(function (xhr) {
        var response = xhr.responseJSON;
        var message = response && response.message
          ? response.message
          : "Não foi possível enviar a mensagem agora. Tente novamente mais tarde.";

        showStatus("danger", message);
      })
      .always(function () {
        $submitButton.prop("disabled", false).text(defaultButtonText);
      });
  });
});
