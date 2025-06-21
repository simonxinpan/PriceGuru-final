const fetch = require('node-fetch');
exports.handler = async function (event, context) {
  const apiKey = " 684e609bf177c8.49627614"; 
  const ticker = event.queryStringParameters.symbol || 'AAPL';
  const url = `https://eodhistoricaldata.com/api/wall-street-analyst-ratings/${ticker}.US?api_token=${apiKey}&fmt=json`;
  try {
    console.log(`正在用EODHD API测试获取 ${ticker} 的评级数据...`);
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`EODHD API请求失败: ${response.status} ${response.statusText}`); }
    const data = await response.json();
    console.log("成功从EODHD获取到数据！");
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.error('后端函数执行出错:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  **完全可以！你说得对，这才是最高效、最不会出错的终}
};