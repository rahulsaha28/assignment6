const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById("search"); // add for search img
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  gallery.innerHTML = ""; //reset gallery
  displayLoading(document.getElementById("loading"));
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => displaySearchImage(data))
    .catch(err => console.log(err))

}

// display image
const displaySearchImage = (data) => {

  if (data.total != 0) {
    showImages(data.hits);
  }
  // showing error message
  else {
    gallery.innerHTML = ""; // reset the gallery
    document.getElementById("error-message").innerHTML = `
      <div class="alert alert-danger">
         No Data Found. Try again.
      </div>
    `;
  }
  displayLoading(document.getElementById("loading"));
}

const displayLoading = (elementLoad) => {
  elementLoad.classList.toggle("hidden");
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // unselect a image
    sliders = sliders.filter((element, index, newSliders) => index != newSliders.indexOf(img));
    element.classList.remove("added");
    // alert('Hey, Already added !')
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}


// add function when someone search img using button or Enter key
const searchImage = () => {
  document.getElementById("error-message").innerHTML = "";
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
}


searchBtn.addEventListener('click', function () {

  searchImage();

})

// add for search img for enter key
searchInput.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {

    searchImage();

  }

});


sliderBtn.addEventListener('click', function () {
  // check for negative or 0 value of the timer
  if (parseInt(document.getElementById("duration").value) <= 0) {
    alert("Duration time can't negative or zero");
    return;
  }
  createSlider()
})
