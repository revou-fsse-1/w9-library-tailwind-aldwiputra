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

/* ------------------ Search Functionality ------------------ */
if (window.location.pathname === '/src' || window.location.pathname === '/src/index.html') {
  const form = document.querySelector('#form-search');
  const searchInput = document.querySelector('#search-input');
  const searchResult = document.querySelector('#search-result');

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    if (searchInput.value === '') {
      cleanInnerHTML(searchResult);
      searchResult.classList.add('opacity-0');
      return;
    }

    const booksData = await getBooksData();
    const filteredBooks = booksData.filter(({ title }) =>
      title.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    if (filteredBooks.length === 0) {
      cleanInnerHTML(searchResult);

      searchResult.appendChild(loaderComponent());
      makeElementVisible(searchResult);

      setTimeout(makeNotFoundElement, 1500);
      return;
    }

    if (filteredBooks.length > 0) {
      cleanInnerHTML(searchResult);

      searchResult.appendChild(loaderComponent());
      makeElementVisible(searchResult);

      setTimeout(() => {
        cleanInnerHTML(searchResult);
        filteredBooks.forEach((book) => {
          const bookEl = bookComponent(book);
          searchResult.appendChild(bookEl);
        });
      }, 1500);
    }
  });
}
function makeNotFoundElement() {
  const errorMsg = searchResult.querySelector('#error-msg');

  if (!errorMsg) {
    cleanInnerHTML(searchResult);

    const errorEl = document.createElement('p');
    errorEl.id = 'error-msg';
    errorEl.innerText = 'No books found, please try with another keyword';
    errorEl.classList.add('text-gray-400', 'text-center');

    searchResult.appendChild(errorEl);
  }
}

function bookComponent(book) {
  const el = document.createElement('article');
  el.classList.add(
    'flex',
    'flex-col',
    'xs:flex-row',
    'items-center',
    'hover:bg-gray-700',
    'cursor-pointer',
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
  img.classList.add('aspect-[6/9]', 'w-[80%]', 'xs:w-28', 'rounded-md');
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

function loaderComponent() {
  const img = document.createElement('img');
  img.src = '../dist/loading.svg';
  img.classList.add('mx-auto');

  return img;
}

function makeElementVisible(el) {
  if (el.classList.contains('opacity-0')) {
    el.classList.remove('opacity-0');
  }
}

function cleanInnerHTML(el) {
  el.innerHTML = '';
}

/* ----------------- Pagination Functionality ----------------- */

if (window.location.pathname === '/src/books.html') {
  const navItems = Array.from(document.querySelectorAll('.nav-container > li'));
  addListener(navItems);
}

function addPageQueryParam(page) {
  const url = new URL(window.location);
  url.searchParams.set('page', page.toString());
  window.location.href = url.toString();
}

function getParamValue(key) {
  const param = new URLSearchParams(window.location.search);
  return param.get(key);
}

function addListener(navItems) {
  navItems.forEach((navItem) => {
    switch (navItem.innerText) {
      case 'Previous':
        navItem.addEventListener('click', (evt) => {
          const pageParam = getParamValue('page');
          if (+pageParam > 1) {
            addPageQueryParam(+pageParam - 1);
          }
        });
        break;
      case '1':
        navItem.addEventListener('click', (evt) => {
          addPageQueryParam(1);
        });
        break;
      case '2':
        navItem.addEventListener('click', (evt) => {
          addPageQueryParam(2);
        });
        break;
      case 'Next':
        navItem.addEventListener('click', (evt) => {
          const pageParam = getParamValue('page');
          if (+pageParam < 2) {
            addPageQueryParam(+pageParam + 1);
          }
        });
        break;
    }
  });
}
