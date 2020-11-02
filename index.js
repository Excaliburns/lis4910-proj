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

app.get('/api/menu', async (req, res) => {
    console.log(`req came for menu 👐 ! DAY: ${req.query.day}, WEEK: ${req.query.week}`);


    const day  = req.query.day;
    const week = req.query.week

    let foodItems;

    if ( typeof week === 'undefined' ) {
        foodItems = await getFoodItemsForWeek(undefined, day);
    }
    else {
       foodItems = await getFoodItemsForWeek(week, day);
    }

    res.json(foodItems);
})

const pageUrl = 'https://menus.sodexomyway.com/BiteMenu/Menu?menuId=22663&locationId=40666001&whereami=http://seminoledining.sodexomyway.com/dining-locations/suwanneeroom';
const datedPageUrl = pageUrl + 'startDate=';

async function getFoodItemsForWeek(week, day) {
  const weekMenuContent = await axios.get ( week ? (datedPageUrl + (Date.now() * week)) : pageUrl );
  
  const $ = cheerio.load(weekMenuContent.data);

  const currentDay = $('#menuid-' + (day ? day : new Date().getDate()) + '-day');

  const menu = []

  currentDay.find('.accordion-block').each( (index, element) => {

    const meal = $(element);
    const mealTitle = meal.find('span.accordion-copy').first().text();
    const mealItems = meal.find('.bite-menu-item li .col-xs-9 a').map( (index, element) => { return $(element).text()});
    menu.push({
      'mealTitle': mealTitle,
      'mealItems': mealItems.toArray()
    });
  });
  
  return menu;
}