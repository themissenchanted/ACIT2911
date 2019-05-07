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
        slidesToShow: 3
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
