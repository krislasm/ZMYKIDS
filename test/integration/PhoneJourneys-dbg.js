jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"swa/mykids/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"swa/mykids/test/integration/pages/App",
	"swa/mykids/test/integration/pages/Browser",
	"swa/mykids/test/integration/pages/Master",
	"swa/mykids/test/integration/pages/Detail",
	"swa/mykids/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "swa.mykids.view."
	});

	sap.ui.require([
		"swa/mykids/test/integration/NavigationJourneyPhone",
		"swa/mykids/test/integration/NotFoundJourneyPhone",
		"swa/mykids/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});