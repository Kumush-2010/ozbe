
setTimeout(() => {
    document.getElementById("preloader").remove();
    document.getElementById("main-content").style.display = "block";
  
    const styleTag = document.querySelector('link[href="style.css"]');
    if (styleTag) styleTag.remove();
  }, 2300);

  