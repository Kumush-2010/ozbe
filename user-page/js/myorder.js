
  // Wishlist array – bu localStorage yoki backend bilan bog‘lanishi mumkin
  const wishlist = [];

  function addToWishlist(name, image, price) {
    const item = { name, image, price };
    // Duplicate tekshirish
    const exists = wishlist.some(w => w.name === name);
    if (!exists) {
      wishlist.push(item);
      alert(`${name} added to wishlist!`);
      // Optional: saqlab qo‘yish
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } else {
      alert(`${name} is already in wishlist.`);
    }
  }

  