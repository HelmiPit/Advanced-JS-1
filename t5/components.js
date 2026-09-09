'use strict';

const restaurantRow = (restaurant) => {
  const {name, address, company, city} = restaurant;
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${name}</td>
    <td>${address}</td>
    <td>${company}</td>
    <td>${city}</td>
    `;

  return tr;
};

const restaurantModal = (restaurant, menu) => {
  const {name, address, postalCode, city, phone, company} = restaurant;
  const {courses} = menu;

  let menuHtml = '<ul>';

  courses.forEach((course) => {
    const {name, price, diets} = course;

    menuHtml += `
      <li>${name}, ${price ?? '?€'}. ${diets}</li>
      `;
  });

  menuHtml += '</ul>';

  return `
    <h1>${name}</h1>
    <p>${address}</p>
    <p>${postalCode}, ${city}</p>
    <p>${phone === '-' ? 'Ei puhelinta' : phone}</p>
    <p>${company}</p>
    ${menuHtml}
    `;
};

export {restaurantRow, restaurantModal};
