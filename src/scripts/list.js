window.list = () =>{
  // ?: 상품 목록 관련 스크립트
  const DOM = {
    list: document.querySelector('.App .ProductListPage'),
    product: document.querySelector('.App .ProductDetailPage'),
    cart: document.querySelector('.App .CartPage'),
  };
  const state = {
    products: [],
  };
  const initialize = async () => {
    DOM.list.style.display = 'block';
    DOM.product.style.display = 'none';
    DOM.cart.style.display = 'none';
    const products = await getProducts();
    state.products = products;
    onRenderList();
  };
  const getProducts = async () => {
    const response = await fetch('https://uikt6pohhh.execute-api.ap-northeast-2.amazonaws.com/dev/products');
    return response.json();
  };
  const onRenderList = () => {
    const list = document.querySelector('.ProductListPage ul');
    const elements = state.products.map((product) => {
      const { name, price, imageUrl } = product;
      const li = document.createElement('li');
      li.classList.add('Product')
      const img = document.createElement('img');
      img.setAttribute('src', imageUrl);
      const info = document.createElement('div');
      info.innerHTML = `<div>${name}</div><div>${price.toLocaleString()}~</div>`;
      info.classList.add('Product__info');
      li.append(img);
      li.append(info);
      li.setAttribute('data-id', product.id);
      return li.outerHTML;
    });
    list.innerHTML = elements.join('');
    list.querySelectorAll('li').forEach((el) => {
      el.addEventListener('click', (e) => {
        window.navigation(`/web/products/${el.getAttribute('data-id')}`);
      });
    });
  };
  initialize();
};