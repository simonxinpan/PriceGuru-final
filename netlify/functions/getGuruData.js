// 文件路径: netlify/functions/getGuruData.js (V2 - 升级版)
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const ticker = event.queryStringParameters.symbol || 'AAPL';
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API Key未配置' }) };
  }

  // 定义我们要请求的三个API端点
  const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
  const recommendationUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${apiKey}`;
  const priceTargetUrl = `https://finnhub.io/api/v1/stock/price-target?symbol=${ticker}&token=${apiKey}`;

  try {
    console.log(`开始为 ${ticker} 并行获取三份数据...`);
    
    // 使用Promise.all并行发起所有请求，效率最高
    const [quoteResponse, recommendationResponse, priceTargetResponse] = await Promise.all([
      fetch(quoteUrl),
      fetch(recommendationUrl),
      fetch(priceTargetUrl)
    ]);

    // 分别检查每个请求是否成功
    if (!quoteResponse.ok) throw new Error(`获取股价失败: ${quoteResponse.statusText}`);
    if (!recommendationResponse.ok) throw new Error(`获取分析师评级失败: ${recommendationResponse.statusText}`);
    if (!priceTargetResponse.ok) throw new Error(`获取目标价失败: ${priceTargetResponse.statusText}`);

    // 将响应转换为JSON
    const quoteData = await quoteResponse.json();
    const recommendationData = await recommendationResponse.json();
    const priceTargetData = await priceTargetResponse.json();

    // Finnhub的推荐数据是一个数组，我们取最新的一个
    const latestRecommendation = (recommendationData && recommendationData.length > 0) ? recommendationData[0] : {};

    console.log('成功从Finnhub获取到所有数据!');
    
    // 将三份数据精华整合后返回给前端
    return {
      statusCode: 200,
      body: JSON.stringify({
        // quoteData里包含了所有价格信息
        quote: quoteData,
        // 我们从recommendationData里只取评级分布
        recommendation: {
            buy: latestRecommendation.buy,
            hold: latestRecommendation.hold,
            sell: latestRecommendation.sell,
            strongBuy: latestRecommendation.strongBuy,
            strongSell: latestRecommendation.strongSell,
            symbol: latestRecommendation.symbol
        },
        // priceTargetData里包含了我们最需要的目标价信息
        target: priceTargetData
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