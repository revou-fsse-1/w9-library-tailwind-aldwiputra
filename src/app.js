function getPageFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let page = urlParams.get('page');

  return page;
}

async function getBooksData() {
  let response = await fetch('./data.json');
  let json = await response.json();
  return json['books'];
}

/* ---------------- Mobile Menu Functionality ---------------- */

const menuBtn = document.querySelector('#m-menu-button');
const menu = document.querySelector('#m-menu');

menuBtn.addEventListener('click', (event) => {
  const icons = menuBtn.querySelectorAll('svg');
  const isExpanded = menuBtn.getAttribute('aria-expanded');

  if (isExpanded === 'false') {
    menuBtn.setAttribute('aria-expanded', true);
    icons[0].classList.add('hidden');
    icons[1].classList.remove('hidden');
    menu.classList.remove('hidden');
  } else {
    menuBtn.setAttribute('aria-expanded', false);
    icons[0].classList.remove('hidden');
    icons[1].classList.add('hidden');
    menu.classList.add('hidden');
  }
});

/* ---------------- Search Functionality ---------------- */

const form = document.querySelector('#form-search');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();

  const booksData = await getBooksData();
  const filteredBooks = booksData.filter(({ title }) =>
    title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    makeNotFoundElement();
    return;
  }

  if (filteredBooks.length > 0) {
    cleanInnerHTML(searchResult);

    filteredBooks.forEach((book) => {
      const title = document.createElement('h4');
      title.innerText = book.title;
      searchResult.appendChild(title);
    });

    makeElementVisible(searchResult);
  }
});

function makeNotFoundElement() {
  const errorMsg = searchResult.querySelector('p');
  if (!errorMsg) {
    cleanInnerHTML(searchResult);

    const errorEl = document.createElement('p');
    errorEl.innerText = 'No books found, please try with another keyword';
    errorEl.classList.add('text-gray-400', 'text-center');

    searchResult.appendChild(errorEl);
    makeElementVisible(searchResult);
  }
}

function makeElementVisible(el) {
  if (el.classList.contains('opacity-0')) {
    el.classList.remove('opacity-0');
  }
}

function cleanInnerHTML(el) {
  el.innerHTML = '';
}
