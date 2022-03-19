"use strict";
/*** For testing ***/
// const url = "articles.json";

/***********/
/*** Registered token ***/
/***********/

const token = "c539d252c8d0a7349c82e59ba7012c7a";
// const token = "0e13746a0fb36c8875e6d93887a79fee";

/***********/
/*** General Functions ***/
/***********/
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeImgActiveClass() {
  const listImage = document.querySelectorAll(".latest-new-img");
  for (let i = 0; i < listImage.length; i++) {
    if (listImage[i].classList.contains("img-active")) {
      listImage[i].classList.remove("img-active");
    }
  }
}

function addActiveClassForFistImage() {
  const listImage = document.querySelectorAll(".latest-new-img");
  listImage[0].classList.add("img-active");
}

/***********/
/*** Get the headlines News and shown in headline carousel and Latest News section ***/
/***********/

/**
 * @description Get data from API
 * @param {function} callback
 */
function getData(callback) {
  let url = `https://gnews.io/api/v4/top-headlines?&lang=en&token=${token}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data.articles;
    })
    .then(function (data) {
      callback(data);
    })
    .catch(function (error) {
      alert("Out of Request Quota!");
      document.querySelector(".overlay").classList.remove("hidden");
      console.log(error);
    });
}

/**************************************************** */
/**
 * @description Take data from getData() promise then run the function inside
 * @param {object} data
 */
function successfully(data) {
  const articles = data;

  // If data is fully fetched and return, hidden loading box
  if (articles != "") {
    document.querySelector(".overlay").classList.add("hidden");
  }

  // Get the first article then immidetely put to the carousel fistSlide (to fix the firsSlide is disappeared when carousel is started)
  const firstArticle = articles[0];
  const firstSlideTemplate = `<img src="${firstArticle.image}" alt="${firstArticle.title}" id="headlineNewsImage" />
                              <div class="content-first-slide">
                                <div class="text">
                                  <h1>
                                    <a href="${firstArticle.url}" target="_blank">${firstArticle.title}</a>
                                  </h1>
                                  <p>${firstArticle.description}</p>
                                  <p class="publish-date">${firstArticle.publishedAt}</p>
                                </div>
                              </div>`;

  document.querySelector("#firstSlide").innerHTML = firstSlideTemplate;

  /**************************************************** */
  /**
   * @description Take the rest Headlines News form fetched data and show all in carousel
   * @param {object} articles
   */
  function headlinesNews(articles) {
    // User Array.map() to loop throught {articles} and return the new Array that content HTML tags and data (from articles's value) inside
    const template = articles.map(function (article) {
      return `  <div class="mySlides">
                  <img src="${article.image}" alt="${article.title}" />
                  <div class="content">
                    <div class ="text">
                      <h1><a href="${article.url}" target="_blank">${article.title}</a></h1>
                      <p>${article.description}</p>
                      <p class="publish-date">${article.publishedAt}</p>
                    </div>
                  </div>
                </div>`;
    });

    // Convert Array to String
    const headlineHTML = template.join("");
    // Put the HTML template (included data inside) back to carousel
    document.getElementById("headline").innerHTML = headlineHTML;

    // Wait for 2s then hidden the firsSlide as all data is already loaded and displayed. (2s is the timeOut in every slide move)
    sleep(2000).then(
      () => (document.querySelector("#firstSlide").style.display = "none")
    );
  }

  /**************************************************** */
  /**
   * @description Get the 4 first news from headlines then show it in Latest News section
   * @param {object} articles
   */

  function latestNews(articles) {
    // Get the first news
    const firstArticle = articles[0];

    const fistNewsTemplate = `<img class="article-image" src="${firstArticle.image}" alt="${firstArticle.title}" />
                                <div class="articles">
                                  <div class="articles-content">
                                    <div class="article-title">
                                      <h1><a href="${firstArticle.url}" target="_blank">${firstArticle.title}</a></h1>
                                    </div>
                                    <div class="article-content">
                                      <p>${firstArticle.content}</p>
                                      <p><a href="${firstArticle.url}" target="_blank">Read more...</a></p>
                                    </div>
                                    <div class="article-publishedAt">
                                    <p>${firstArticle.publishedAt}</p>
                                    </div>
                                    <div class="article-source">
                                    <p><a href="${firstArticle.source.url}" target="_blank">${firstArticle.source.name}</a></p>
                                    </div>
                                  </div>
                                </div>`;
    // Show the first news as default view
    document.querySelector("#latestNewsContent").innerHTML = fistNewsTemplate;

    // User Array.map() to loop throught {articles} and return the new Array that content HTML tags and data inside (limit to 4 post only)
    const template = articles.map(function (article, index) {
      while (index < 4) {
        return `<li><img id="latestNewsImg" class="latest-new-img" src="${article.image}" alt="${article.title}" /></li>`;
      }
    });

    // Convert Array to String
    const latestNewsHTML = template.join("");
    // Put the HTML template (included data inside) back to Latest News section
    document.getElementById("listLatestNews").innerHTML = latestNewsHTML;
    // Add "imag-active" class for the fist item in list (in left panel)
    addActiveClassForFistImage();

    // Add "click" event for every image in the left panel
    document.querySelectorAll("#latestNewsImg").forEach(function (img) {
      img.addEventListener("click", function () {
        // Get the article title inside image {alt} attribute
        const altText = this.getAttribute("alt");
        // Find the article with the title took from image alt
        const foundArticle = articles.find(function (article) {
          return article.title === altText;
        });

        const foundArticleTemplate = `<img class="article-image" src="${foundArticle.image}" alt="${foundArticle.title}" />
                                <div class="articles">
                                  <div class="articles-content">
                                    <div class="article-title">
                                      <h1><a href="${foundArticle.url}" target="_blank">${foundArticle.title}</a></h1>
                                    </div>
                                    <div class="article-content">
                                      <p>${foundArticle.content}</p>
                                      <p><a href="${foundArticle.url}" target="_blank">Read more...</a></p>
                                    </div>
                                    <div class="article-publishedAt">
                                    <p>${foundArticle.publishedAt}</p>
                                    </div>
                                    <div class="article-source">
                                    <p><a href="${foundArticle.source.url}" target="_blank">${foundArticle.source.name}</a></p>
                                    </div>
                                  </div>
                                </div>`;
        // Show the founded article inside the right panel
        document.querySelector("#latestNewsContent").innerHTML =
          foundArticleTemplate;

        // Remove "img-active" class for all list item
        removeImgActiveClass();
        // Add "img-active" for current select item
        this.classList.add("img-active");
      });
    });
  }

  /**************************************************** */
  headlinesNews(articles);
  latestNews(articles);
  // console.log(data);
}

// Run getData()
getData(successfully);

/***********/
/*** Get the News depend on news type (e.g. politics, sports, ents,...) and shown in every sepecific sections ***/
/***********/

/**
 * @description Get data from API
 * @param {*} callback
 * @param {*} articleType
 */
function getDataByType(callback, articleType) {
  let url = `https://gnews.io/api/v4/search?q=${articleType}&lang=en&token=${token}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data.articles;
    })
    .then(function (data) {
      // console.log(data);
      callback(data, articleType);
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**************************************************** */
/**
 * @description Take data from getDataByType() promise then run the function inside
 * @param {*} data
 * @param {*} articleType
 */
function successfullyByType(data, articleType) {
  const articles = data;

  // User Array.map() to loop throught {articles} and return the new Array that content HTML tags and data (from articles's value) inside
  const template = articles.map(function (article) {
    return `<div class="col-sm-12 col-m-6 col-4 news-content">
                  <img src="${article.image}" alt="${article.title}" />
                  <div class="news-title">
                    <a href="${article.url}" target="_blank"><h3>${article.title}</h3>
                  </a></div>
                  <div class="news-description">
                    <p>${article.content}</p>
                    <p><a href="${article.url}" target="_blank">Read more...</a></p>
                  </div>
                  <div class="news-publishedAt">
                    <p>${article.publishedAt}</p>
                  </div>
                  <div class="news-source">
                    <p>${article.source.name}</p>
                    <p><a href="${article.source.url}" target="_blank">${article.source.url}</a></p>
                  </div>
                </div>`;
  });

  // Get the first 3 News as default
  const listArticlesHTML = template.slice(0, 3).join("");
  // Show 3 News in HTML
  document.getElementById(`${articleType}News`).innerHTML = listArticlesHTML;

  // Get Button View All Element
  const viewAllBtn = document.getElementById(articleType);

  // Add Event for button view all
  viewAllBtn.addEventListener("click", function () {
    if (!this.classList.contains("view-all-active")) {
      // If button view does not contain "view-all-active" class -> add "view-all-active" class then show all news into HTML
      const listArticlesHTML = template.join("");

      document.getElementById(`${articleType}News`).innerHTML =
        listArticlesHTML;
      this.classList.add("view-all-active");
    } else {
      // Remove "view-all-active" class then show only 3 first new into HTML
      const listArticlesHTML = template.slice(0, 3).join("");
      document.getElementById(`${articleType}News`).innerHTML =
        listArticlesHTML;
      this.classList.remove("view-all-active");
    }
  });
}

/**************************************************** */
/**
 * Request data to API
 * Use sleep() to hold the next request for 2s after the previous request is done
 * => Prevent "too many request at the short time" problem
 */
sleep(2000)
  .then(() => getDataByType(successfullyByType, "politics"))
  .then(() => sleep(2000))
  .then(() => getDataByType(successfullyByType, "sports"))
  .then(() => sleep(2000))
  .then(() => getDataByType(successfullyByType, "entertainments"));

/***********/
/*** Search news with keyword then display all result inside a modal ***/
/***********/

/**
 * @description Search an Articles by Keyword
 */
function searchArticles() {
  const keyword = document.getElementById("searchKeyword").value;
  const dateFrom = document.getElementById("dateFrom").value;
  const dataTo = document.getElementById("dateTo").value;

  let url = `https://gnews.io/api/v4/search?q=${keyword}&from=${dateFrom}T00:00:00Z&to=${dataTo}T00:00:00Z&lang=en&token=c539d252c8d0a7349c82e59ba7012c7a`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const articles = data.articles;
      return articles;
    })
    .then(function (articles) {
      const template = articles.map(function (article) {
        return `<li>
                  <div class="row">
                    <div class="col-3" id="foundArticleImage">
                    <a href="${article.url}" target="_blank">
                      <img class="found-article-img" src="${article.image}" alt="${article.title}">
                    </a>
                    </div>
                    <div class="col-sm-12 col-9">
                      <div class="found-article-content">
                        <a href="${article.url}" target="_blank">
                          <h2>${article.title}</h2>
                        </a>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">
                          <p class="text-main-color">Read more...</p>
                        </a>
                        <p><i>${article.publishedAt}</i></p>
                        <p>Source: <b><i>${article.source.name}</i></b></p>
                      </div>
                    </div>
                  </div>
                </li>`;
      });

      // Display the user input Keywords into HTML
      document.getElementById(
        "showKeyword"
      ).innerHTML = `<h3>Search for <i>"${keyword}"</i></h3>`;

      // Check the result
      if (template.length === 0) {
        // Return warning when no artiles are return
        document.getElementById(
          "foundArticles"
        ).innerHTML = `<h2>404! No Acticles found!</h2>`;
      } else {
        // Display the searched result in HTML
        const foundArticle = template.join("");
        document.getElementById("foundArticles").innerHTML = foundArticle;
      }

      // Hidden the Overlay loading
      document.querySelector(".overlay").classList.add("hidden");
      // Show the Overlay for Search modal
      document.querySelector(".overlay-only").classList.remove("hidden");
      // Show the modal that content search result
      document.querySelector(".modal-wrapper").classList.remove("hidden");
      // Remove search panel
      document.querySelector("#newsSearchPanel").classList.add("hidden");
      // Scroll back to the top of page
      window.scrollTo(0, 0);
    })
    .catch(function (error) {
      console.log(error);
    });
}

/**************************************************** */
/**
 * @description Show Pick Date Option when user select search include date
 */
function checkSearchByDate() {
  const checkBox = document.getElementById("byDate");
  const dateForm = document.getElementById("searchByDate");

  if (checkBox.checked == true) {
    dateForm.classList.remove("hidden");
  } else {
    dateForm.classList.add("hidden");
  }
}

/**************************************************** */
/**
 * @description Close Search Modal
 */
function closeModal() {
  // Hidden Modal
  document.querySelector(".modal-wrapper").classList.add("hidden");
  // Set value of Search Input field back to null
  document.querySelector("#searchKeyword").value = "";
  // Hidden the Search Panel
  document.querySelector("#newsSearchPanel").classList.add("hidden");
  // Hidden the Overlay box
  document.querySelector(".overlay-only").classList.add("hidden");
  // Scroll back to top of page
  window.scrollTo(0, 0);
}

/**************************************************** */
// Add Event for Keyword Input (Event occur when user enter value into input field)
document.getElementById("searchKeyword").addEventListener("input", function () {
  if (this.value) {
    // Show Search Panel when user input something
    document.getElementById("newsSearchPanel").classList.remove("hidden");
  } else {
    // Hidden Search Panel when user clear input
    document.getElementById("newsSearchPanel").classList.add("hidden");
  }
});
// Add Event to let user able to start searching via press Enter key
document
  .getElementById("searchKeyword")
  .addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      if (!this.value) {
        return;
      }
      searchArticles();
      // Show the Overlay box
      document.querySelector(".overlay").classList.remove("hidden");
    }
  });

// Add Event to let user start searching by click on Search button
document.getElementById("btnSearch").addEventListener("click", function () {
  searchArticles();
  // Show the Overlay box
  document.querySelector(".overlay").classList.remove("hidden");
});

// Add Event Close modal when user click on Close button
document.querySelector(".close-modal").addEventListener("click", closeModal);
// Add Event Close modal when user click on X button
document
  .querySelector(".btn-close-modal")
  .addEventListener("click", closeModal);
// Add Event Close modal when user click outside modal
document.querySelector(".overlay-only").addEventListener("click", closeModal);

/***********/
/*** Add Active Class for the select item in Menu Bar ***/
/***********/

/**
 * @description Remove all active class from all menu item
 */
function removeActiveClass() {
  const menuItemList = document.querySelectorAll(".menu-item");

  for (let i = 0; i < menuItemList.length; i++) {
    if (menuItemList[i].classList.contains("li-active")) {
      menuItemList[i].classList.remove("li-active");
    }
  }
}

// Add Event to every menu item on the Menu Bar
document.querySelectorAll(".menu-item").forEach(function (item) {
  item.addEventListener("click", function () {
    // If menu item is clicked, remove all active class from other menu item then add this class to current select item
    removeActiveClass();
    this.classList.add("li-active");
  });
});

/***********/
/*** Headlines Carousel (Source from W3S) ***/
/* Bug: Only autimatically slideshow, unable to select specific slide
/* Bug: Unable to fit full size of image for every slide as source imge res is not the same
/***********/
// Create a Dot in carousel
let numDot = "";
for (let i = 0; i < 10; i++) {
  numDot += `<span class="dot"></span>`;
}
document.getElementById("slideDot").innerHTML = numDot;

let slideIndex = 0;
showSlides();

// // Thumbnail image controls
function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}
