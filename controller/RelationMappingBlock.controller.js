/*
 * Copyright (C) 2009-2017 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["swa/mykids/controller/BaseController", "swa/mykids/model/formatter"],
	function(B, f) {
		"use strict";
		return B.extend("swa.mykids.controller.RelationMappingBlock", {
			formatter: f,
			onInit: function() {},
			onTelPress: function(e) {
				sap.m.URLHelper.triggerTel(e.getSource().getText());
			},
			onMailPress: function(e) {
				sap.m.URLHelper.triggerEmail(e.getSource().getText());
			}
		});
	});