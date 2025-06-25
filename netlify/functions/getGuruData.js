const fetch = require('node-fetch');

const NASDAQ_100 = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'NVDA', 'TSLA', /* ... 更多股票代码 ... */];

// MVP阶段，我们先用静态的行业均值，避免复杂的API调用
const INDUSTRY_PE_MAP = {
    "Technology": 28.5, "Consumer Cyclical": 22.1, "Healthcare": 25.0, "Financial Services": 14.0 
};

exports.handler = async function (event, context) {
    const apiKey = process.env.EODHD_API_KEY;
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: "API Key not configured." }) };

    const ticker = event.queryStringParameters.symbol?.toUpperCase();
    if (!ticker) return { statusCode: 400, body: JSON.stringify({ error: "Stock symbol is required." }) };

    if (!NASDAQ_100.includes(ticker)) {
        return { statusCode: 400, body: JSON.stringify({ error: `股票 ${ticker} 暂未纳入核心分析范围 (纳斯达克100)` }) };
    }

    const fundamentalsUrl = `https://eodhistoricaldata.com/api/fundamentals/${ticker}.US?api_token=${apiKey}&fmt=json`;
    const realTimeUrl = `https://eodhistoricaldata.com/api/real-time/${ticker}.US?api_token=${apiKey}&fmt=json`;

    try {
        // 并行获取数据
        const [fundamentalsRes, realTimeRes] = await Promise.all([
            fetch(fundamentalsUrl),
            fetch(realTimeUrl)
        ]);

        if (!fundamentalsRes.ok) throw new Error(`获取基本面数据失败 (EODHD)`);
        if (!realTimeRes.ok) throw new Error(`获取实时股价失败 (EODHD)`);

        const fundamentalData = await fundamentalsRes.json();
        const realTimeData = await realTimeRes.json();

        // --- 后端核心计算 ---
        const metrics = [
            { id: 'pe', name: "市盈率(PE)", stockValue: fundamentalData.Valuations?.TrailingPE || 0, industryValue: INDUSTRY_PE_MAP[fundamentalData.General?.Industry] || 25, unit: '', direction: 'lower-is-better' },
            { id: 'ps', name: "市销率(PS)", stockValue: fundamentalData.Valuations?.PriceSalesTTM || 0, industryValue: 4.5, unit: '', direction: 'lower-is-better' },
            { id: 'roe', name: "净资产收益率", stockValue: (fundamentalData.Highlights?.ReturnOnEquityTTM || 0) * 100, industryValue: 18.0, unit: '%', direction: 'higher-is-better' },
            { id: 'growth', name: "营收增长率", stockValue: (fundamentalData.Highlights?.QuarterlyRevenueGrowthYOY || 0) * 100, industryValue: 10.0, unit: '%', direction: 'higher-is-better' }
        ];

        let totalRisk = 0;
        metrics.forEach(m => {
            let riskValue = 50;
            if (m.industryValue !== 0) {
                const ratio = m.stockValue / m.industryValue;
                riskValue = m.direction === 'lower-is-better' ? (50 * ratio) : (50 / ratio);
            }
            m.riskValue = Math.max(0, Math.min(100, riskValue));
            totalRisk += m.riskValue;
        });
        
        const responseData = {
            ticker: fundamentalData.General?.Code,
            companyName: fundamentalData.General?.Name,
            lastUpdate: new Date(fundamentalData.General?.Updated_at).toLocaleString('zh-CN'),
            currentPrice: realTimeData.close,
            overallRiskValue: totalRisk / metrics.length,
            metrics: metrics
        };
        
        return { statusCode: 200, body: JSON.stringify(responseData) };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};