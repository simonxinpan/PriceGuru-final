const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const apiKey = process.env.EODHD_API_KEY;

  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "EODHD_API_KEY environment variable is not set." }) 
    };
  }

  const ticker = event.queryStringParameters.symbol || 'AAPL';
  
  const url = `https://eodhistoricaldata.com/api/wall-street-analyst-ratings/${ticker}.US?api_token=${apiKey}&fmt=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EODHD API request failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Function Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};