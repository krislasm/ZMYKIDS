/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.ExpansibleFeedListItem");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("swa.mykids.controller.AppointmentDetail", {
	createdFromAccounts: false,
	onInit: function() {
		this.ocal = '';
		this.oModel = this.oApplicationFacade.getODataModel();
		this.getView().setModel(this.oModel);
		this.oBundle = this.oApplicationFacade.getResourceBundle();
		this.oRouter.attachRouteMatched(function(e) {
			if (e.getParameter("name") === "detail") {
				var M = e.getParameter("arguments").oModId;
				var E = e.getParameter("arguments").oEvtId;
				var a = e.getParameter("arguments").oEvtDate;
				var t = this;
				this.ocal = e.getParameter("arguments").ocal;
				var c = "/EventDetailSet(ModuleId='" + M + "',EventId='" + E + "',EventDate=datetime'" + a + "')";
				this.oModel.createBindingContext(c, function(C) {
					t.getView().setBindingContext(C);
					t.onDataReceived();
				}, true);
			}
		}, this);
	},
	onDataReceived: function() {
		var a = this.getView().getBindingContext().getObject().Attendees;
		var A = a.split(";");
		var r = [];
		var i;
		for (i = 0; i < A.length - 1; i++) {
			var t = {
				"oInsName": A[i]
			};
			r.push(t);
		}
		var o = [];
		var b = [];
		if (r.length <= 10) {
			var m = new sap.ui.model.json.JSONModel();
			m.setData({
				"Attnds": r
			});
			this.byId('attendsId').setModel(m, 'AddStud');
			this.byId('attendsId1').setVisible(false);
		} else {
			this.byId('attendsId1').setVisible(true);
			for (i = 0; i <= Math.round((r.length / 2) - 1); i++) {
				o.push(r[i]);
			}
			var m = new sap.ui.model.json.JSONModel();
			m.setData({
				"Attnds": o
			});
			this.byId('attendsId').setModel(m, 'AddStud');
			for (i = Math.round((r.length / 2)); i < r.length; i++) {
				b.push(r[i]);
			}
			var M = new sap.ui.model.json.JSONModel();
			M.setData({
				"Attnds": b
			});
			this.byId('attendsId1').setModel(M, 'AddStud');
		}
		var s = this.getView().getBindingContext().getObject().Status;
		if (s) {
			this.byId('statusBtnId').setVisible(false);
		} else {
			this.byId('statusBtnId').setVisible(true);
		}
	},
	onBack: function() {
		var d = this.getView().getBindingContext().getObject().EventDate;
		var D = d.toISOString();
		if (this.ocal == 'W') {
			this.oRouter.navTo("week", {
				Date: D
			}, true);
		} else {
			this.oRouter.navTo("month", {
				Date: D
			}, true);
		}
	},
	onInsClick: function(e) {
		var c = e.getSource();
		jQuery.sap.require("sap.ca.ui.quickoverview.Quickoverview");
		var s = "publicservices.her.mytimetable.fragments.Employee";
		var i = e.oSource.getBindingContext().getObject().ContactId;
		if (i != undefined) {
			var b = jQuery.proxy(function(o, S) {
				o.bindElement("/ContactDetailSet('" + i + "')");
			}, this);
			var q = {
				title: this.oBundle.getText("PROFESSOR"),
				headerTitle: "{Name}",
				headerSubTitle: "{Designation}\n{Department}",
				subViewName: s,
				headerImgURL: "{PhotoUri}",
				oModel: this.oApplicationFacade.getODataModel(),
				afterQvConfigured: b,
				popoverHeight: '32em',
			};
			var Q = new sap.ca.ui.quickoverview.Quickoverview(q);
			Q.openBy(c);
		}
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
	onStatusClick: function(e) {
		if (sap.ushell.Container) {
			var b = this.getView().getBindingContext().getObject();
			var s = b.StatusInd;
			var a = b.AcademicSession;
			var A = b.AcademicYear;
			var p = b.ProgramType;
			var P = b.ProgramOfStudyID;
			var c = b.ModuleId;
			var C = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (s) {
				C.toExternal({
					target: {
						semanticObject: "AcademicCourse",
						action: "register"
					},
					params: {
						CourseId: c,
						ProgramStudyId: P,
						ProgType: p,
						AcademicSession: a,
						AcademicYear: A,
						TileType: 'NAV'
					}
				});
			} else {
				C.toExternal({
					target: {
						semanticObject: "CompetencyEvidence",
						action: "display"
					},
					params: {
						CourseId: c,
						ProgramStudyId: P,
						ProgType: p,
						AcademicSession: a,
						AcademicYear: A,
						TileType: 'NAV'
					}
				});
			}
		}
	}
});