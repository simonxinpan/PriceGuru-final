<<<<<<< Updated upstream
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
=======
// 文件路径: netlify/functions/getGuruData.js (EODHD技术验证版)
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // ❗️ 注意：这里暂时用你的测试Key，部署到Netlify时再换成环境变量
  const apiKey = " 684e609bf177c8.49627614"; 
  const ticker = event.queryStringParameters.symbol || 'AAPL';
  
  // EODHD的分析师评级API端点
  const url = `https://eodhistoricaldata.com/api/wall-street-analyst-ratings/${ticker}.US?api_token=${apiKey}&fmt=json`;

  try {
    console.log(`正在用EODHD API测试获取 ${ticker} 的评级数据...`);
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`EODHD API请求失败: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();

    console.log("成功从EODHD获取到数据！");
    
    return {
      statusCode: 200,
      body: JSON.stringify(data) // 将原始数据原封不动地返回给前端
    };
  } catch (error) {
    console.error('后端函数执行出错:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
>>>>>>> Stashed changes
};