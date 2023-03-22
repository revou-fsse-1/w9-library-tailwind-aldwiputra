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
      const bookEl = bookComponent(book);
      searchResult.appendChild(bookEl);
    });

    makeElementVisible(searchResult);
  }
});

function makeNotFoundElement() {
  const errorMsg = searchResult.querySelector('#error-msg');

  if (!errorMsg) {
    cleanInnerHTML(searchResult);

    const errorEl = document.createElement('p');
    errorEl.id = 'error-msg';
    errorEl.innerText = 'No books found, please try with another keyword';
    errorEl.classList.add('text-gray-400', 'text-center');

    searchResult.appendChild(errorEl);
    makeElementVisible(searchResult);
  }
}

function bookComponent(book) {
  const el = document.createElement('article');
  el.classList.add(
    'flex',
    'items-center',
    'gap-4',
    'text-gray-400',
    'p-4',
    'border-[1px]',
    'border-gray-700',
    'border-solid',
    'border-b-0',
    'last:border-b-[1px]'
  );

  const img = document.createElement('img');
  img.src = book.image;
  img.classList.add('aspect-[6/9]', 'w-24', 'rounded-md');
  el.appendChild(img);

  const contentContainer = bookContent(book);
  el.appendChild(contentContainer);

  return el;
}

function bookContent(book) {
  const contentContainer = document.createElement('div');

  const heading = document.createElement('h5');
  heading.innerText = book.title;
  heading.classList.add('font-bold', 'text-2xl', 'mb-3');
  contentContainer.appendChild(heading);

  const authors = document.createElement('b');
  authors.innerText = `Author(s): ${book.authors.join(', ')}`;
  contentContainer.appendChild(authors);

  const subjects = document.createElement('p');
  subjects.innerText = book.subjects.join(', ');
  contentContainer.appendChild(subjects);

  return contentContainer;
}

function makeElementVisible(el) {
  if (el.classList.contains('opacity-0')) {
    el.classList.remove('opacity-0');
  }
}

function cleanInnerHTML(el) {
  el.innerHTML = '';
}
