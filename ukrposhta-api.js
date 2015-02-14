var URL = require('url') ;
var xml2js = require('xml2js');
var request = require('request');
var Q = require('q');

var URKPOSHTA_API_PROTOCOL = 'http';
var URKPOSHTA_API_HOST = 'services.ukrposhta.com';
var URKPOSHTA_API_PATH = 'barcodestatistic/barcodestatistic.asmx';
var URKPOSHTA_API_BARCODE_INFO_PATH = URKPOSHTA_API_PATH + '/GetBarcodeInfo';

var BARCODE_INFO_PROPERTIES = [
    'barcode',
    'code',
    'lastOfficeIndex',
    'lastOffice',
    'eventDescription',
    'eventDate'
];

var DEFAULT_USER_KEY = 'fcc8d9e1-b6f9-438f-9ac8-b67ab44391dd';
var DEFAULT_LANGUAGE = 'uk';

function UkrposhtaApi (options) {
    options = options || {};
    this._userKey = options.userKey || DEFAULT_USER_KEY;
    this._language = options.language || DEFAULT_LANGUAGE;
}

UkrposhtaApi.prototype.getBarcodeInfo = function(barcode) {
    var barcodeInfoUrl = buildBarcodeInfoUrl(this._userKey, this._language, barcode);

    return Q.nfcall(request, barcodeInfoUrl)
        .then(parseReponseToXml)
        .then(convertToBarcodeInfo)
        .catch(throwUrkposhtaApiError);
};

function buildBarcodeInfoUrl(userKey, language, barcode) {
    return URL.format({
        protocol: URKPOSHTA_API_PROTOCOL,
        host: URKPOSHTA_API_HOST,
        pathname: URKPOSHTA_API_BARCODE_INFO_PATH,
        query: {
            guid: userKey,
            culture: language,
            barcode: barcode
        }
    });
}

function parseReponseToXml (response) {
    var responseBody = response[1];
    return Q.nfcall(xml2js.parseString, responseBody);
}

function getPropertyFromParsedXml (parsedBarcodeInfoXML, propertyName) {
    var propertyValue = parsedBarcodeInfoXML.BarcodeInfoService[propertyName.toLowerCase()];
    return (propertyValue && propertyValue[0].trim()) || '';
}

function convertToBarcodeInfo (parsedBarcodeInfoXML) {
    return BARCODE_INFO_PROPERTIES.reduce(function(barcodeInfo, propertyName) {
        barcodeInfo[propertyName] = getPropertyFromParsedXml(parsedBarcodeInfoXML, propertyName);
        return barcodeInfo;
    }, {});
}

function throwUrkposhtaApiError (error) {
    throw new Error('Ukrposhta API error: ' + error);
}

exports.UkrposhtaApi = UkrposhtaApi;
