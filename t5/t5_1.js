import {restaurantRow, restaurantModal} from './components.js';
import {fetchData} from './utils.js';
import {baseUrl} from './variables.js';

const menuDialog = document.querySelector('#menu');

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let restaurants = [];

const distance = (restaurantLocation, myLocation) => {
  return Math.sqrt(
    (restaurantLocation[0] - myLocation[0]) ** 2 +
      (restaurantLocation[1] - myLocation[1]) ** 2
  );
};

const getRestaurants = async () => {
  try {
    restaurants = await fetchData(baseUrl + '/restaurants');
    navigator.geolocation.getCurrentPosition(success, error, options);
  } catch (error) {
    console.error(error.message);
  }
};

const renderRestaurants = (restaurantsArray) => {
  const target = document.querySelector('tbody');
  target.innerHTML = '';

  restaurantsArray.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);

    tr.addEventListener('click', async () => {
      document.querySelectorAll('tr').forEach((rivi) => {
        rivi.classList.remove('highlight');
      });

      tr.classList.add('highlight');

      const dailyMenu = await fetchData(
        `${baseUrl}/restaurants/daily/${restaurant._id}/fi`
      );

      menuDialog.innerHTML = restaurantModal(restaurant, dailyMenu);

      menuDialog.showModal();
    });

    target.append(tr);
  });
};

const success = (pos) => {
  const crd = pos.coords;

  console.log(crd);

  restaurants.sort((a, b) => {
    const etaisyysA = distance(a.location.coordinates, [
      crd.longitude,
      crd.latitude,
    ]);

    const etaisyysB = distance(b.location.coordinates, [
      crd.longitude,
      crd.latitude,
    ]);

    return etaisyysA - etaisyysB;
  });

  renderRestaurants(restaurants);
};

const error = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  renderRestaurants(restaurants);
};

getRestaurants();

document.querySelector('#compass-button').addEventListener('click', () => {
  const compassRestaurants = restaurants.filter(
    (restaurant) => restaurant.company === 'Compass Group'
  );

  renderRestaurants(compassRestaurants);
});

document.querySelector('#sodexo-button').addEventListener('click', () => {
  const sodexoRestaurants = restaurants.filter(
    (restaurant) => restaurant.company === 'Sodexo'
  );

  renderRestaurants(sodexoRestaurants);
});

document.querySelector('#reset-button').addEventListener('click', () => {
  renderRestaurants(restaurants);
});
