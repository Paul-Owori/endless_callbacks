import express from 'express';
import axios from 'axios';

const app = express();

app.get('/', async (req, res) => {
  try {
    let tries = 0;
    const recursiveCallback = async (newUrl) => {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: newUrl,
        headers: {
          Accept: 'application/json',
        },
      };

      const result = await axios.request(config).then((response) => {
        return response.data;
      });

      if (result?.message === 'This is not the end' && result?.follow) {
        tries += 1;
        console.log(`\n\nTry number ${tries}`, result);
        return recursiveCallback(result?.follow);
      }
      return result;
    };
    const url = 'https://letsrevolutionizetesting.com/challenge';

    const final = await recursiveCallback(url);

    return res.status(200).json({
      final,
      tries,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed',
      error: error.message,
    });
  }
});

app.listen(5000, async () => {
  try {
    console.log('Endless callbacks running on port 5000');
  } catch (err) {
    console.log(`There was an error starting Endless callbacks:`, err);
  }
});
