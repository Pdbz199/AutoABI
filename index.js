"use strict";
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
        while (_) try {
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
exports.__esModule = true;
exports.AutoABI = exports.ABI = void 0;
var axios_1 = require("axios");
var fs = require("fs");
var cheerio = require("cheerio");
var jsonfile = require("jsonfile");
var mkdirp = require("mkdirp");
var ABI = /** @class */ (function () {
    function ABI(abiString) {
        var _this = this;
        this.abiString = abiString;
        this.abiJSON = JSON.parse(abiString);
        this.length = this.abiJSON.length;
        this.readableABI = { "functions": {}, "events": {} };
        this.abiJSON.forEach(function (entry) {
            if (entry.type === 'function') {
                _this.readableABI.functions[entry.name] = entry;
            }
            else if (entry.type === 'event') {
                _this.readableABI.events[entry.name] = entry;
            }
        });
    }
    ABI.prototype.getFunctions = function () {
        return this.readableABI.functions;
    };
    ABI.prototype.getFunctionInputs = function (functionName) {
        return this.readableABI.functions[functionName].inputs;
    };
    ABI.prototype.getEvents = function () {
        return this.readableABI.events;
    };
    return ABI;
}());
exports.ABI = ABI;
var AutoABI = /** @class */ (function () {
    function AutoABI() {
    }
    AutoABI.downloadABI = function (unparsedABI, contractName, path) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!path)
                            path = './ABIs/';
                        updatedPath = (path.endsWith('/') ? path : (path + '/')) + (contractName + ".json");
                        if (!!fs.existsSync(path)) return [3 /*break*/, 2];
                        return [4 /*yield*/, mkdirp(path)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        jsonfile.writeFileSync(updatedPath, JSON.parse(unparsedABI));
                        return [2 /*return*/];
                }
            });
        });
    };
    AutoABI.getABI = function (contractAddress, download, path) {
        return __awaiter(this, void 0, void 0, function () {
            var response, $, contractName, unparsedABI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://etherscan.io/address/" + contractAddress + "#code")];
                    case 1:
                        response = _a.sent();
                        $ = cheerio.load(response.data);
                        contractName = $('#ContentPlaceHolder1_contractCodeDiv').find('.h6.font-weight-bold.mb-0').html();
                        unparsedABI = $('#js-copytextarea2').html();
                        if (download)
                            this.downloadABI(unparsedABI, contractName, path);
                        return [2 /*return*/, new ABI(unparsedABI)];
                }
            });
        });
    };
    AutoABI.getABIs = function (contractAddresses, download, path) {
        return __awaiter(this, void 0, void 0, function () {
            var contractABIs, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        contractABIs = [];
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < contractAddresses.length)) return [3 /*break*/, 5];
                        _b = (_a = contractABIs).push;
                        return [4 /*yield*/, AutoABI.getABI(contractAddresses[i], download, path)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 650); })]; // to avoid potential spam error
                    case 3:
                        _c.sent(); // to avoid potential spam error
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, contractABIs];
                }
            });
        });
    };
    AutoABI.getABIFromAPI = function (contractAddress, download, path, contractName) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get("https://api.etherscan.io/api?module=contract&action=getabi&address=" + contractAddress)];
                    case 1:
                        response = _a.sent();
                        if (response.data.status == 0)
                            throw response.data.result;
                        if (download)
                            this.downloadABI(response.data.result, contractName, path);
                        return [2 /*return*/, new ABI(response.data.result)];
                }
            });
        });
    };
    return AutoABI;
}());
exports.AutoABI = AutoABI;
exports["default"] = AutoABI;
