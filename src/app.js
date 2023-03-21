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

const menuBtn = document.querySelector('#m-menu-button');
const menu = document.querySelector('#m-menu');

menuBtn.addEventListener('click', event => {
  const icons = menuBtn.querySelectorAll('svg');
  const isExpanded = menuBtn.getAttribute('aria-expanded');

  if (isExpanded === 'false') {
    menuBtn.setAttribute('aria-expanded', true);
    icons[0].classList.remove('block');
    icons[0].classList.add('hidden');
    icons[1].classList.remove('hidden');
    icons[1].classList.add('block');
    menu.classList.remove('hidden');
  } else {
    menuBtn.setAttribute('aria-expanded', false);
    icons[0].classList.remove('hidden');
    icons[0].classList.add('block');
    icons[1].classList.remove('block');
    icons[1].classList.add('hidden');
    menu.classList.add('hidden');
  }
});
