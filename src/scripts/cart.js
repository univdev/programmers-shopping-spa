window.cart = () => {
  // ?: 장바구니 관련 스크립트
  const DOM = {
    list: document.querySelector('.App .ProductListPage'),
    product: document.querySelector('.App .ProductDetailPage'),
    cart: document.querySelector('.App .CartPage'),
  };
  const state = {
    items: [],
  };
  const initialize = () => {
    DOM.product.style.display = 'none';
    DOM.list.style.display = 'none';
    DOM.cart.style.display = 'block';
    const items = window.localStorage.getItem('cart') ? JSON.parse(window.localStorage.getItem('cart')) : [];
    state.items = items;
    onRenderCart(state.items);
    onRenderPrice(state.items);
    kickFromCurrentPage(state.items); // 장바구니 아이템 보유 여부 체크
    const submitButton = document.querySelector('.CartPage .OrderButton');
    submitButton.addEventListener('click', () => {
      onSubmit();
    });
  };
  const kickFromCurrentPage = (products = []) => {
    if (products.length <= 0) {
      window.alert('장바구니가 비어 있습니다');
      window.navigation('/web/');
    }
  }
  const onRenderCart = (products) => {
    const element = document.querySelector('.Cart ul');
    const result = [];
    for (let i = 0; i < products.length; i += 1) {
      const { product, options } = products[i];
      for (let j = 0; j < options.length; j += 1) {
        const option = options[j];
        const cartItem = document.createElement('div');
        cartItem.classList.add('Cart__item');
        const img = document.createElement('img');
        img.setAttribute('src', product.imageUrl);
        const info = document.createElement('div');
        info.classList.add('Cart__itemDesription');
        const name = document.createElement('div');
        name.innerText = `${product.name} ${option.name} ${option.count || 0}개`;
        const price = document.createElement('div');
        const totalPrice = (product.price + option.price) * (option.count || 0);
        price.innerText = `${totalPrice.toLocaleString()}원`;
        info.append(name);
        info.append(price);
        cartItem.append(img);
        cartItem.append(info);
        result.push(cartItem);
      }
    }
    element.innerHTML = result.map((i) => i.outerHTML).join('');
  };
  const onRenderPrice = (products) => {
    const element = document.querySelector('.Cart__totalPrice');
    let price = 0;
    for (let i = 0; i < products.length; i += 1) {
      const { product, options } = products[i];
      for (let j = 0; j < options.length; j += 1) {
        const option = options[j];
        price += (product.price + (option.price || 0)) * (option.count || 0);
      }
    }
    element.innerText = `총 상품가격 ${price.toLocaleString()}원`;
  };
  const onSubmit = () => {
    window.alert('주문되었습니다.');
    window.localStorage.removeItem('cart');
    window.navigation('/web/');
  };
  initialize();
};
