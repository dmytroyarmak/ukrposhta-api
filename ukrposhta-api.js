var URL = require('url') ;

var URKPOSHTA_API_PROTOCOL = 'http';
var URKPOSHTA_API_HOST = 'services.ukrposhta.com';
var URKPOSHTA_API_PATH = 'barcodestatistic/barcodestatistic.asmx';
var URKPOSHTA_API_GET_BARCODE_INFO_PATH = URKPOSHTA_API_PATH + '/GetBarcodeInfo';

var DEFAULT_USER_KEY = 'cc8d9e1-b6f9-438f-9ac8-b67ab44391dd';
var DEFAULT_LANGUAGE = 'uk';

function UkrposhtaApi (options) {
	options = options || {};
	this._userKey = options.userKey || DEFAULT_USER_KEY;
	this._language = options.language || DEFAULT_LANGUAGE;
}

UkrposhtaApi.prototype._getBarcodeInfoUrl = function(barcode) {
	return URL.format({
		protocol: URKPOSHTA_API_PROTOCOL,
		host: URKPOSHTA_API_HOST,
		pathname: URKPOSHTA_API_GET_BARCODE_INFO_PATH,
		query: {
			guid: this._userKey,
			culture: this._language,
			barcode: barcode
		}
	});
};

UkrposhtaApi.prototype.getBarcodeInfo = function(barcode) {
	var getBarcodeInfoUrl = this._getBarcodeInfoUrl();
	console.log('make call to', getBarcodeInfoUrl);
};


exports.UkrposhtaApi = UkrposhtaApi;
