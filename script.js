document.addEventListener('DOMContentLoaded', function() {
    // --- 全局变量与DOM元素获取 ---
    const elements = {
        searchForm: document.getElementById('search-form'),
        symbolInput: document.getElementById('symbol-input'),：**

1.  **确认你已完成**:
    *   在`main`分支。
    *   API Key已在Netlify设置完毕。
    *   本地项目已准备好。

2.  **代码覆盖**:
    *   用我**上一条回复**中提供的、最终的`index.html`
        analyzeBtn: document.getElementById('analyze-btn'),
        searchView: document.getElementById('search-view'),
        analysisView: document.getElementById('analysis-view'),
        statusContainer: document.getElementById('status-container'),
        // 分析结果页内的元素
        companyName: document.querySelector('#analysis-view .company-name'),
        timestamp: document.querySelector('#analysis-view .timestamp'),
        currentPrice: document.getElementById和`netlify/functions/getGuruData.js`代码，覆盖你本地对应的文件。
    *   然后，用**下面这份全新的、100%完整的`script.js`代码**，覆盖你本地的`script.js`文件。

---

### **`script.js` (前端大脑 - 100%完整('current-price'),
        summaryText: document.getElementById('summary-text'),
        higherBetterGrid: document.getElementById('higher-is-better-grid'),
        higherBetterList: document.getElementById('higher-is-better-list'),
        lowerBetterGrid: document.getElementById('lower-is-better-grid'),
        lowerBetterList: document.getElementById('lower-is-better-list'),
        viewToggleGaugeBtn: document.getElementById('view-toggle-gauge'),
        viewToggleListBtn: document.getElementById('view-toggle-list'),
        reanalyzeBtn: document.getElementById('re-analyze-btn')
    };
最终版)**

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // --- 全局变量与DOM元素获取 ---
    const elements = {
        searchForm: document.getElementById('search-form'),
        symbolInput: document.getElementById('symbol-input'),
        analyzeBtn: document.getElementById('analyze-btn'),
        search    
    // 用于存储ECharts实例，防止重复初始化
    const echartsInstances = {};
    const colors = { undervalued: '#2E93fA', fair: '#67C23A', overvalued: '#FF9800', high_risk: '#F56C6C' };
    let currentData = {}; // 用于存储当前分析的数据

    // --- 事件监听 ---
    elements.searchForm.View: document.getElementById('search-view'),
        analysisView: document.getElementById('analysis-view'),
        statusContainer: document.getElementById('status-container'),
        // 分析结果页内的元素
        companyName: document.querySelector('#analysis-view .company-name'),
        timestamp: document.querySelector('#analysis-view #timestamp'),
        currentPrice: document.getElementById('current-price'),
        summaryText: document.getElementById('summary-text'),
        higherBetterGrid: document.getElementById('higher-is-better-grid'),
        higherBetterList: document.getElementByIdaddEventListener('submit', (e) => {
        e.preventDefault();
        const symbol = elements.symbolInput.value.trim().toUpperCase();
        if (symbol) runAnalysis(symbol);
    });

    elements.reanalyzeBtn.addEventListener('click', () => {
        elements.analysisView.classList.add('hidden');
        elements.searchView.classList.remove('hidden');
    });

    elements.viewToggleGaugeBtn.addEventListener('click', () => toggleView('gauge'));
    elements.viewToggleListBtn.addEventListener('click', () => toggleView('list'));

    // --- 核心函数 ---
    async function runAnalysis(symbol) {
        setLoadingState(true, `正在获取 ${symbol} 的深度数据...`);
        try {
            const response = await('higher-is-better-list'),
        lowerBetterGrid: document.getElementById('lower-is-better-grid'),
        lowerBetterList: document.getElementById('lower-is-better-list'),
        viewToggleGaugeBtn: document.getElementById('view-toggle-gauge'),
        viewToggleListBtn: document.getElementById('view-toggle-list'),
        reanalyzeBtn: document.getElementById('re-analyze-btn')
    };

    const echartsInstances = {};
    const colors = { undervalued: '#2E93fA', fair: '#67C23A', overvalued: '#FF9800', high_risk: '#F56C6C' };

    // --- 事件监听 ---
    elements.searchForm.addEventListener('submit fetch(`/.netlify/functions/getGuruData?symbol=${symbol}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            currentData = data; // 保存当前数据
            render(currentData);
            
            elements.searchView.classList.add('hidden');
            elements.analysisView.classList.remove('hidden');
            elements.statusContainer.classList.add('hidden');
        } catch (error) {
            setLoadingState(false, `错误: ${error.message}`, true);
        } finally {
            elements.analyzeBtn.disabled = false;
            elements.analyzeBtn.textContent = '透视分析';
        }
    }

    function setLoadingState(isLoading, message, isError = false) {
        if(isLoading) {
            elements.analysisView.classList.add('hidden');
            elements.searchView.classList.add('hidden');
            elements.statusContainer.classList.remove('hidden');
            elements.statusContainer.innerHTML = `<div class="card"><p id="status-message', (e) => {
        e.preventDefault();
        const symbol = elements.symbolInput.value.trim().toUpperCase();
        if (symbol) runAnalysis(symbol);
    });

    elements.reanalyzeBtn.addEventListener('click', () => {
        elements.analysisView.classList.add('hidden');
        elements.searchView.classList.remove('hidden');
    });

    elements.viewToggleGaugeBtn.addEventListener('click', () => toggleView('gauge'));
    elements.viewToggleListBtn.addEventListener('click', () => toggleView('list'));

    // --- 核心函数 ---
    async function runAnalysis(symbol) {
        setLoadingState(true, `正在获取 ${symbol} 的深度数据...`);
        try {
            const response = await fetch(`/.netlify/functions/getGuruData?symbol=${symbol}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `服务器返回错误: ${response.status}`);
            }
            const data = await response.json();
            
            render(data);
">${message}</p></div>`;
            const statusMessage = document.getElementById('status-message');
            statusMessage.setAttribute('aria-busy', 'true');
        } else {
             if(isError) {
                elements.analysisView.classList.add('hidden');
                elements.searchView.classList.remove('hidden');
                elements.statusContainer.classList.remove('hidden');
                elements.statusContainer.innerHTML = `<div class="card"><p style="color:red;">${message}</p><button onclick="location.reload()">返回重试</button></div>`;
             }
        }
        elements.analyzeBtn.disabled = isLoading;
        elements.analyzeBtn.textContent = isLoading ? '分析中...' : '透视分析';
    }

    function render(data) {
        elements.companyName.textContent = `${data.ticker} (${data.companyName})`;
        elements.timestamp.textContent = `数据更新于: ${data.lastUpdate}`;
        elements.currentPrice.textContent = `$${data.currentPrice.toFixed(2)}`;

        updateMainGauge(data.overallRiskValue);
        updateSummary(data.metrics);
        
        const higherMetrics = data.metrics.filter(m => m.direction === 'higher-is-better');
        const lowerMetrics = data.metrics.filter(m => m.direction === 'lower-is-better');
        renderMetricGroup(higherMetrics, elements.higherBetterGrid, elements.higherBetterList,            
            elements.searchView.classList.add('hidden');
            elements.analysisView.classList.remove('hidden');
            elements.statusContainer.classList.add('hidden');

        } catch (error) {
            setLoadingState(false, `错误: ${error.message}`, true);
        } finally {
            elements.analyzeBtn.disabled = false;
            elements.analyzeBtn.textContent = '透视分析';
        }
    }

    function setLoadingState(isLoading, message, isError = false) {
        elements.statusContainer.innerHTML = `<div class="card" style="text-align:center;"><p id="status-message">${message}</p></div>`;
        const statusMessage = document.getElementById('status-message');
        
        elements.searchView.classList.add('hidden');
        elements.analysisView.classList.add('hidden');
        elements.statusContainer.classList.remove('hidden');

        statusMessage.setAttribute('aria-busy', isLoading ? 'true' : 'false');
        statusMessage.style.color = isError ? 'red' : 'inherit';
        elements.analyzeBtn.disabled = isLoading;
        elements.analyzeBtn.textContent = isLoading ? '分析中...' : '透视分析';
    }

    function render(data) {
        // --- 渲染文本信息 ---
        elements.companyName.textContent = `${data.ticker} (${data.companyName})`;
        elements.timestamp.textContent = `数据更新于: ${data.lastUpdate}`;
        elements.currentPrice.textContent = `$${data.current 'higher');
        renderMetricGroup(lowerMetrics, elements.lowerBetterGrid, elements.lowerBetterList, 'lower');
        
        // 确保切换视图时图表尺寸正确
        window.dispatchEvent(new Event('resize'));
    }

    // --- ECharts及辅助渲染函数 (完整版) ---
    function getValuationStatus(riskValue) {
        const roundedValue = Math.round(riskValue);
        if (roundedValue <= 35) return { text: '低估', color: colors.undervalued };
        if (roundedValue <= 65) return { text: '合理', color: colors.fair };
        if (roundedValue <= 85) return { text: '高估', color: colors.overvalued };
        return { text: '风险', color: colors.high_risk };
    }

    function updateMainGauge(riskValue) {
        const gaugeDom = document.getElementById('main-gauge');
        if (!echartsInstances.main) { echartsInstances.main = echarts.init(gaugeDom); }
        const status = getValuationStatus(riskValue);
        const option = {
            series: [{
                type: 'gauge', startAngle: 180, endAngle: 0,
                animationDurationUpdate: 1000, animationEasingUpdate: 'cubicInOut',
                min: 0, max: 100, splitNumber: 100,
                progress: { show: true, width: 30, roundCap: true, itemStyle: { color: status.color } },
                axisLine: {
                    roundCap: true,
                    lineStyle: { width: 30, color: [[0.35, colors.undervalued], [0.65, colors.fair], [0.85, colors.overvalued], [1, colors.high_risk]] }
                },
                axisTick: { show: false }, splitLine: { show: false },
                axisLabel: {
                    distance: -20, fontSize: 12,
                    formatter: v => ({17:'{undervalued|低估}', 5Price.toFixed(2)}`;

        // --- 渲染所有ECharts图表 ---
        updateMainGauge(data.overallRiskValue);
        updateSummary(data.metrics);
        const higherMetrics = data.metrics.filter(m => m.direction === 'higher-is-better');
        const lowerMetrics = data.metrics.filter(m => m.direction === 'lower-is-better');
        renderMetricGroup(higherMetrics, elements.higherBetterGrid, elements.higherBetterList);
        renderMetricGroup(lowerMetrics, elements.lowerBetterGrid, elements.lowerBetterList);
        
        // --- 确保ECharts图表在视图切换后能重新渲染尺寸 ---
        // 我们在切换视图的函数中处理这个
        toggleView('gauge'); // 默认显示仪表盘视图
    }
    
    // --- ECharts及辅助函数 (完整迁移自你的Codepen JS) ---
    function getValuationStatus(riskValue) {
        const roundedValue = Math.round(riskValue);
        if (roundedValue <= 35) return { text: '低估', color: colors.undervalued };
        if (roundedValue <= 65) return { text: '合理估值', color: colors.fair };
        if (roundedValue <= 85) return { text: '高估', color: colors.overvalued };
        return { text: '风险', color: colors.high_risk };
    }
    
    function updateMainGauge(riskValue) {
        const gaugeDom = document.getElementById('main-gauge');
        if (!gaugeDom) return;
        echartsInstances.main = echarts.init(gaugeDom);
        const status = getValuationStatus(riskValue);
        const option = {
            series: [{
                type: 'gauge', startAngle: 180, endAngle: 0,
                animationDurationUpdate: 1000, animationEasingUpdate: 'cubicInOut',
                min: 0, max: 100, splitNumber: 100,
                progress: { show: true, width: 30, roundCap: true, itemStyle: { color: status.0:'{fair|合理}', 75:'{overvalued|高估}', 93:'{risk|风险}'}[v] || ''),
                    rich: { undervalued: { color: 'white', fontWeight: 'bold' }, fair: { color: 'white', fontWeight: 'bold' }, overvalued: { color: 'white', fontWeight: 'bold' }, risk: { color: 'white', fontWeight: 'bold' } }
                },
                pointer: { length: '60%', width: 6, itemStyle: { color: 'auto' } },
                anchor: { show: true, showAbove: true, size: 20, itemStyle: { borderWidth: 5, borderColor: '#fff' } },
                detail: { valueAnimation: true, offsetCenter: [0, '-15%'], fontSize: 60, fontWeight: 'bold', formatter: v => `${Math.round(v)}`, color: status.color },
                title: { offsetCenter: [0, '25%'], fontSize: 28, fontWeight: 'bold', color: status.color },
                data: [{ value: riskValue, name: status.text }]
            }]
        };
        echartsInstances.main.setOption(option, true);
    }

    function renderMetricGroup(metrics, gridContainer, listContainer, groupKey) {
        gridContainer.innerHTML = ''; listContainer.innerHTML = '';
        metrics.forEach((metric, index) => {
            const status = getValuationStatus(metric.riskValue);
            const unit = metric.unit || '';
            const ratio = metric.industryValue !== 0 ? (metric.stockValue / metric.industryValue).toFixed(2) : 'N/A';
            const miniGaugeId = `mini-gauge-${groupKey}-${index}`;

            const cardHTML = `<div class="metric-card" style="border-color: ${status.color};"><div class="metric-name">${metric.name}</div><div class="mini-gauge" id="${miniGaugeId}"></div><div class="metric-details">个股: ${metric.stockValue.toFixed(2)}${unit} / 行业: ${metric.industryValue}${unit}</div><div class="metric-ratio">${ratio}x</div><div class="metric-status" style="background-color: ${status.color};">${status.text}</div></div>`;
            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
            
            if (!echartsInstances[miniGaugeId]) { echartsInstances[miniGaugeId] = echarts.init(document.getElementById(miniGaugeId)); }
            echartsInstances[miniGaugeId].setOption({ series: [{ type: 'gauge', center: ['50%', '70%'], startAngle: 180, endAngle: 0, min: 0, max: 100, itemStyle: { color: status.color }, progress: { show: true, width: 8, roundCap: true }, axisLine: { lineStyle: {color } },
                axisLine: {
                    roundCap: true,
                    lineStyle: { width: 30, color: [[0.35, colors.undervalued], [0.65, colors.fair], [0.85, colors.overvalued], [1, colors.high_risk]] }
                },
                axisTick: { show: false }, splitLine: { show: false },
                axisLabel: {
                    distance: -20, fontSize: 12,
                    formatter: v => ({17:'{undervalued|低估}', 50:'{fair|合理估值}', 75:'{overvalued|高估}', 93:'{risk|风险}'}[v] || ''),
                    rich: {
                        undervalued: { color: 'white', fontWeight: 'bold', padding: [0, 0, 0, 5] },
                        fair: { color: 'white', fontWeight: 'bold' },
                        overvalued: { color: 'white', fontWeight: 'bold' },
                        risk: { color: 'white', fontWeight: 'bold', padding: [0, 5, 0, 0] }
                    }
                },
                pointer: { length: '60%', width: 6, itemStyle: { color: 'auto' } },
                anchor: { show: true, showAbove: true, size: 20, itemStyle: { borderWidth: 5, borderColor: '#fff' } },
                detail: { valueAnimation: true, offsetCenter: [0, '-15%'], fontSize: 60, fontWeight: 'bold', formatter: v => `${Math.round(v)}`, color: status.color },
                title: { offsetCenter: [0, '25%'], fontSize: 28, fontWeight: 'bold', color: status.color },
                data: [{ value: riskValue, name: status.text }]
            }]
        };
        echartsInstances.main.setOption(option, true);
    }
    
    function renderMetricGroup(metrics, gridContainer, listContainer) {
        gridContainer.innerHTML = ''; listContainer.innerHTML = '';
        metrics.forEach(metric => {
            const status = getValuationStatus(metric.riskValue);
            const unit = metric.unit || '';
            const ratio = metric.industryValue !== 0 ? (metric.stockValue / metric.industryValue).toFixed(2) : 'N/A';
            
            const card = document.createElement('div');
            card.className = 'metric-card';
            card.style.borderColor = status.color;
            card.innerHTML = `<div class="metric-name">${metric.name}</div><div class="mini-gauge" id="mini-gauge-${metric.id}"></div><div class="metric-details">个股: ${metric.stockValue.toFixed(2)}${unit} / 行业: ${metric.industryValue.toFixed(2)}${unit}</div><div class="metric-ratio width: 8 } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, pointer: { show: false }, detail: { valueAnimation: true, offsetCenter: [0, '-10%'], fontSize: 22, fontWeight: 'bold', color: status.color, formatter: (v) => `${Math.round(v)}`}, data: [{ value: metric.riskValue }] }] });
            
            const itemHTML = `<div class="list-item" style="border-color: ${status.color};"><div class="list-item-main"><div class="list-item-name">${metric.name}</div><div class="list-item-values">个股: ${metric.stockValue.toFixed(2)}${unit} / 行业: ${metric.industryValue}${unit}</div></div><div class="list-item-score"><div class="list-item-ratio">${ratio}x</div><div class="list-item-badge" style="background-color: ${status.color};">${status.text}</div></div></div>`;
            listContainer.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    function updateSummary(metrics) {
        if (!echartsInstances.summary) { echartsInstances.summary = echarts.init(document.getElementById('summary-chart')); }
        const counts = { undervalued: 0, fair: 0, overvalued: 0, high_risk: 0 };
        metrics.forEach(metric => {
            const status = getValuationStatus(metric.riskValue);
            if (status.text === '低估') counts.undervalued++;
            else if (status.text === '合理') counts.fair++;
            else if (status.text === '高估') counts.overvalued++;
            else if (status.text === '风险') counts.high_risk++;
        });
        echartsInstances.summary.setOption({ grid: { left: 0, right: 0, top: 0, bottom: 0 }, xAxis: { show: false, max: metrics.length }, yAxis: { show: false, type: 'category' }, animationDurationUpdate: 500, series: [ { name: '低估', type: 'bar', stack: 'total', itemStyle: { color: colors.undervalued }, label: { show: true, color: '#fff' }, data: [counts.undervalued] }, { name: '合理', type: 'bar', stack: 'total', itemStyle: { color: colors.fair }, label: { show: true, color: '#fff' }, data: [counts.fair] }, { name: '高估', type: 'bar', stack: 'total', itemStyle: { color: colors.overvalued }, label: { show: true, color: '#fff' }, data: [counts.overvalued] }, { name: '风险', type: 'bar', stack: 'total', itemStyle: { color: colors.high_risk }, label: { show: true, color: '#fff' }, data: [counts.high_risk] } ]}, true);
        
        const textParts = [];
        if (counts.undervalued > 0) textParts.push(`<span style="color:${colors.undervalued}; font-weight:bold;">${counts.undervalued}个低估</span>`);
        if (counts.fair > 0) textParts.push(`<span style="color:${colors.fair}; font-weight:bold;">${counts.fair}个合理</span>`);
        if (counts.overvalued > 0) textParts.push(`<span style="color:${colors.overvalued}; font-weight:bold;">${counts.overvalued}个高估</span>`);
        if (counts.high_risk > 0) textParts.push(`<span style="color:${colors.high_risk}; font-weight:bold;">${counts.high_risk}个风险</span>`);">${ratio}x</div><div class="metric-status" style="background-color: ${status.color};">${status.text}</div>`;
            gridContainer.appendChild(card);
            
            const miniGaugeDom = document.getElementById(`mini-gauge-${metric.id}`);
            if(miniGaugeDom) {
                echartsInstances[metric.id] = echarts.init(miniGaugeDom);
                echartsInstances[metric.id].setOption({
                     series: [{
                        type: 'gauge', center: ['50%', '70%'], startAngle: 180, endAngle: 0,
                        min: 0, max: 100, itemStyle: { color: status.color },
                        progress: { show: true, width: 8, roundCap: true }, axisLine: { lineStyle: { width: 8 } },
                        axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, pointer: { show: false },
                        detail: { valueAnimation: true, offsetCenter: [0, '-10%'], fontSize: 22, fontWeight: 'bold', color: status.color, formatter: v => `${Math.round(v)}`},
                        data: [{ value: metric.riskValue }]
                    }]
                });
            }
            
            const item = document.createElement('div');
            item.className = 'list-item';
            item.style.borderColor = status.color;
            item.innerHTML = `<div class="list-item-main"><div class="list-item-name">${metric.name}</div><div class="list-item-values">个股: ${metric.stockValue.toFixed(2)}${unit} / 行业: ${metric.industryValue.toFixed(2)}${unit}</div></div><div class="list-item-score"><div class="list-item-ratio">${ratio}x</div><div class="list-item-badge" style="background-color: ${status.color};">${status.text}</div></div>`;
            listContainer.appendChild(item);
        });
    }

    function updateSummary(metrics) {
        const summaryDom = document.getElementById('summary-chart');
        if (!summaryDom) return;
        echartsInstances.summary = echarts.init(summaryDom);
        const counts = { undervalued: 0, fair: 0, overvalued: 0, high_risk: 0 };
        metrics.forEach(metric => {
            const status = getValuationStatus(metric.riskValue);
            if (status.text === '低估') counts.undervalued++;
            else if (status.text === '合理估值') counts.fair++;
            else if (status.text === '高估') counts.overvalued++;
            else if (status.text === '风险') counts.risk++;
        });
        
        echartsInstances.summary.setOption({
            grid: { left: 0, right: 0, top: 0, bottom: 0 },
            xAxis: { show: false, max: metrics.length },
            yAxis: { show: false, type: 'category' },
            animationDurationUpdate: 500,
            series: [
                { name: '低估', type: 'bar', stack: 'total', itemStyle: { color: colors.undervalued }, label: { show: true, color: '#fff', formatter: (p) => p.value > 0 ? p.value : '' }, data: [counts.undervalued] },
                { name: '合理估值', type: 'bar', stack: 'total', itemStyle: { color: colors.fair }, label: { show: true, color: '#fff', formatter: (p) => p.value > 0 ? p.value : '' }, data: [counts.fair] },
                { name: '高估', type:
        elements.summaryText.innerHTML = `发现: ${textParts.join('，') || '暂无明确信号'}`;
    }
    
    function toggleView(view) {
        const isGaugeView = view === 'gauge';
        elements.viewToggleGaugeBtn.classList.toggle('active', isGaugeView);
        elements.viewToggleListBtn.classList.toggle('active', !isGaugeView);
        elements.higherBetterGrid.style.display = isGaugeView ? 'grid' : 'none';
        elements.lowerBetterGrid.style.display = isGaugeView ? 'grid' : 'none';
        elements.higherBetterList.style.display = isGaugeView ? 'none' : 'flex';
        elements.lowerBetterList.style.display = isGaugeView ? 'none' : 'flex';
    }

    // 监听窗口大小变化，重绘ECharts图表
    window.addEventListener('resize', () => {
        for(const key in echartsInstances) {
            if(echartsInstances[key]) {
                echartsInstances[key].resize();
            }
        }
    });
});