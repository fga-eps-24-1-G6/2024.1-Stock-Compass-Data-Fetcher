"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeStocks = void 0;
var puppeteer_1 = require("puppeteer");
var puppeteer_cluster_1 = require("puppeteer-cluster");
var fs_1 = require("fs");
var baseURL = process.env.SCRAPER_BASE_URL;
var stockListURL = process.env.SCRAPER_LIST_URL;
var scrapeStockList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto(stockListURL)];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.$$eval('table tr td', function (tds) { return tds
                        .filter(function (td) { if (!td.cellIndex)
                        return td; })
                        .map(function (td) { return td.innerText; }); })];
            case 4:
                results = _a.sent();
                return [4 /*yield*/, browser.close()];
            case 5:
                _a.sent();
                return [2 /*return*/, results];
        }
    });
}); };
var getCompanyInfo = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var pageData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.waitForSelector(".basic_info")];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        var div = document.querySelector('.basic_info');
                        var rows = div.querySelectorAll('table tbody tr');
                        var data = {};
                        rows.forEach(function (row) {
                            var cells = row.querySelectorAll('td');
                            var label = cells[0].innerText;
                            var value = cells[1].innerText;
                            data[label] = value;
                        });
                        return data;
                    })];
            case 2:
                pageData = _a.sent();
                return [2 /*return*/, pageData];
        }
    });
}); };
var getCompanyIndicators = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var data, companyData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.waitForSelector("div[id='table-indicators-company']")];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.$$eval(".cell", function (items) {
                        return items.map(function (item) {
                            var _a, _b, _c, _d, _e, _f;
                            var name = (_b = (_a = item.querySelector("span.title")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                            var value;
                            var rawValue = (_d = (_c = item.querySelector("div.detail-value")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
                            if (!rawValue)
                                value = (_f = (_e = item.querySelector("span.value")) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim();
                            else
                                value = parseFloat(rawValue
                                    .replaceAll('\n', '')
                                    .replace('R$ ', '')
                                    .replace('%', '')
                                    .replaceAll('.', '')
                                    .replace(',', '.').trim());
                            if (name && value) {
                                return {
                                    name: name.replaceAll('\n', '').trim(),
                                    value: value
                                };
                            }
                        }).filter(Boolean);
                    })];
            case 2:
                data = _a.sent();
                companyData = {};
                data.forEach(function (item) { return companyData[item.name] = item.value; });
                return [2 /*return*/, companyData];
        }
    });
}); };
var scrapeStocks = function () { return __awaiter(void 0, void 0, void 0, function () {
    var stocks, tickers, cluster, _i, tickers_1, ticker, stocksData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stocks = [];
                return [4 /*yield*/, scrapeStockList()];
            case 1:
                tickers = _a.sent();
                return [4 /*yield*/, puppeteer_cluster_1.Cluster.launch({
                        concurrency: puppeteer_cluster_1.Cluster.CONCURRENCY_CONTEXT,
                        maxConcurrency: 15,
                    })];
            case 2:
                cluster = _a.sent();
                return [4 /*yield*/, cluster.task(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                        var urls, responseHandler, company_data, _c, _d, stockUrl, stock_id, companyUrl, company_id;
                        var page = _b.page, data = _b.data;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    console.log('Procurando ação: ' + data);
                                    urls = [];
                                    responseHandler = function (response) { return __awaiter(void 0, void 0, void 0, function () {
                                        var url;
                                        return __generator(this, function (_a) {
                                            url = response.url();
                                            if (url.includes("".concat(baseURL, "/api")) && !url.includes('component')) {
                                                urls.push(url);
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); };
                                    page.on('response', responseHandler);
                                    return [4 /*yield*/, page.goto("".concat(baseURL, "/acoes/").concat(data), {
                                            waitUntil: "load",
                                            timeout: 0,
                                        })];
                                case 1:
                                    _e.sent();
                                    _c = [{}];
                                    return [4 /*yield*/, getCompanyInfo(page)];
                                case 2:
                                    _d = [__assign.apply(void 0, _c.concat([_e.sent()]))];
                                    return [4 /*yield*/, getCompanyIndicators(page)];
                                case 3:
                                    company_data = __assign.apply(void 0, _d.concat([_e.sent()]));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                                case 4:
                                    _e.sent();
                                    page.off('response', responseHandler);
                                    stockUrl = urls.find(function (url) { return url.includes('cotacao/ticker/'); });
                                    stock_id = typeof stockUrl != 'undefined' ? stockUrl.split('cotacao/ticker/')[1] : "";
                                    companyUrl = urls.find(function (url) { return url.includes('receitaliquida/chart/'); });
                                    company_id = typeof companyUrl != 'undefined' ? companyUrl.split('receitaliquida/chart/')[1].split('/')[0] : "";
                                    if (stock_id || company_id) {
                                        stocks.push({
                                            ticker: data,
                                            stock_id: stock_id,
                                            company_id: company_id,
                                            company_data: company_data
                                        });
                                        console.log('Dados de ' + data + ' adicionados');
                                    }
                                    else
                                        console.log('Não foram encontrados dados de ' + data);
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                for (_i = 0, tickers_1 = tickers; _i < tickers_1.length; _i++) {
                    ticker = tickers_1[_i];
                    cluster.queue(ticker);
                    console.log('Enfileirou: ' + ticker);
                }
                return [4 /*yield*/, cluster.idle()];
            case 4:
                _a.sent();
                return [4 /*yield*/, cluster.close()];
            case 5:
                _a.sent();
                stocksData = JSON.stringify(stocks);
                fs_1.default.writeFile("stocks.json", stocksData, function (error) {
                    if (error) {
                        console.error(error);
                        throw error;
                    }
                    console.log("stocks.json written correctly");
                });
                return [2 /*return*/];
        }
    });
}); };
exports.scrapeStocks = scrapeStocks;
(0, exports.scrapeStocks)();
// const file = fs.readFileSync("stocks1.json");
// const data = JSON.parse(file)
// console.log(data.length)
