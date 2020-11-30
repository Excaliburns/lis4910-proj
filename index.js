const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const NodeCache = require('node-cache');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3001;

// Initialize cache
const myCache = new NodeCache({ checkperiod: 7200 });

app.listen(PORT, () => {
  console.log("Process started on port " + PORT)
})

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.post('/api/menu', async (req, res) => {
  console.log(`req came for menu!`);

  const day = req.query.date;

  if (myCache.has('setupComplete')) {
    getFoodItemsForWeek(new Date(day)).then(
      response => res.json(response)
    );
  }
  else {
    res.status(503).send();
  }
});

app.get('/api/allFood', (req, res) => {
  console.log('Typeahead needs some data...');

  if (myCache.has('allFood')) {
    res.send(myCache.get('allFood'));
  }
  else {
    res.send({});
  }
});

app.get('/api/searchFood', (req, res) => {
  console.log(req.query);

  let queryDate = req.query.date ? new Date(req.query.date) : null;
  let search = req.query.food ? req.query.food.toLowerCase() : null;
  let restrictions = req.query.restrictions ? req.query.restrictions.split(',').map(each => each.toLowerCase()) : null;

  let extras = ['mindful', 'vegan', 'vegetarian']
  let allergens = ['milk', 'tree nuts', 'wheat', 'gluten', 'egg', 'fish', 'peanuts', 'shellfish', 'soy'];

  let containedExtras = [];
  let containedAllergens = [];

  if (restrictions) {
    restrictions.forEach((ele) => {
      if (extras.includes(ele)) containedExtras.push(ele)
      if (allergens.includes(ele)) containedAllergens.push(ele)
    })
  }

  console.log(`Searching menu... for: ${search} + ${queryDate} + ${restrictions}`);
  let returnedFoodList = {}

  if (myCache.has('allFood')) {
    let foodItems = myCache.get('allFood').filter(item => {
      return (
        (search && search.length ? item.name.toLowerCase().includes(search) : true)
        && (
          (restrictions && restrictions.length) ? (
            (containedExtras.length) ? (
              containedExtras.some(extra => item.descriptors.extras.includes(extra))
            ) : true
              &&
              (containedAllergens.length) ? (
                  !(containedAllergens.some(allergen => item.descriptors.allergens.includes(allergen)))
                ) : true
          ) : true
        ))
    });

    foodItems.forEach(element => {
      let dates = element.date;
      let simplifiedElement = { name: element.name, descriptors: element.descriptors }

      if (dates) {
        dates.forEach(date => {
          if (queryDate != null) { if ( !datesAreOnSameDay(new Date(date), queryDate) ) { return false } }

          let meals = element.meal;

          if (returnedFoodList[date] == null) {
            returnedFoodList[date] = new Map();
          }


          meals.forEach(meal => {
            if (returnedFoodList[date][meal] == null) {
              returnedFoodList[date][meal] = [];
            }

            if (!returnedFoodList[date][meal].includes(simplifiedElement)) {
              returnedFoodList[date][meal].push(simplifiedElement);
            }
          })

          return true;
        })
      }
    });
  }

  if (search == null && restrictions != null) { returnedFoodList['type'] = 'filtered' }
  else returnedFoodList['type'] = 'dated';
  res.send(returnedFoodList);
});

const pageUrl = 'https://menus.sodexomyway.com/BiteMenu/MenuOnly?menuId=22663&locationId=40666001&whereami=http://seminoledining.sodexomyway.com/dining-locations/suwanneeroom';


async function getFoodItemsForWeek(date) {
  const dateString = date.toLocaleDateString();
  console.log('date: ' + dateString);

  const datedPageUrl = pageUrl + '&startDate=' + dateString;

  if (myCache.has(dateString)) {
    console.log('date was found in cache. returning from stored data.')

    return myCache.get(dateString);
  }
  else {
    const weekMenuContent = await axios.get(datedPageUrl);

    console.log("getting menu for date: " + datedPageUrl)

    const $ = cheerio.load(weekMenuContent.data);

    const currentDay = $('#menuid-' + date.getDate() + '-day');

    const menu = { 'type': 'list', 'menu': [] }
    let allFood = []

    currentDay.find('.accordion-block').each((index, element) => {

      const meal = $(element);

      // Breakfast, lunch, dinner, etc
      const mealTitle = meal.find('span.accordion-copy').first().text();
      const mealItems = [];

      // This unique string of identifiers gets all of the meal items in a single category (breakfast, lunch, dinner)
      const mealCategory = meal.find('.accordion-panel')

      // In the menu, each category is split between the titles and the actual food in the meal.
      // Stuff like HOMESTYLE or OMELETE BAR are descriptors for the items. For each of these we can assign it to a child food item
      // This makes it easier to display later.
      let currentDescriptor = null;

      mealCategory.children().each((categoryIdx, categoryElement) => {
        const $element = $(categoryElement);

        // There are only bite-menu-courses and bite-menu-items, all lined up really nicely. 
        if ($element.hasClass('bite-menu-course')) {
          const titleText = $element.find('h5').first().text();

          if (titleText.length > 0 && !titleText.includes('-')) {
            currentDescriptor = titleText.replace(' ', '_');
          }
          else {
            currentDescriptor = 'HEADER_UNKNOWN_ERR';
          }
        }

        // If it's not a course, it's an item!
        else if ($element.hasClass('bite-menu-item')) {
          // Find all of <a> tag inside bite-menu-item
          const mealElements = $element.find('.col-xs-9 a');

          // If it's empty, its a spacer.
          if (mealElements.length > 0) {

            mealElements.each((itemIdx, itemElement) => {
              // Get its id so we can get the allergens
              const idString = $(itemElement).attr('id');

              const idNum = idString.split('-').pop();
              const descriptorItem = $('#allergens-' + idNum);

              // Extra tag categories:
              // Allergens [ milk, tree nuts, wheat, gluten, eggs, fish, peanuts, shellfish, soy]
              // Extra tags [mindful, vegan, vegetarian]
              const allergens = [];
              const extras = [];


              if ($(descriptorItem).children().length > 0) {
                $(descriptorItem).children().each((idx, element) => {
                  const altText = $(element).attr('alt');

                  // don't add duplicates, for some reason sodexo has them lol
                  // if text contains 'contains\s' then we are an allergen, otherwise descriptor
                  if (altText.includes('contains ')) {
                    if (!allergens.includes(altText)) {
                      allergens.push(altText.split('contains ').pop());
                    }
                  }
                  else {
                    if (!extras.includes(altText)) {
                      extras.push(altText);
                    }
                  }
                });
              }

              mealItems.push(
                {
                  name: $(itemElement).text().replace(/\s+/g, ' ').trim(),
                  meal: mealTitle,
                  date: dateString,
                  // Really not a fan of this, but when you load the page it will generate random ids for each menu item
                  // These ids are useless between iterations of the page loading, so we just use them to identify what's on the page for whenever it's requested.
                  id: idNum,
                  categoryDescriptor: currentDescriptor,
                  descriptors: {
                    allergens: allergens,
                    extras: extras
                  }
                }
              )
            });
          }
        }
      })
      if (myCache.has('allFood')) {
        allFood = [...myCache.get('allFood'), ...mealItems]
      }
      else {
        allFood = allFood.concat(mealItems)
      }


      menu['menu'].push({
        'mealTitle': mealTitle,
        'mealItems': mealItems
      });
    });


    myCache.set('allFood', allFood);
    myCache.set(dateString, menu);
    return menu;
  }
}

setupCache().then(result => {
  const foodCache = myCache.get('allFood');

  const seenItems = new Map();

  // Remove duplicate food entries and merge their dates, this is mostly for typeahead to get data
  let newFoodCache = foodCache.filter((entry) => {
    let previous;

    if (seenItems.hasOwnProperty(entry.name)) {
      previous = seenItems[entry.name];
      previous.date.push(entry.date)
      previous.meal.push(entry.meal)

      return false;
    }

    if (!Array.isArray(entry.date)) {
      entry.date = [entry.date];
    }

    if (!Array.isArray(entry.meal)) {
      entry.meal = [entry.meal];
    }

    seenItems[entry.name] = entry;

    return true;
  })

  myCache.set('allFood', newFoodCache)
  myCache.set('setupComplete', true);

  console.log('done initializing! cache is successfully setup.');
});

// When we initialize, load cache with data for today + 2 weeks - 1d
async function setupCache() {
  const today = new Date();
  const aheadDate = new Date();
  aheadDate.setDate(today.getDate() + 13);

  console.log('initializing cache...');
  for (let currentDate = today; currentDate <= aheadDate; currentDate.setDate(currentDate.getDate() + 1)) {
    await getFoodItemsForWeek(currentDate);
  }
}

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();