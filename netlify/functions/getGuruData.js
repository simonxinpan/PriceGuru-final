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
  
  // --- 关键修正：使用正确的“Fundamentals API”端点 ---
  const url = `https://eodhistoricaldata.com/api/fundamentals/${ticker}.US?api_token=${apiKey}`;

  try {
    console.log(`正在用EODHD Fundamentals API获取 ${ticker} 的数据...`);
    
    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`EODHD API请求失败: ${response.status} ${response.statusText}. 响应内容: ${errorText}`);
    }
    
    // EODHD的这个API，即使股票代码错误，也可能返回200 OK，但内容是"Not found."
    // 所以我们需要检查返回的内容
    const responseText = await response.text();
    if (responseText.includes("Not found")) {
         throw new Error(`在EODHD中找不到股票代码: ${ticker}`);
    }
    
    const data = JSON.parse(responseText);

    // 我们只需要其中的分析师评级部分
    const analystRatings = data.WallStreetTargetPrice;
    
    console.log("成功从EODHD获取并解析到分析师评级数据！");
    
    return {
      statusCode: 200,
      // 只返回我们需要的部分，而不是整个巨大的JSON
      body: JSON.stringify(analystRatings) 
    };
  } catch (error) {
    console.error('Function Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};