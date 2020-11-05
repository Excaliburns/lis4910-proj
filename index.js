const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');

const cheerio = require('cheerio');
const axios = require('axios');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3001;

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

  let foodItems = await getFoodItemsForWeek(new Date(day));

  res.json(foodItems);
})

const pageUrl = 'https://menus.sodexomyway.com/BiteMenu/Menu?menuId=22663&locationId=40666001&whereami=http://seminoledining.sodexomyway.com/dining-locations/suwanneeroom';

async function getFoodItemsForWeek(date) {
  const datedPageUrl = pageUrl + '&startDate=' + date.toLocaleDateString();
  const weekMenuContent = await axios.get(datedPageUrl);

  console.log("getting menu for date: " + datedPageUrl)

  const $ = cheerio.load(weekMenuContent.data);

  const currentDay = $('#menuid-' + date.getDay() + '-day');

  const menu = []

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
                name: $(itemElement).text(),
                // Really not a fan of this, but when you load the page it will generate random ids for each menu item
                // These ids are useless between iterations of the page loading, so we just use them to identify what's on the page for whenever it's requested.
                thisIterUniqueId: idNum,
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
    menu.push({
      'mealTitle': mealTitle,
      'mealItems': mealItems
    });
  });

  return menu;
}