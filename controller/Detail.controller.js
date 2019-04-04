/*global location */
var that = null;
sap.ui.define([
	"swa/mykids/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"swa/mykids/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(B, J, f, MessageToast, F, a) {
	"use strict";

	return B.extend("swa.mykids.controller.Detail", {

		formatter: f,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			that = this;
			var oViewModel = new J({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
		},
		onPress: function(oEvent) {
			// get a handle on the global XAppNav service
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.isIntentSupported(["parent-child"])
				.done(function(aResponses) {})
				.fail(function() {
					new MessageToast("Provide corresponding intent to navigate");
				});
			// generate the Hash to display a employee Id
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "parent",
					action: "child"
				}
			})) || "";
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash;
			//Navigate to second app
			sap.m.URLHelper.redirect(url, true);
		},

		_handleAddressSearch: function(e) {
			var v = e.getParameter("value"),
				o = new sap.ui.model.Filter("AddressDescription", sap.ui.model.FilterOperator.Contains, v),
				b = e.getSource().getBinding("items");
			b.filter([o]);
		},
		onStudentPress: function(e) {
			sap.m.URLHelper.triggerEmail(e.getSource().getCustomData()[0].getKey());
		},
		onEditPress: function() {
			this.getRouter().navTo("editHeader", {
				navBack: "edit"
			});
		},
		onSelectedAddress: function(s) {
			var b = s.getSource().getBindingContext("oSelectAddress").getObject();
			this.oSelectedGuid = b.AddressGuid;
		},
		onEditButtonPress: function(e) {
			this.getRouter().navTo("editAddress", {
				oSelectedGuid: e.getParameter("selectedItem").getBindingContext("oSelectAddress").getObject().AddressGuid
			});
		},
		onMoveButtonPress: function() {
			this.getRouter().navTo("moveAddress", {
				oSelectedGuid: sap.ui.getCore().byId("idListAddress").getSelectedItems()[0].getBindingContext("oSelectAddress").getObject().AddressGuid
			});
		},
		onCloseDialog: function() {
			sap.ui.getCore().byId("idSearchField").setValue("");
			this._oDialog.close();
		},
		onPressMove: function() {
			this.getRouter().navTo("moveAddress", {});
		},
		onPhonePress: function(e) {
			sap.m.URLHelper.triggerTel(e.getSource().getText());
		},
		onEMailPress: function(e) {
			sap.m.URLHelper.triggerEmail(e.getSource().getText());
		},
		onFBPress: function() {
			sap.m.URLHelper.redirect(this.response.FacebookLink, true);
		},
		onTwitterPress: function() {
			sap.m.URLHelper.redirect(this.response.TwitterLink, true);
		},
		onUniversityPress: function(e) {
			sap.m.URLHelper.redirect(e.getSource().getCustomData()[0].getKey(), true);
		},
		onAdvPress: function(e) {
			var t = this;
			var b = e.getSource();
			if (!this._oQuickView) {
				var p = {
					success: function(r) {
						var o = new sap.ui.model.json.JSONModel();
						o.setData(r);
						t._oQuickView = sap.ui.xmlfragment("swa.mykids.view.ContactCard", t);
						t.getView().addDependent(t._oQuickView);
						t._oQuickView.setModel(o);
						t._oQuickView.openBy(b);
					}.bind(),
					error: function() {
						jQuery.sap.log.info("Odata Error occured");
					}.bind()
				};
				this.getOwnerComponent().getModel().read("/AdvisorContactDetailsSet('" + this.response.AdvisorPernr + "')", p);
			} else {
				this._oQuickView.openBy(b);
			}
		},

		handleIconTabBarSelect: function(e) {
			that = this;
			that.AttUrl = "/sap/opu/odata/sap/ZPIQ_STUDENT_ATTENDANCE_SRV/";

			that.oDataModel = new sap.ui.model.odata.v2.ODataModel(that.AttUrl, {
				json: true,
				loadMetadataAsync: true
			});

			var sKey = e.getParameter("key");
			if(this.getModel('FinalPdf'))
			{
			this.getModel('FinalPdf').setData();
			this.getModel('FinalPdf').refresh();
			}
			if (sKey === "Details") {
				this.byId("btnWeek").setVisible(false);
				this.byId("btnMonth").setVisible(false);
				this.byId("btnToday").setVisible(false);
			} else if (sKey === "TimeTable") {
				this.byId("btnWeek").setVisible(true);
				this.byId("btnMonth").setVisible(true);
				this.byId("btnToday").setVisible(true);
				this.timeTable();
			} else if (sKey === "Attendance") {
				this.byId("btnWeek").setVisible(false);
				this.byId("btnMonth").setVisible(false);
				this.byId("btnToday").setVisible(false);
				this.getAttendanceDetails();
			} else if (sKey === "Assignments") {
				this.byId("btnWeek").setVisible(false);
				this.byId("btnMonth").setVisible(false);
				this.byId("btnToday").setVisible(false);
				//this.getAssignmentDetails();
				this.dropdownAssignmentData();
			} else if (sKey === "FinalResult") {
				this.byId("btnWeek").setVisible(false);
				this.byId("btnMonth").setVisible(false);
				this.byId("btnToday").setVisible(false);
				this.finalResultPdf();
			}
		},
		finalResultPdf: function(e) {
			that = this;
			var pdfstudentId = [];
			pdfstudentId.push(new sap.ui.model.Filter("Stobjid", sap.ui.model.FilterOperator.EQ, this.stdObjId));
			var filterstudentId = new sap.ui.model.Filter({
				filters: pdfstudentId,
				and: true
			});
			var filter = new sap.ui.model.Filter({
				filters: [filterstudentId],
				and: true
			});
			that.oDataModel.read("/FinalResultSet", {
				filters: [filter],
				success: function(oData, response) {

					var dataModel = new J();
					dataModel.setData({
						"Value": oData.results
					});
					that.getView().setModel(dataModel, "FinalPdf");
					if (oData.results.length === 0) {
						that.byId("pdfViewer").setTitle("No Report Card Avalable at this time");
					} else {
						that.byId("pdfViewer").setTitle("Report Card");
					}

				}
			});

		},
		timeTable: function(e) {
			this.oFooterBar = this.byId("master_footer");
			this.oList = this.byId("l");
			this.oCal = this.byId("cal");
			var o = sap.m.getLocaleData();
			this.oCLegend = this.byId('calLegId');
			this.oPage = this.byId('appointmentListPage');
			this.oCal.setMonths(o.getMonths("wide"));
			this.byId("calLegId").mAggregations.icon.setVisible(false);
			this.osbtnTimeSwitch = this.byId("sbtnTimeSwitch");
			this.filterDate = new Date(new Date().toDateString());
			//this.byId("sbtnTimeSwitch").setSelectedButton("btnMonth");
			this.oCal.toggleDatesSelection([this.filterDate], true);
			this.oCal.rerender();
			this.calendarType = 'M';
			this.getAppointmentList();
			this.oList.attachUpdateFinished(function(a, b, c) {
				var d = new Date(this.filterDate);
				this.oCal.toggleDatesSelection([this.filterDate], true);
			}, this);
		},
		getDateString: function(d) {
			var D = d.getDate().toString();
			D = (D.length === 1) ? "0" + D : D;
			var m = d.getMonth() + 1;
			m = m.toString();
			m = (m.length === 1) ? "0" + m : m;
			var y = d.getFullYear();
			var s = y + "/" + m + "/" + D;
			return s;
		},
		/*	onAppointmentClicked: function(e) {
				var m = new Date(e.oSource.getBindingContext().getObject().EventDate);
				this.filterDate = m;
				var t = new Date(m);
				var M = t.getMonth() + 1;
				var d = t.getFullYear() + "-" + M + "-" + t.getDate();
				this.oRouter.navTo("detail", {
					oModId: "" + e.oSource.getBindingContext().getObject().ModuleId,
					oEvtId: "" + e.oSource.getBindingContext().getObject().EventId,
					oEvtDate: "" + m.toISOString().split("Z")[0],
					ocal: "" + this.calendarType
				}, true);
			},*/
		getAppointmentList: function() {
			this.sTTUrl = "/sap/opu/odata/sap/ZPIQ_STUDENT_TIMETABLE_SRV/";
			var oTimetableModel = new sap.ui.model.odata.v2.ODataModel(that.sTTUrl, {
				json: true,
				loadMetadataAsync: true
			});
			var l = this.byId("AppListItem");
			this.oList.removeItem(l);
			this.oList.setModel(oTimetableModel);
			var f = this.getViewFilters();
			var t = this;
			var d = new sap.ui.model.Sorter("EventDate", false, function(c) {
				var D = c.getProperty("EventDate");
				if (typeof D === "string") {
					D = D.replace("/Date(", "").replace(")/", "");
					var i = parseInt(D);
					D = new Date(i);
				}
				var a = sap.ui.core.format.DateFormat.getDateInstance({
					style: "full"
				});
				return {
					key: t.getDateString(D),
					text: a.format(D)
				}
			});
			this.oCal.removeTypesOfAllDates();
			this.oList.bindAggregation("items", {
				path: "/EventListSet",
				template: l,
				length: 500,
				sorter: d,
				filters: f,
				groupHeaderFactory: function(g) {
					var h = new sap.m.GroupHeaderListItem({
						title: g.text
					});
					if (g.key === t.getDateString(new Date())) {
						h.addStyleClass("sapMLabelBold");
					}
					t.oCal.toggleDatesType([g.key], "Type06", true);
					h.setUpperCase(false);
					return h;
				}
			});
		},
		getViewFilters: function() {
			var d = [];
			var c = this.byId("cal");
			var D = c.getCurrentDate();
			var s = new Date(D);
			var o = new Date(D);
			var a = new Date(D);
			var i = s.getDay();
			if (this.calendarType == "W") {
				var O = c.getFirstDayOffset();
				var b = i - O;
				var e = 7 - b;
				o.setDate(s.getDate() - b);
				a.setDate(s.getDate() + e);
				a.setTime(a.getTime() - 1);
				this.calFromRange = o;
				this.calToRange = a;
			} else if (this.calendarType == "M") {
				var y = s.getFullYear();
				var m = s.getMonth();
				o = new Date(y, m, 2);
				a = new Date(y, m + 1, 1);
				a.setTime(a.getTime() - 1);
				this.calFromRange = o;
				this.calToRange = a;
			} else if (this.calendarType === "D") {
				var S = this.oCal.getSelectedDates()[0];
				if (!S) {
					S = c.getCurrentDate();
				}
				var f = new Date(S);
				o = f;
				a = f;
				a.setDate(a.getDate() + 1);
				a.setTime(a.getTime() - 1);
				this.calFromRange = f;
				this.calToRange = f;
			}
			var F;
			F = new sap.ui.model.odata.Filter("EventDate", [{
				operator: "BT",
				value1: o,
				value2: a
			}]);
			d.push(F);

			d.push(new sap.ui.model.Filter("EventId", sap.ui.model.FilterOperator.EQ, this.stdObjId));
			return d;
		},
		onDateRangeChanged: function(e) {
			var t;
		},
		modulus: function(n) {
			if (n < 0) {
				return -n;
			}
			return n;
		},
		onDateClicked: function(e) {
			if (this.calendarType == "D") {
				this.getAppointmentList();
			}
			if (this.bIsPhone && this.calendarType == "M") {
				var c = new Date(e.getParameter("date"));
				this.oCal.setCurrentDate(c);
				this._buttonDisplayWeek();
				return;
			}
			if (this.calendarType !== "D") {
				var c = new Date(e.getParameter("date"));
				if (e.oSource.getSelectedDates.length == 0) {
					this.oCal.toggleDatesSelection([c], true)
				}
				//	this.scrollToDate(c, this);
			}
		},
		onCurrentDateChanged: function(e) {
			this.getAppointmentList();
			this.oCal.toggleDatesSelection(this.oCal.getSelectedDates(), false);
		},
		_buttonDisplayWeek: function() {
			this.calendarType = 'W';
			this.filterDate = this.oCal.getSelectedDates()[0];
			var d;
			if (this.oCal.getSelectedDates().length > 0) {
				d = this.getDateParameterfromDate(new Date(this.oCal.getSelectedDates()[0]));
			} else {
				d = "_" + this.getDateParameterfromDate(this.calFromRange);
			}
			this.onDisplayWeek(null);
			this.getAppointmentList();
			/*	if (!this.filterAccountID) {
					this.oRouter.navTo("week", {
						Date: d
					});
				}*/
		},
		_buttonDisplayMonth: function() {
			this.calendarType = 'M';
			this.filterDate = this.oCal.getSelectedDates()[0];
			var d;
			if (this.oCal.getSelectedDates().length > 0) {
				d = this.getDateParameterfromDate(new Date(this.oCal.getSelectedDates()[0]));
			} else {
				d = "_" + this.getDateParameterfromDate(this.calToRange);
			}
			this.onDisplayMonth(null);
			this.getAppointmentList();
		},
		onTodayClick: function(t) {
			var n;
			if (t) {
				n = t;
			} else {
				n = new Date(new Date().toDateString());
			}
			if (n < this.calFromRange || this.calToRange < n) {
				this.getAppointmentList();
				this.bTodayClicked = true;
			} else {
				this.oCal.fireTapOnDate({
					didSelect: true,
					date: n
				});
			}
			this.filterDate = n;
			this.calendarType = 'D';
			this.getAppointmentList();
		},
		onDisplayMonth: function(e) {
			this.oCal.setMonthsPerRow(1);
			this.oCal.setWeeksPerRow(1);
			this.oCal.setSingleRow(false);
			this.oCal.setVisible(true);
			this.calendarType = "M";
			this.oCal.setSwipeToNavigate(true);
			this.oCal.unselectAllDates();
		},
		onDisplayDay: function(e) {
			this.oCal.setMonthsPerRow(1);
			this.oCal.setWeeksPerRow(1);
			this.oCal.setSingleRow(true);
			this.oCal.setVisible(true);
			this.calendarType = "D";
			this.oCal.setSwipeToNavigate(true);
			this.oCal.unselectAllDates();
		},
		onDisplayWeek: function(e) {
			this.oCal.setMonthsPerRow(1);
			this.oCal.setWeeksPerRow(1);
			this.oCal.setSingleRow(true);
			this.oCal.setVisible(true);
			this.calendarType = "W";
			this.oCal.setSwipeToNavigate(true);
			this.oCal.unselectAllDates();
		},
		getDateParameterfromDate: function(d) {
			var D = d.getDate().toString();
			D = (D.length === 1) ? "0" + D : D;
			var m = d.getMonth() + 1;
			m = m.toString();
			m = (m.length === 1) ? "0" + m : m;
			var y = d.getFullYear();
			var s = "" + y + m + D;
			return s;
		},
		_buttonToday: function() {
			this.oCal.setCurrentDate(new Date());
			this.oCal.unselectAllDates();
			this.oCal.toggleDatesSelection([new Date()], true);
			this.onTodayClick();
		},
		getAttendanceDetail: function(e) {
			if (this.byId("yearDD").getSelectedKey() === "" && this.byId("termDD").getSelectedKey() === "") {
				MessageToast.show("Please select either Year or Term");
			} else {
				this.getAttendanceDetails();
			}
		},
		getAttendanceDetails: function(e) {
			var year = [],
				term = [],
				studentId = [];

			year.push(new sap.ui.model.Filter("AcadYear", sap.ui.model.FilterOperator.EQ, that.byId("yearDD").getSelectedKey()));
			term.push(new sap.ui.model.Filter("Term", sap.ui.model.FilterOperator.EQ, that.byId("termDD").getSelectedKey()));
			studentId.push(new sap.ui.model.Filter("Stobjid", sap.ui.model.FilterOperator.EQ, this.stdObjId));

			that.filterYear = new sap.ui.model.Filter({
				filters: year,
				and: true
			});
			that.filteterm = new sap.ui.model.Filter({
				filters: term,
				and: true
			});
			that.studentId = new sap.ui.model.Filter({
				filters: studentId,
				and: true
			});
			var filter = new sap.ui.model.Filter({
				filters: [that.studentId, that.filterYear, that.filteterm],
				and: true
			});
			that.oDataModel.read("/AbsentListSet", {
				filters: [filter],
				success: function(oData, response) {

					var dataModel = new J(),
						late = 0,
						absent = 0,
						approve = 0;
					dataModel.setData({
						"Value": oData.results
					});
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].AbsenceFlag === true) {
							absent = absent + 1;
						}
						if (oData.results[i].LateFlag === true) {
							late = late + 1;
						}
						if (oData.results[i].ApprovedLeave === true) {
							approve = approve + 1;
						}
					}
					that.byId("late").setText(late);
					that.byId("absent").setText(absent);
					that.byId("approve").setText(approve);
					that.getView().setModel(dataModel, "AttDetails");
					that.dropdownData();
				}
			});
		},
		dropdownData: function(e) {
			var filter = new sap.ui.model.Filter({
				filters: [that.studentId],
				and: true
			});
			that.oDataModel.read("/YearListSet", {
				filters: [filter],
				success: function(oData, response) {

					var dataModel = new J();
					dataModel.setData({
						"Value": oData.results
					});
					that.getView().setModel(dataModel, "Year");

					that.oDataModel.read("/TermListSet", {
						filters: [filter],
						success: function(oData, response) {

							var dataModel1 = new J();
							dataModel1.setData({
								"Value": oData.results
							});
							that.getView().setModel(dataModel1, "Term");

						}
					});
				}
			});
		},
		getAssignmentDetail: function(e) {
			if (this.byId("yearDDAssignment").getSelectedKey() === "" || this.byId("termDDAssignment").getSelectedKey() === "") {
				MessageToast.show("Please select Year and Term");
			} else {
				this.getAssignmentDetails();
			}
		},
		getAssignmentDetails: function(e) {
			var year = [],
				term = [],
				studentId = [];

			year.push(new sap.ui.model.Filter("AcadYear", sap.ui.model.FilterOperator.EQ, that.byId("yearDDAssignment").getSelectedKey()));
			term.push(new sap.ui.model.Filter("Term", sap.ui.model.FilterOperator.EQ, that.byId("termDDAssignment").getSelectedKey()));
			studentId.push(new sap.ui.model.Filter("Stobjid", sap.ui.model.FilterOperator.EQ, this.stdObjId));

			that.filterYear = new sap.ui.model.Filter({
				filters: year,
				and: true
			});
			that.filteterm = new sap.ui.model.Filter({
				filters: term,
				and: true
			});
			that.studentId = new sap.ui.model.Filter({
				filters: studentId,
				and: true
			});
			var filter = new sap.ui.model.Filter({
				filters: [that.studentId, that.filterYear, that.filteterm],
				and: true
			});
			that.oDataModel.read("/AssignmentListSet", {
				filters: [filter],
				success: function(oData, response) {

					var dataModel = new J();
					dataModel.setData({
						"Value": oData.results
					});
					that.getView().setModel(dataModel, "AssignmentDetails");
					//	that.dropdownAssignmentData();
				}
			});
		},
		dropdownAssignmentData: function(e) {
			var ddstudentId = [];
			ddstudentId.push(new sap.ui.model.Filter("Stobjid", sap.ui.model.FilterOperator.EQ, this.stdObjId));
			var filterstudentId = new sap.ui.model.Filter({
				filters: ddstudentId,
				and: true
			});
			var filter = new sap.ui.model.Filter({
				filters: [filterstudentId],
				and: true
			});
			that.oDataModel.read("/YearListSet", {
				filters: [filter],
				success: function(oData, response) {

					var dataModel = new J();
				/*	if (oData.results.length > 0) {
						oData.results[0].yearDesc = "";
					}*/
					dataModel.setData({
						"Value": oData.results
					});
					that.getView().setModel(dataModel, "YearAssignment");

					that.oDataModel.read("/TermListSet", {
						filters: [filter],
						success: function(oData, response) {
							var dataModel1 = new J();
							if (oData.results.length > 0) {
								oData.results[0].TermDesc = "";
							}
							dataModel1.setData({
								"Value": oData.results
							});
							that.getView().setModel(dataModel1, "TermAssignment");
							that.byId("yearDDAssignment").setSelectedKey("");
							that.byId("termDDAssignment").setSelectedKey("");
							that.getAssignmentDetails();
							/*if(that.byId("AssignmentTable").getModel("AssignmentDetails"))
				            {
				            that.byId("AssignmentTable").getModel("AssignmentDetails").setData('');
			             	that.byId("AssignmentTable").getModel("AssignmentDetails").refresh();
				            }*/
						}
					});
				}
			});
		},
		_onObjectMatched: function(e) {
            // sap.ui.core.BusyIndicator.hide();
			/*setTimeout(function() {
				sap.ui.core.BusyIndicator.hide();
			}, 2000);*/
			var t = this;
			this.byId("btnWeek").setVisible(false);
			this.byId("btnMonth").setVisible(false);
			this.byId("btnToday").setVisible(false);
			if (this.byId("iconTabBar"))
				this.byId("iconTabBar").setSelectedKey("Details");
			this.addressList = new sap.ui.model.json.JSONModel();
			this.refresh = "true";
			this.sSave = "";
			if (e.getParameter("arguments") && e.getParameter("arguments").navBack !== "StudentOverview") {
				this.stdId = e.getParameter("arguments").objectId;
				this.stdObjId = e.getParameter("arguments").prgmId;
				this.sUrl = "/sap/opu/odata/sap/ZPIQ_STUDENT_PERSONAL_DETAILS_SRV/";
				var oDataModel = new sap.ui.model.odata.v2.ODataModel(that.sUrl, {
					json: true,
					loadMetadataAsync: true
				});
				var p = {
					context: null,
					urlParameters: {
						$expand: "AddressDetailSet,RelationsListSet,PassportVisaBankCitizenshipDetails,HealthDisabilityDetails,VisaListSet"
					},
					async: true,
					sorters: null,
					success: function(r) {

						t.getView().setBusy(false);
						t.response = r;
						var o = new sap.ui.model.json.JSONModel();
						o.setData(r);
						t.byId("ObjectPageLayout").setModel(o);
						var A = r.AddressDetailSet;
						var b = new sap.ui.model.json.JSONModel();
						for (var k = 0; k < A.results.length; k++) {
							var c = A.results[k].AddressDescription.split("/");
							A.results[k].streetNum = c[0];
							//	A.results[k].pinAdd = c[1];
							A.results[k].pinAdd = A.results[k].PostlCod1 + " " + A.results[k].City;
						}
						b.setData(A);
						//t.byId("idAddObjPageSubSec").destroyBlocks();
						t.byId("idAddObjPageSubSec").setModel(b, "oResModel");
						t.addressList.setData(A);
						var v = r.VisaListSet;
						var V = new sap.ui.model.json.JSONModel();
						V.setData(v);
						t.byId("idVisaSectn").setModel(V, "oVisaModel");
						var R = r.RelationsListSet;
						var d = new sap.ui.model.json.JSONModel();
						d.setData(R);
						t.byId("idRelSectn").setModel(d, "oRelationModel");
						var h = r.HealthDisabilityDetails;
						var H = new sap.ui.model.json.JSONModel();
						H.setData(h);
						t.byId("idHealthSectn").setModel(H);
						t.sInsNum = h.HealthIndex;
						t.sInsType = h.InsuranceTypeKey;
						t.sChallType = h.ChallType;
						t.sChallGroup = h.ChallGrp;
						if (h.EnableEdit !== "X" && h.DisabilityEdit !== "X") {
							t.byId("idHealthSectn").setVisible(false);
						} else if (h.EnableEdit !== "X") {
							t.byId("idInsDetails").setVisible(false);
						} else if (h.DisabilityEdit !== "X") {
							t.byId("idDisability").setVisible(false);
						}
						var g = r.PassportVisaBankCitizenshipDetails;
						var j = new sap.ui.model.json.JSONModel();
						j.setData(g);
						t.byId("idPersnlSectn").setModel(j);
						/*	var P = r.ProgramOfStudy.split(";");
							var l = t.byId("idPrgmStdy");
							l.destroyContent();
							for (var i = 0; i < P.length; i++) {
								var O = new sap.m.ObjectStatus({
									text: P[i]
								});
								l.addContent(O);
							}
							if (!sap.ui.Device.system.desktop) {
								t.byId("idPDFButton").setVisible(false);
							}*/
						//	sap.ui.core.BusyIndicator.hide();
					},
					error: function(b) {
					//	sap.ui.core.BusyIndicator.hide();
					}
				};
				oDataModel.read("/HeaderDetailsSet(StudentObjid='" + this.stdObjId + "')", p);
			}

		}

	});

});