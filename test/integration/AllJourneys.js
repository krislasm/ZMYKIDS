jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 AdviseesListSet in the list
// * All 3 AdviseesListSet have at least one ListToDetailsHdr

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
		"swa/mykids/test/integration/MasterJourney",
		"swa/mykids/test/integration/NavigationJourney",
		"swa/mykids/test/integration/NotFoundJourney",
		"swa/mykids/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});