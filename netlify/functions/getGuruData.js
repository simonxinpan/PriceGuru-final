// 文件路径: netlify/functions/getGuruData.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // ❗️ 我们在这里做了一个关键修改：从URL参数获取股票代码
  const ticker = event.queryStringParameters.symbol || 'AAPL'; // 如果没提供，默认查AAPL
  
  // ❗️ 第二个关键修改：从环境变量读取API Key，而不是写死在代码里
  const apiKey = process.env.FINNHUB_API_KEY; 

  if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API Key未配置' }) };
  }

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
  const recommendationUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${apiKey}`;

  try {
    console.log(`开始为 ${ticker} 并行获取股价和评级...`);
    
    const [quoteResponse, recommendationResponse] = await Promise.all([
      fetch(quoteUrl),
      fetch(recommendationUrl)
    ]);

    if (!quoteResponse.ok) throw new Error(`获取股价失败: ${quoteResponse.statusText}`);
    if (!recommendationResponse.ok) throw new Error(`获取分析师评级失败: ${recommendationResponse.statusText}`);

    const quoteData = await quoteResponse.json();
    const recommendationData = await recommendationResponse.json();

    const latestRecommendation = (recommendationData && recommendationData.length > 0) ? recommendationData[0] : null;

    if (!quoteData || !latestRecommendation) {
        throw new Error('API返回的数据不完整或股票代码无效');
    }

    console.log('成功从Finnhub获取到所有数据!');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        quote: quoteData,
        recommendation: latestRecommendation
      })
    };
  } catch (error) {
    console.error('后端函数执行出错:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};