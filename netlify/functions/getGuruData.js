// 文件路径: netlify/functions/getGuruData.js (版本 V5 - 情报中心版)
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API Key未配置' }) };
  }

  // 1. 获取全市场的评级变动情报
  const upgradeDowngradeUrl = `https://finnhub.io/api/v1/stock/upgrade-downgrade?token=${apiKey}`;
  
  try {
    console.log("正在获取华尔街最新的评级变动...");
    const response = await fetch(upgradeDowngradeUrl);
    if (!response.ok) {
        throw new Error(`获取评级变动情报失败: ${response.statusText}`);
    }
    
    const allUpdates = await response.json();
    
    // 2. 筛选最有价值的情报：即那些包含了新目标价的更新。
    const updatesWithTarget = allUpdates.filter(item => item.priceTargetTo && item.priceTargetTo > 0);
    
    if (updatesWithTarget.length === 0) {
        console.log("未发现近期有目标价的评级更新。");
        return { statusCode: 200, body: JSON.stringify([]) }; // 优雅地返回一个空列表
    }

    // 3. 为避免API调用超限，我们只处理最新的15条情报。
    const latestUpdates = updatesWithTarget.slice(0, 15);
    
    // 4. 从这些情报中提取出不重复的股票代码。
    const symbolsToFetch = [...new Set(latestUpdates.map(item => item.symbol))];

    console.log(`发现 ${latestUpdates.length} 条更新。正在为以下股票获取报价: ${symbolsToFetch.join(', ')}`);

    // 5. 并行获取每只股票的实时报价。
    const quotePromises = symbolsToFetch.map(symbol => 
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
            .then(res => {
                if (!res.ok) {
                    console.error(`获取 ${symbol} 的报价失败`);
                    return null; // 单个请求失败时返回null，不中断整个流程
                }
                return res.json();
            })
            .then(data => ({ symbol, data })) // 将数据与其代码配对
    );
    const quotesResults = await Promise.all(quotePromises);
    
    // 6. 将报价数据整理成一个方便查找的字典/映射（例如: {'AAPL': {c: 197.51, ...}}）
    const quotesMap = {};
    quotesResults.forEach(result => {
        if (result && result.data) {
            quotesMap[result.symbol] = result.data;
        }
    });

    // 7. 用实时股价来丰富我们的情报列表。
    const finalData = latestUpdates.map(item => ({
        ...item, // 保留所有原始情报 (投行, 动作, 目标价等)
        currentPrice: quotesMap[item.symbol] ? quotesMap[item.symbol].c : null // 添加当前股价
    })).filter(item => item.currentPrice !== null); // 最后，过滤掉那些我们没能成功获取到股价的情报

    console.log("成功处理并丰富了数据，正在发往前端。");

    return {
      statusCode: 200,
      body: JSON.stringify(finalData) // 发送最终的、包含丰富情报的数组
    };

  } catch (error) {
    console.error('Netlify Function内部出错:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};