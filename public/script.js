/*
 * Authors: Safa, Najah, Waslat, Nabiha
 * Merged and cleaned final version
 */

// Questionnaire screens
const introScreen = document.getElementById('intro-screen');
const skinTypeScreen = document.getElementById('skin-type-screen');
const skinConcernScreen = document.getElementById('skin-concern-screen');
const acneScreen = document.getElementById('acne-screen');
const thankYouScreen = document.getElementById('thank-you-screen');

const startBtn = document.getElementById('start-btn');
const skinTypeNextBtn = document.getElementById('skin-type-next-btn');
const skinConcernNextBtn = document.getElementById('skin-concern-next-btn');
const acneNextBtn = document.getElementById('acne-next-btn');

const skinTypeError = document.getElementById('skin-type-error');
const skinConcernError = document.getElementById('skin-concern-error');
const acneError = document.getElementById('acne-error');

const recommendedIngredientsList = document.getElementById('recommended-ingredients-list');
const goToRecommendationBtn = document.getElementById('go-to-recommendation-btn');

if (startBtn && introScreen && skinTypeScreen) {
  startBtn.addEventListener('click', function () {
    introScreen.classList.add('hidden');
    skinTypeScreen.classList.remove('hidden');
  });
}

function selectInputById(id) {
  const input = document.getElementById(id);
  if (input) input.checked = true;
}

if (skinTypeNextBtn && skinTypeScreen && skinConcernScreen) {
  skinTypeNextBtn.addEventListener('click', function () {
    const selectedSkinType = document.querySelector('input[name="skin-type"]:checked');
    if (!selectedSkinType) {
      if (skinTypeError) skinTypeError.classList.remove('hidden');
      return;
    }
    if (skinTypeError) skinTypeError.classList.add('hidden');
    skinTypeScreen.classList.add('hidden');
    skinConcernScreen.classList.remove('hidden');
  });
}

if (skinConcernNextBtn && skinConcernScreen && acneScreen) {
  skinConcernNextBtn.addEventListener('click', function () {
    const selectedConcerns = document.querySelectorAll('input[name="skin-concern"]:checked');
    if (selectedConcerns.length === 0) {
      if (skinConcernError) skinConcernError.classList.remove('hidden');
      return;
    }
    if (skinConcernError) skinConcernError.classList.add('hidden');
    skinConcernScreen.classList.add('hidden');
    acneScreen.classList.remove('hidden');
  });
}

if (acneNextBtn && acneScreen && thankYouScreen) {
  acneNextBtn.addEventListener('click', async function () {
    const selectedAcne = document.querySelector('input[name="acne"]:checked');
    if (!selectedAcne) {
      if (acneError) acneError.classList.remove('hidden');
      return;
    }
    if (acneError) acneError.classList.add('hidden');

    const selectedSkinType = document.querySelector('input[name="skin-type"]:checked')?.value;
    const selectedConcerns = Array.from(document.querySelectorAll('input[name="skin-concern"]:checked')).map(function (input) {
      return input.value;
    });
    const selectedAcneType = selectedAcne.value;

    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skinType: selectedSkinType,
          concerns: selectedConcerns,
          acneType: selectedAcneType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data.error || 'Questionnaire submission failed.');
        return;
      }

      // GET: Retrieve the saved recommendations from PostgreSQL
      const savedResponse = await fetch(`/api/questionnaire/${data.resultId}`);

      if (!savedResponse.ok) {
        throw new Error('Failed to retrieve saved recommendations');
      }

      const savedResult = await savedResponse.json();

      if (recommendedIngredientsList) {
        recommendedIngredientsList.innerHTML = '';
        savedResult.recommended_ingredients.forEach(function (ingredient) {
          const li = document.createElement('li');
          li.textContent = ingredient;
          recommendedIngredientsList.appendChild(li);
        });
      }

      acneScreen.classList.add('hidden');
      thankYouScreen.classList.remove('hidden');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  });
}

// Questionnaire popups
const skinTypePopup = document.getElementById('skin-type-popup');
const closeSkinTypePopupBtn = document.getElementById('close-skin-type-popup');
const skinTypeButtons = document.querySelectorAll('.skin-option');
const normalImage = document.getElementById('normal-image');
const dryImage = document.getElementById('dry-image');
const oilyImage = document.getElementById('oily-image');
const combinationImage = document.getElementById('combination-image');

function hideSkinTypeImages() {
  [normalImage, dryImage, oilyImage, combinationImage].forEach(function (image) {
    if (image) image.classList.add('hidden');
  });
}

skinTypeButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const selectedSkin = button.dataset.skin;
    selectInputById('skin-' + selectedSkin);
    hideSkinTypeImages();
    if (skinTypePopup) skinTypePopup.classList.remove('hidden');

    if (selectedSkin === 'normal' && normalImage) normalImage.classList.remove('hidden');
    if (selectedSkin === 'dry' && dryImage) dryImage.classList.remove('hidden');
    if (selectedSkin === 'oily' && oilyImage) oilyImage.classList.remove('hidden');
    if (selectedSkin === 'combination' && combinationImage) combinationImage.classList.remove('hidden');
  });
});

if (closeSkinTypePopupBtn && skinTypePopup) {
  closeSkinTypePopupBtn.addEventListener('click', function () {
    skinTypePopup.classList.add('hidden');
  });
}

const skinConcernPopup = document.getElementById('skin-concern-popup');
const closeSkinConcernPopupBtn = document.getElementById('close-concern-popup');
const skinConcernButtons = document.querySelectorAll('.skin-concern');
const drynessImage = document.getElementById('dryness-image');
const oilinessImage = document.getElementById('oiliness-image');
const poresImage = document.getElementById('pores-image');
const hyperpigmentationImage = document.getElementById('hyperpigmentation-image');
const dullnessImage = document.getElementById('dullness-image');

function hideSkinConcernImages() {
  [drynessImage, oilinessImage, poresImage, hyperpigmentationImage, dullnessImage].forEach(function (image) {
    if (image) image.classList.add('hidden');
  });
}

skinConcernButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const selectedConcern = button.dataset.concern;
    const concernInput = document.getElementById(selectedConcern);
    if (concernInput) concernInput.checked = !concernInput.checked;

    hideSkinConcernImages();
    if (skinConcernPopup) skinConcernPopup.classList.remove('hidden');

    if (selectedConcern === 'dryness' && drynessImage) drynessImage.classList.remove('hidden');
    if (selectedConcern === 'oiliness' && oilinessImage) oilinessImage.classList.remove('hidden');
    if (selectedConcern === 'pores' && poresImage) poresImage.classList.remove('hidden');
    if (selectedConcern === 'hyperpigmentation' && hyperpigmentationImage) hyperpigmentationImage.classList.remove('hidden');
    if (selectedConcern === 'dullness' && dullnessImage) dullnessImage.classList.remove('hidden');
  });
});

if (closeSkinConcernPopupBtn && skinConcernPopup) {
  closeSkinConcernPopupBtn.addEventListener('click', function () {
    skinConcernPopup.classList.add('hidden');
  });
}

const acnePopup = document.getElementById('acne-popup');
const closeAcnePopupBtn = document.getElementById('close-acne-popup');
const acneButtons = document.querySelectorAll('.acne');
const hormonalImage = document.getElementById('hormonal-image');
const comedonalImage = document.getElementById('comedonal-image');
const inflammatoryImage = document.getElementById('inflammatory-image');
const cysticImage = document.getElementById('cystic-image');

function hideAcneImages() {
  [hormonalImage, comedonalImage, inflammatoryImage, cysticImage].forEach(function (image) {
    if (image) image.classList.add('hidden');
  });
}

acneButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const selectedAcne = button.dataset.acne;
    selectInputById(selectedAcne);
    hideAcneImages();
    if (acnePopup) acnePopup.classList.remove('hidden');

    if (selectedAcne === 'hormonal' && hormonalImage) hormonalImage.classList.remove('hidden');
    if (selectedAcne === 'comedonal' && comedonalImage) comedonalImage.classList.remove('hidden');
    if (selectedAcne === 'inflammatory' && inflammatoryImage) inflammatoryImage.classList.remove('hidden');
    if (selectedAcne === 'cystic' && cysticImage) cysticImage.classList.remove('hidden');
  });
});

if (closeAcnePopupBtn && acnePopup) {
  closeAcnePopupBtn.addEventListener('click', function () {
    acnePopup.classList.add('hidden');
  });
}

const noAcneLabel = document.querySelector('.no-acne-label');
if (noAcneLabel) {
  noAcneLabel.addEventListener('click', function () {
    selectInputById('no-acne');
    if (acnePopup) acnePopup.classList.add('hidden');
  });
}

if (goToRecommendationBtn) {
  goToRecommendationBtn.addEventListener('click', function () {
    window.location.href = 'recommendation.html';
  });
}

// Home popup ad and newsletter form
window.addEventListener('load', function () {
  setTimeout(function () {
    const popupAd = document.getElementById('popupAd');
    if (popupAd) popupAd.style.display = 'flex';
  }, 1000);
});

function closeAd() {
  const popupAd = document.getElementById('popupAd');
  if (popupAd) popupAd.style.display = 'none';
}
window.closeAd = closeAd;

const signupForm = document.getElementById('signupForm');
const formMessage = document.getElementById('formMessage');

if (signupForm) {
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const birthday = (document.getElementById('birthday')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();

    if (!email) {
      if (formMessage) formMessage.textContent = 'Please enter your email.';
      return;
    }

    if (formMessage) formMessage.textContent = 'Submitting...';

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, birthday }),
      });

      const data = await response.json();
      if (formMessage) formMessage.textContent = data.message || 'Submitted.';
      if (response.ok) signupForm.reset();
    } catch (error) {
      console.error(error);
      if (formMessage) formMessage.textContent = 'Server error. Please try again.';
    }
  });
}

// Add to bag and site search
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product-card');
const allSearchBars = document.querySelectorAll('.site-search');
let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  alert(name + ' added to your bag!');
}
window.addToCart = addToCart;

function getPageLink(pageName) {
  const isInsidePagesFolder = window.location.pathname.includes('/pages/');
  if (pageName === 'index.html') return isInsidePagesFolder ? '../index.html' : 'index.html';
  return isInsidePagesFolder ? pageName : 'pages/' + pageName;
}


const searchRoutes = [
  { keywords: ['cleanser', 'face wash', 'gentle daily cleanser', 'wash'], page: 'shop.html', hash: '#cleanser-card', shopQuery: 'cleanser' },
  { keywords: ['moisturizer', 'moisturiser', 'aloe', 'calming aloe moisturizer', 'cream'], page: 'shop.html', hash: '#moisturizer-card', shopQuery: 'moisturizer' },
  { keywords: ['serum', 'hyaluronic', 'hydrating hyaluronic serum'], page: 'shop.html', hash: '#serum-card', shopQuery: 'serum' },
  { keywords: ['shop', 'products', 'buy'], page: 'shop.html', hash: '', shopQuery: '' },
];

function filterShopProducts(query) {
  productCards.forEach(function (card) {
    const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
    const productDesc = card.querySelector('.product-desc')?.textContent.toLowerCase() || '';
    card.style.display = query === '' || productName.includes(query) || productDesc.includes(query) ? 'flex' : 'none';
  });
}

function runSiteSearch(query) {
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery === '') return;

  const matchedRoute = searchRoutes.find(function (route) {
    return route.keywords.some(function (keyword) {
      return cleanQuery.includes(keyword) || keyword.includes(cleanQuery);
    });
  });

  if (matchedRoute) {
    let targetUrl = getPageLink(matchedRoute.page);
    if (matchedRoute.page === 'shop.html' && matchedRoute.shopQuery) {
      targetUrl += '?q=' + encodeURIComponent(matchedRoute.shopQuery);
    }
    targetUrl += matchedRoute.hash;
    window.location.href = targetUrl;
  } else {
    alert('No matching page or product was found.');
  }
}

if (searchInput) {
  searchInput.addEventListener('input', function () {
    filterShopProducts(this.value.trim().toLowerCase());
  });
}

allSearchBars.forEach(function (bar) {
  bar.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSiteSearch(bar.value);
    }
  });
});

const params = new URLSearchParams(window.location.search);
const searchQueryFromURL = params.get('q');
if (searchInput && searchQueryFromURL) {
  searchInput.value = searchQueryFromURL;
  filterShopProducts(searchQueryFromURL.toLowerCase());
}

// Authentication
const cartLoginBtn = document.getElementById('cart-login-btn');
const authChoicePopup = document.getElementById('auth-choice-popup');
const authFormPopup = document.getElementById('auth-form-popup');
const closeAuthChoicePopupBtn = document.getElementById('close-auth-choice-popup');
const closeAuthFormPopupBtn = document.getElementById('close-auth-form-popup');
const openSigninFormBtn = document.getElementById('open-signin-form');
const openCreateFormBtn = document.getElementById('open-create-form');
const authFormTitle = document.getElementById('auth-form-title');
const authFormText = document.getElementById('auth-form-text');
const authForm = document.getElementById('auth-form');
const authFirstName = document.getElementById('auth-first-name');
const authLastName = document.getElementById('auth-last-name');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authMessage = document.getElementById('auth-message');
const cartWelcomePopup = document.getElementById('cart-welcome-popup');
const cartWelcomeName = document.getElementById('cart-welcome-name');

let authMode = 'login';
let isLoggedIn = false;
let currentFirstName = '';

function openPopup(popup) {
  if (popup) popup.classList.remove('hidden');
}

function closePopup(popup) {
  if (popup) popup.classList.add('hidden');
}

function showCartWelcomePopup(firstName) {
  if (!cartWelcomePopup || !cartWelcomeName) return;
  cartWelcomeName.textContent = firstName || 'User';
  cartWelcomePopup.classList.remove('hidden');
  setTimeout(function () {
    cartWelcomePopup.classList.add('hidden');
  }, 2000);
}

function setAuthMode(mode) {
  authMode = mode;

  if (mode === 'login') {
    if (authFormTitle) authFormTitle.textContent = 'Sign In';
    if (authFormText) authFormText.textContent = 'Enter your email and password.';
    if (authSubmitBtn) authSubmitBtn.textContent = 'Sign In';
    if (authFirstName) {
      authFirstName.style.display = 'none';
      authFirstName.required = false;
    }
    if (authLastName) {
      authLastName.style.display = 'none';
      authLastName.required = false;
    }
  } else {
    if (authFormTitle) authFormTitle.textContent = 'Create Account';
    if (authFormText) authFormText.textContent = 'Create your SWN Skin account.';
    if (authSubmitBtn) authSubmitBtn.textContent = 'Create Account';
    if (authFirstName) {
      authFirstName.style.display = 'block';
      authFirstName.required = true;
    }
    if (authLastName) {
      authLastName.style.display = 'block';
      authLastName.required = true;
    }
  }

  if (authMessage) authMessage.textContent = '';
  if (authForm) authForm.reset();
}

function updateLoggedInUI(firstName) {
  const homeMessage = document.querySelector('.home-message p');
  currentFirstName = firstName || '';
  if (homeMessage && firstName) {
    homeMessage.textContent = 'Welcome back, ' + firstName + '!';
  }
}

if (cartLoginBtn) {
  cartLoginBtn.addEventListener('click', function () {
    if (isLoggedIn) {
      showCartWelcomePopup(currentFirstName);
      return;
    }
    closePopup(authFormPopup);
    openPopup(authChoicePopup);
  });
}

if (closeAuthChoicePopupBtn) closeAuthChoicePopupBtn.addEventListener('click', function () { closePopup(authChoicePopup); });
if (closeAuthFormPopupBtn) closeAuthFormPopupBtn.addEventListener('click', function () { closePopup(authFormPopup); });
if (openSigninFormBtn) openSigninFormBtn.addEventListener('click', function () { setAuthMode('login'); closePopup(authChoicePopup); openPopup(authFormPopup); });
if (openCreateFormBtn) openCreateFormBtn.addEventListener('click', function () { setAuthMode('signup'); closePopup(authChoicePopup); openPopup(authFormPopup); });

if (authChoicePopup) {
  authChoicePopup.addEventListener('click', function (event) {
    if (event.target === authChoicePopup) closePopup(authChoicePopup);
  });
}

if (authFormPopup) {
  authFormPopup.addEventListener('click', function (event) {
    if (event.target === authFormPopup) closePopup(authFormPopup);
  });
}

if (authForm) {
  authForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstName = authFirstName ? authFirstName.value.trim() : '';
    const lastName = authLastName ? authLastName.value.trim() : '';
    const email = authEmail ? authEmail.value.trim() : '';
    const password = authPassword ? authPassword.value.trim() : '';

    if (authMode === 'signup') {
      if (!firstName || !lastName || !email || !password) {
        if (authMessage) authMessage.textContent = 'Please fill in all fields.';
        return;
      }
    } else if (!email || !password) {
      if (authMessage) authMessage.textContent = 'Please enter both email and password.';
      return;
    }

    const endpoint = authMode === 'login' ? '/api/login' : '/api/signup';
    const requestBody = authMode === 'login'
      ? { email: email, password: password }
      : { firstName: firstName, lastName: lastName, email: email, password: password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) {
        if (authMessage) authMessage.textContent = data.message;
        return;
      }

      // Retrieve the saved questionnaire results from PostgreSQL
      const savedResponse = await fetch(`/api/questionnaire/${data.resultId}`);

      if (!savedResponse.ok) {
        throw new Error('Failed to retrieve saved recommendations');
      }

const savedResult = await savedResponse.json();

      if (authMessage) authMessage.textContent = data.message;
      isLoggedIn = true;
      updateLoggedInUI(data.user.firstName);
      setTimeout(function () {
        closePopup(authFormPopup);
      }, 700);
    } catch (error) {
      if (authMessage) authMessage.textContent = 'Something went wrong. Please try again.';
    }
  });
}

async function checkLoginStatus() {
  try {
    const response = await fetch('/api/me');
    if (!response.ok) return;
    const data = await response.json();
    if (data.loggedIn && data.user) {
      isLoggedIn = true;
      updateLoggedInUI(data.user.firstName);
    }
  } catch (error) {
    console.log('Could not check login status.');
  }
}

setAuthMode('login');
checkLoginStatus();

// Theme settings
const settingsBtn = document.getElementById('settings-btn');
const themePopup = document.getElementById('theme-popup');
const lightModeBtn = document.getElementById('light-mode-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');

function applyTheme(theme) {
  document.body.classList.remove('light-mode', 'dark-mode');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
}

if (settingsBtn && themePopup) {
  settingsBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    themePopup.classList.toggle('hidden');
  });
}

if (lightModeBtn) lightModeBtn.addEventListener('click', function () { applyTheme('light'); if (themePopup) themePopup.classList.add('hidden'); });
if (darkModeBtn) darkModeBtn.addEventListener('click', function () { applyTheme('dark'); if (themePopup) themePopup.classList.add('hidden'); });

document.addEventListener('click', function (event) {
  if (themePopup && settingsBtn && !themePopup.contains(event.target) && !settingsBtn.contains(event.target)) {
    themePopup.classList.add('hidden');
  }
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') applyTheme('dark');
else applyTheme('light');

// Recommendation page list from local storage
const savedRecommendationList = document.getElementById('saved-recommendation-list');
if (savedRecommendationList) {
  try {
    const savedItems = JSON.parse(localStorage.getItem('recommendedIngredients') || '[]');
    if (savedItems.length > 0) {
      savedRecommendationList.innerHTML = '';
      savedItems.forEach(function (item) {
        const li = document.createElement('li');
        li.textContent = item;
        savedRecommendationList.appendChild(li);
      });
    }
  } catch (error) {
    console.log('No saved questionnaire recommendations found.');
  }
}
