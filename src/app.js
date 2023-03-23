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

      setTimeout(() => makeNotFoundElement(searchResult), 1500);
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
function makeNotFoundElement(searchResult) {
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

function bookComponent(book, page = 'search') {
  const el = document.createElement('article');
  const isSearch = page === 'search';

  const img = document.createElement('img');
  img.src = book.image;
  img.classList.add('aspect-[6/9]', 'w-[80%]', isSearch ? 'rounded-md' : 'rounded-none');
  el.appendChild(img);

  el.classList.add('border-[1px]', 'border-gray-700', 'border-solid', 'px-4', 'text-gray-400');

  if (page === 'search') {
    el.classList.add(
      'flex',
      'flex-col',
      'xs:flex-row',
      'items-center',
      'hover:bg-gray-700',
      'cursor-pointer',
      'gap-4',
      'py-4',
      'border-b-0',
      'last:border-b-[1px]'
    );

    img.classList.add('xs:w-28');
  } else {
    el.classList.add('pb-4', 'rounded-lg', 'text-center');

    img.classList.add('w-48', 'mx-auto');
  }

  const contentContainer = bookContent(book, page === 'search' ? page : 'books');
  el.appendChild(contentContainer);

  return el;
}

function bookContent(book, page = 'search') {
  const contentContainer = document.createElement('div');

  const heading = document.createElement('h5');
  heading.innerText = book.title;
  heading.classList.add('font-bold', 'text-2xl', 'mb-3');
  contentContainer.appendChild(heading);

  const authors = document.createElement('b');
  authors.innerText = `Author(s): ${book.authors.join(', ')}`;
  contentContainer.appendChild(authors);

  if (page === 'search') {
    const subjects = document.createElement('p');
    subjects.innerText = book.subjects.join(', ');
    contentContainer.appendChild(subjects);
  } else {
    heading.classList.add('mt-6', 'text-white');
  }

  return contentContainer;
}

function loaderComponent() {
  const img = document.createElement('img');
  img.src = '../dist/loading.svg';
  img.classList.add('col-span-full', 'mx-auto');

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
  checkAndRedirect();

  const bookListContainer = document.querySelector('#book-list-container');
  const navItems = Array.from(document.querySelectorAll('.nav-container > li'));
  const pageParam = getParamValue('page');
  const filteredNavItems = navItems.filter(({ innerText }) =>
    pageParam ? innerText === pageParam : innerText === '1'
  );

  filteredNavItems.forEach((item) => item.classList.add('text-white', 'bg-gray-700'));
  addListener(navItems);

  bookListContainer.appendChild(loaderComponent());

  setTimeout(() => {
    cleanInnerHTML(bookListContainer);
    loadBooks(bookListContainer);
  }, 1000);
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

function checkAndRedirect() {
  const pageParam = getParamValue('page');

  if (!pageParam || +pageParam < 1) addPageQueryParam(1);
  if (+pageParam > 2) addPageQueryParam(2);
}

async function loadBooks(bookListContainer) {
  const booksData = await getBooksData();
  const pageParam = getParamValue('page');
  const slicedBooks = booksData.slice(pageParam === '1' ? 0 : 12, pageParam === '1' ? 12 : 20);

  slicedBooks.forEach((book) => {
    bookListContainer.appendChild(bookComponent(book, 'books'));
  });
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
