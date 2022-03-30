window.product = (productId) => {
  // ?: 상품 상세 페이지 스크립트
  const DOM = {
    list: document.querySelector('.App .ProductListPage'),
    product: document.querySelector('.App .ProductDetailPage'),
    cart: document.querySelector('.App .CartPage'),
  };
  let product = {
    id: 1,
    imageUrl: null,
    name: null,
    price: 0,
    productOptions: [],
  };
  const state = {
    options: [],
  };
  const initialize = async () => {
    DOM.product.style.display = 'block';
    DOM.list.style.display = 'none';
    DOM.cart.style.display = 'none';
    onRenderSkeleton();
    const response = await getProduct(productId);
    product = { ...response };
    onRenderImage(product.imageUrl);
    onRenderName(product.name);
    onRenderOptions(product.productOptions);
    document.querySelector('.OrderButton').addEventListener('click', () => {
      onClickSaveButton();
    });
  };
  const getProduct = async (productId) => {
    const response = await fetch(`https://uikt6pohhh.execute-api.ap-northeast-2.amazonaws.com/dev/products/${productId}`);
    return response.json();
  };
  const onRenderImage = (imageUrl) => {
    const image = document.querySelector('.ProductDetail img');
    image.setAttribute('src', imageUrl);
  };
  const onRenderName = (productName) => {
    const page = document.querySelector('.ProductDetailPage');
    const name = document.querySelector('.ProductDetail__info h2');
    page.querySelector('h1').innerText = `${productName} 상품 정보`;
    name.innerText = productName;
  };
  const onRenderOptions = (options) => {
    const select = document.querySelector('.ProductDetail__info select');
    let html = options.map((item) => {
      const { price, name, id } = item;
      if (!price) return `<option value="${id}">${name}</option>`;
      return `<option value="${id}">${name} (+${price.toString()}원)</option>`;
    });
    html = ['<option>선택해주세요</option>', ...html];
    select.innerHTML = html.join('');
    select.addEventListener('change', (e) => {
      const id = e.target.value * 1;
      const item = product.productOptions.find((i) => i.id === id);
      if (!state.options.find((i) => i.id === item.id)) state.options.push(item);
      onRenderSelectedOptions(state.options);
      onRenderPrice(state.options);
    });
  };
  const onRenderSelectedOptions = (options) => {
    const element = document.querySelector('.ProductDetail__selectedOptions ul');
    if (!options) return element.innerHTML = '';
    const items = options.map((option) => {
      const { id, name, price, stock, count } = option;
      const li = document.createElement('li');
      if (!stock) {
        li.innerHTML = `${name} <div><input type="number" value="${count || 0}" disabled>개</div>`;
        return li.outerHTML;
      }
      li.innerHTML = `${name} (+${price.toString()}원) <div><input type="number" min="0" max="${stock}" value="${count || 0}">개</div>`;
      return li.outerHTML;
    });
    element.innerHTML = items.join('');
    element.querySelectorAll('input').forEach((input, key) => {
      input.addEventListener('input', (e) => {
        const { value } = e.target;
        state.options[key] = { ...state.options[key], count: value * 1 };
        onRenderPrice(state.options);
      });
    });
  };
  const onRenderPrice = (options) => {
    const element = document.querySelector('.ProductDetail__totalPrice');
    let price = 0;
    if (!options) {
      element.innerHTML = `${price}원`;
      return;
    }
    for (let i = 0; i < options.length; i += 1) {
      const option = options[i];
      const count = option.count * 1;
      if (!count) continue;
      price += (product.price + option.price) * (count || 0);
    }
    element.innerHTML = `${price.toLocaleString()}원`;
  };
  const onClickSaveButton = () => {
    const cart = window.localStorage.getItem('cart') ? JSON.parse(window.localStorage.getItem('cart')) : [];
    const options = state.options.filter((option) => {
      return option.count * 1;
    });
    if (options.length <= 0) {
      window.alert('유효한 아이템을 한 개 이상 추가해주세요');
      return;
    }
    const result = { product, options };
    window.localStorage.setItem('cart', JSON.stringify([...cart, result]));
    window.navigation('/web/cart');
  };
  const onRenderSkeleton = () => {
    onRenderName();
    onRenderImage();
    onRenderSelectedOptions();
    onRenderPrice();
  };
  initialize();
};