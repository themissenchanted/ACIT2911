$('.center').slick({
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
});
function reveal() {
  var field = document.getElementById("registerpassword")
  var eye = document.getElementById("eye")
  if (field.type == "password") {
    field.type = "text"
    eye.className = "fa fa-eye"
  } else {
    field.type = "password"
    eye.className = "fa fa-eye-slash"
  }
}



// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/* Open when someone clicks on the span element */
function openFooter() {
  document.getElementById("myFooter").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeFooter() {
  document.getElementById("myFooter").style.width = "0%";
}
