const navSlide = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");
  const navLinksA = document.querySelectorAll(".nav-links a[href^='#']");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 +
          0.4}s`;
      }
    });
  });

  navLinksA.forEach(item => {
    item.addEventListener('click', scrollToIdOnClick);
  });

  function scrollToIdOnClick(event) {
    event.preventDefault();
    const to = getScrollTopByHref(event.target) - 30;

    scrollToPosition(to)
  }

  function scrollToPosition(to) {
    window.scroll({
      top: to,
      behavior: 'smooth'
    })
  }

  function getScrollTopByHref(element) {
    const id = element.getAttribute('href')
    return document.querySelector(id).offsetTop;
  }

};

navSlide();