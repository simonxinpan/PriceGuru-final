// 文件路径: netlify/functions/getGuruData.js (V3 - 优雅降级版)
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const ticker = event.queryStringParameters.symbol || 'AAPL';
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) { return { statusCode: 500, body: JSON.stringify({ error: 'API Key未配置' }) }; }

  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
  const recommendationUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${apiKey}`;
  const priceTargetUrl = `https://finnhub.io/api/v1/stock/price-target?symbol=${ticker}&token=${apiKey}`;

  try {
    const [quoteResponse, recommendationResponse, priceTargetResponse] = await Promise.all([
      fetch(quoteUrl),
      fetch(recommendationUrl),
      fetch(priceTargetUrl)
    ]);

    if (!quoteResponse.ok) throw new Error(`获取股价失败`);
    if (!recommendationResponse.ok) throw new Error(`获取分析师评级失败`);
    
    const quoteData = await quoteResponse.json();
    const recommendationData = await recommendationResponse.json();
    
    let priceTargetData = {}; // **关键改动**: 默认目标价数据为空对象
    if (priceTargetResponse.ok) {
        // **关键改动**: 只有在请求成功时，才去解析和赋值
        priceTargetData = await priceTargetResponse.json();
        console.log(`成功获取到 ${ticker} 的目标价数据!`);
    } else {
        console.warn(`无法获取 ${ticker} 的目标价数据 (状态: ${priceTargetResponse.status})，将优雅降级。`);
    }

    const latestRecommendation = (recommendationData && recommendationData.length > 0) ? recommendationData[0] : {};

    return {
      statusCode: 200,
      body: JSON.stringify({
        quote: quoteData,
        recommendation: { /* ...评级数据保持不变... */ },
        target: priceTargetData // 返回获取到的目标价数据，或者一个空对象
      })
    };
  } catch (error) { /* ...catch部分保持不变... */ }
};