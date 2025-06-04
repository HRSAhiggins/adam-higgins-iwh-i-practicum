const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
  
  app.get('/', async (req, res) => {
    
    const objectType = '2-10391590'; 
    const limit = 100;
    const archived = false;
    const properties = 'name,code,type,status';
    
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}`; 
    
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };
    
    const params = {
      limit,
      archived,
      properties
    };

    try {
        const resp = await axios.get(url, { params, headers });
        const data = resp.data.results;
        
        console.log(JSON.stringify(data, null, 2));
        
        res.render('committees', { title: 'Committees', data });  
        
    } catch (error) {
        console.error(error?.response?.data || error.message);
    }
  });
  
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

  app.get('/update-cobj', (req, res) => {
      res.render('updates', {
          title: 'Update Committees'
      });
  });
  
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

  app.post('/submit-cobj', async (req, res) => {
    
    const objectType = '2-10391590';
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}`;
    const { id, name, code, type } = req.body;

    const payload = {
      properties: {
        id: id,
        name,
        code,
        type
      }
    };

    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(url, payload, { headers });
      console.log('Committee Record Created:', response.data);
      res.redirect('/');
    } catch (error) {
      const message = error.response?.data || error.message;
      console.error('Error creating record:', message);
      res.status(500).send(`Error creating record: ${JSON.stringify(message)}`);
    }
  });

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));