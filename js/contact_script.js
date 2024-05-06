document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subjectError = document.getElementById("subjectError");
    const messageError = document.getElementById("messageError");

    nameError.textContent = "";
    emailError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";

    if (name.length < 5) {
      nameError.textContent = "Name must be at least 5 characters long.";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      emailError.textContent = "Invalid email address.";
      return;
    }

    if (subject.length < 15) {
      subjectError.textContent = "Subject must be at least 15 characters long.";
      return;
    }

    if (message.length < 25) {
      messageError.textContent = "Message must be at least 25 characters long.";
      return;
    }

    form.submit();
  });
});
