// Define topFunction first
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  }
  
  // Get the button after defining topFunction
  var backToTopBtn = document.getElementById("backToTopBtn");
  
  // When the user clicks on the button, call topFunction
  backToTopBtn.addEventListener("click", function() {
    topFunction();
  });
  
  // When the user scrolls down 50px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };
  
  function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  }
  