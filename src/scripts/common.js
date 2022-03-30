(() => {
  // ?: 네비게이션 관련 스크립트
  window.navigation = (path) => {
    window.history.pushState(null, path, path);
    if (path === '/web/' || path) window.list();
    if (path.includes('/web/products')) {
      const route = path.split('/').map((p) => p);
      window.product(route[route.length - 1] * 1);
    }
    if (path.includes('/web/cart')) window.cart();
  };
  window.addEventListener('popstate', (e) => {
    navigation(window.location.pathname);
  });
  navigation(window.location.pathname);
})()