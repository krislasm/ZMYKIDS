sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		formatDateTT: function(d) {
			if (d) {
				var t = sap.ui.core.format.DateFormat.getTimeInstance({
					pattern: "HH:mm"
				});
				var T = new Date(0).getTimezoneOffset() * 60 * 1000;
				var a = t.format(new Date(d.ms + T));
				return a;
			}
		},
		
		ColColor: function(e){
			if(e)
			{
				return "redCol";
			}
			else
			{
				return "";
			}
		},

		concatAddress: function(v, V) {
			if (v && V) {
				return v + "," + " " + V;
			} else if (v) {
				return v;
			} else if (V) {
				return V;
			}
		},
		setEvntStatus: function(v, V) {
			if (v && V != null) {
				if (V) {
					//this.setState("Error");
					var c = this.getResourceBundle().getText('TXT_CANCELLED_LBL');
					return c + ":" + " " + v;
				} else {
				//	this.setState("None");
					return v;
				}
			}
		},
		concatPinCode: function(v, V) {
			return v + " " + V;
		},
		concatDates: function(v, V) {
			var t = this.getModel("i18n").getResourceBundle().getText("LBL_VALIDITY");
			return t + ": " + v + " " + "-" + " " + V;
		},
		linkTxtAppnd: function(v) {
			var t = this.getResourceBundle().getText("LBL_KNWNAS");
			return t + ": " + v;
		},
		linkTxtAppndFaculty: function(v) {
			var t = this.getResourceBundle().getText("LBL_FACULTY");
			return t + ": " + v;
		},
		linkTxtAppndAdv: function(v) {
			var t = this.getResourceBundle().getText("LBL_ADVISOR");
			return t + ": " + v;
		},
		formatStatus: function(v) {
			if (v === "true") {
				return "Success";
			}
		},
		formatVisibility: function(v) {
			if (v === true) {
				return true;
			} else {
				return false;
			}
		},
		concatDatesFormat: function(v, V) {
			var d = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			});
			/*var D = d.format(new Date(v));
			var s = d.format(new Date(V));*/
			if(v !== undefined && v !== "")
			var D = d.format(new Date(v));
			if(V !== undefined && V !== "")
			var s = d.format(new Date(V));
			if (D !== "") {
				v = D;
			}
			if (s !== "") {
				V = s;
			}
			return v + " " + "-" + " " + V;
		},
		AddrTypeVisibility: function(v) {
			if (v) {
				return true;
			} else {
				return false;
			}
		},
		checkValue: function(v) {
			if (v) {
				return true;
			} else {
				return false;
			}
		},
		checkPhone: function(v) {
			if (v) {
				return false;
			} else {
				return true;
			}
		},
		formatDate: function(v, V) {
			var d = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			});
			/*var D = d.format(new Date(v));
			var s = d.format(new Date(V));*/
			if(v !== undefined && v !== "")
			var D = d.format(new Date(v));
			if(V !== undefined && V !== "")
			var s = d.format(new Date(V));
			if (D !== "") {
				v = D;
			}
			if (s !== "") {
				V = s;
			}
			if (v && V) {
				var t = this.getModel("i18n").getResourceBundle().getText("LBL_VALIDITY");
				return t + ": " + v + " " + "-" + " " + V;
			} else if (v) {
				return v;
			} else if (V) {
				return V;
			}
		},
		checkVisible: function(v, V) {
			if (V) {
				return false;
			} else {
				if (v) {
					return true;
				} else {
					return false;
				}
			}
		}
	};

});