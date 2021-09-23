function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "./$$_lazy_route_resource lazy recursive": function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./src/app/app-routing.module.ts": function srcAppAppRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
      return AppRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _pages_player_player_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./pages/player/player.component */
    "./src/app/pages/player/player.component.ts");
    /* harmony import */


    var _pages_central_central_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./pages/central/central.component */
    "./src/app/pages/central/central.component.ts");
    /* harmony import */


    var _pages_host_host_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./pages/host/host.component */
    "./src/app/pages/host/host.component.ts");

    var routes = [{
      path: ':show/:division/:id',
      component: _pages_player_player_component__WEBPACK_IMPORTED_MODULE_2__["PlayerComponent"]
    }, {
      path: ':show/:division',
      component: _pages_host_host_component__WEBPACK_IMPORTED_MODULE_4__["HostComponent"]
    }, {
      path: '',
      component: _pages_central_central_component__WEBPACK_IMPORTED_MODULE_3__["CentralComponent"]
    }];

    var AppRoutingModule = function AppRoutingModule() {
      _classCallCheck(this, AppRoutingModule);
    };

    AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
    AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function AppRoutingModule_Factory(t) {
        return new (t || AppRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/app.component.ts": function srcAppAppComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
      return AppComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var AppComponent = function AppComponent() {
      _classCallCheck(this, AppComponent);

      this.title = 'new-societies';
    };

    AppComponent.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)();
    };

    AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 1,
      vars: 0,
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
        }
      },
      directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.scss']
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/app.module.ts": function srcAppAppModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
    });
    /* harmony import */


    var _angular_fire__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/fire */
    "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire.js");
    /* harmony import */


    var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./app.component */
    "./src/app/app.component.ts");
    /* harmony import */


    var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./app-routing.module */
    "./src/app/app-routing.module.ts");
    /* harmony import */


    var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/platform-browser/animations */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/animations.js");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
    /* harmony import */


    var _components_components_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./components/components.module */
    "./src/app/components/components.module.ts");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @fortawesome/angular-fontawesome */
    "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _pages_pages_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ./pages/pages.module */
    "./src/app/pages/pages.module.ts");

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__["AppComponent"]]
    });
    AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      factory: function AppModule_Factory(t) {
        return new (t || AppModule)();
      },
      providers: [],
      imports: [[_angular_fire__WEBPACK_IMPORTED_MODULE_0__["AngularFireModule"].initializeApp(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].firebase), _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["BrowserModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"], _components_components_module__WEBPACK_IMPORTED_MODULE_5__["ComponentsModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_7__["FontAwesomeModule"], _pages_pages_module__WEBPACK_IMPORTED_MODULE_9__["PagesModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppModule, {
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__["AppComponent"]],
        imports: [_angular_fire__WEBPACK_IMPORTED_MODULE_0__["AngularFireModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["BrowserModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"], _components_components_module__WEBPACK_IMPORTED_MODULE_5__["ComponentsModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_7__["FontAwesomeModule"], _pages_pages_module__WEBPACK_IMPORTED_MODULE_9__["PagesModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_8__["NgModule"],
        args: [{
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__["AppComponent"]],
          imports: [_angular_fire__WEBPACK_IMPORTED_MODULE_0__["AngularFireModule"].initializeApp(_environments_environment__WEBPACK_IMPORTED_MODULE_6__["environment"].firebase), _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["BrowserModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"], _components_components_module__WEBPACK_IMPORTED_MODULE_5__["ComponentsModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_7__["FontAwesomeModule"], _pages_pages_module__WEBPACK_IMPORTED_MODULE_9__["PagesModule"]],
          providers: [],
          bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__["AppComponent"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/components/announcement/announcement.component.ts": function srcAppComponentsAnnouncementAnnouncementComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AnnouncementComponent", function () {
      return AnnouncementComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var AnnouncementComponent = function AnnouncementComponent() {
      _classCallCheck(this, AnnouncementComponent);
    };

    AnnouncementComponent.ɵfac = function AnnouncementComponent_Factory(t) {
      return new (t || AnnouncementComponent)();
    };

    AnnouncementComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AnnouncementComponent,
      selectors: [["app-announcement"]],
      hostVars: 2,
      hostBindings: function AnnouncementComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("announcement", true);
        }
      },
      decls: 0,
      vars: 0,
      template: function AnnouncementComponent_Template(rf, ctx) {},
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvYW5ub3VuY2VtZW50L2Fubm91bmNlbWVudC5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AnnouncementComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-announcement',
          templateUrl: './announcement.component.html',
          styleUrls: ['./announcement.component.scss'],
          host: {
            '[class.announcement]': 'true'
          }
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/components/card/card.component.ts": function srcAppComponentsCardCardComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "CardComponent", function () {
      return CardComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var _c0 = [[["", "back", ""]], [["", "front", ""]]];
    var _c1 = ["[back]", "[front]"];

    var CardComponent = /*#__PURE__*/function () {
      function CardComponent() {
        _classCallCheck(this, CardComponent);

        this.animate = false;
        this.sideChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.mark = null;
        this.xray = false;
        this.width = 50;
        this.height = 100;
      }

      _createClass(CardComponent, [{
        key: "side",
        get: function get() {
          return this._side;
        },
        set: function set(val) {
          if (this._side && this.animate === false && val !== this._side) {
            this.animate = true;
          }

          this._side = val;

          if (this.animate) {
            this.sideChange.emit(val);
          }
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          var _a;

          this.side = (_a = this.side) !== null && _a !== void 0 ? _a : 'front';
        }
      }]);

      return CardComponent;
    }();

    CardComponent.ɵfac = function CardComponent_Factory(t) {
      return new (t || CardComponent)();
    };

    CardComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CardComponent,
      selectors: [["card"]],
      hostVars: 11,
      hostBindings: function CardComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("data-mark", ctx.mark !== ctx.playerId ? ctx.mark : undefined);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("width", ctx.width, "px")("height", ctx.height, "px");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("card", true)("animate", ctx.animate)("mark", ctx.mark !== null && ctx.mark !== undefined);
        }
      },
      inputs: {
        mark: "mark",
        xray: "xray",
        playerId: "playerId",
        side: "side",
        width: "width",
        height: "height"
      },
      outputs: {
        sideChange: "sideChange"
      },
      ngContentSelectors: _c1,
      decls: 4,
      vars: 8,
      consts: [[1, "face", "back"], [1, "face", "front"]],
      template: function CardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"](_c0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](3, 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("up", ctx.side == "back")("down", ctx.side == "front");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("up", ctx.side == "front")("down", ctx.side == "back");
        }
      },
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvY2FyZC9jYXJkLmNvbXBvbmVudC5zY3NzIn0= */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CardComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'card',
          templateUrl: 'card.component.html',
          styleUrls: ['card.component.scss'],
          host: {
            '[class.card]': 'true',
            '[class.animate]': 'animate',
            '[style.width.px]': 'width',
            '[style.height.px]': 'height',
            '[class.mark]': 'mark !== null && mark !== undefined',
            '[attr.data-mark]': 'mark !== playerId ? mark : undefined'
          }
        }]
      }], function () {
        return [];
      }, {
        sideChange: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        mark: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        xray: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        playerId: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        side: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        width: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        height: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/components/components.module.ts": function srcAppComponentsComponentsModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ComponentsModule", function () {
      return ComponentsModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _announcement_announcement_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./announcement/announcement.component */
    "./src/app/components/announcement/announcement.component.ts");
    /* harmony import */


    var _card_card_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./card/card.component */
    "./src/app/components/card/card.component.ts");
    /* harmony import */


    var _dialog_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./dialog/dialog.component */
    "./src/app/components/dialog/dialog.component.ts");
    /* harmony import */


    var _harvest_harvest_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./harvest/harvest.component */
    "./src/app/components/harvest/harvest.component.ts");
    /* harmony import */


    var _player_hands_player_hands_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./player-hands/player-hands.component */
    "./src/app/components/player-hands/player-hands.component.ts");
    /* harmony import */


    var _scorecard_scorecard_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./scorecard/scorecard.component */
    "./src/app/components/scorecard/scorecard.component.ts");
    /* harmony import */


    var _society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./society-summary/society-summary.component */
    "./src/app/components/society-summary/society-summary.component.ts");
    /* harmony import */


    var _vote_vote_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./vote/vote.component */
    "./src/app/components/vote/vote.component.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @angular/material/bottom-sheet */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
    /* harmony import */


    var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! @fortawesome/angular-fontawesome */
    "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");
    /* harmony import */


    var _player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! ./player-deck/player-deck.component */
    "./src/app/components/player-deck/player-deck.component.ts");
    /* harmony import */


    var _land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! ./land-grid/land-grid.component */
    "./src/app/components/land-grid/land-grid.component.ts");

    var components = [_announcement_announcement_component__WEBPACK_IMPORTED_MODULE_1__["AnnouncementComponent"], _card_card_component__WEBPACK_IMPORTED_MODULE_2__["CardComponent"], _dialog_dialog_component__WEBPACK_IMPORTED_MODULE_3__["DialogComponent"], _harvest_harvest_component__WEBPACK_IMPORTED_MODULE_4__["HarvestComponent"], _land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_13__["LandGridComponent"], _player_hands_player_hands_component__WEBPACK_IMPORTED_MODULE_5__["PlayerHandsComponent"], _player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_12__["PlayerDeckComponent"], _scorecard_scorecard_component__WEBPACK_IMPORTED_MODULE_6__["ScorecardComponent"], _society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_7__["SocietySummaryComponent"], _vote_vote_component__WEBPACK_IMPORTED_MODULE_8__["VoteComponent"]];
    var ngMaterial = [_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_10__["MatBottomSheetModule"]];

    var ComponentsModule = function ComponentsModule() {
      _classCallCheck(this, ComponentsModule);
    };

    ComponentsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: ComponentsModule
    });
    ComponentsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function ComponentsModule_Factory(t) {
        return new (t || ComponentsModule)();
      },
      imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_9__["CommonModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_11__["FontAwesomeModule"]].concat(ngMaterial)]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](ComponentsModule, {
        declarations: [_announcement_announcement_component__WEBPACK_IMPORTED_MODULE_1__["AnnouncementComponent"], _card_card_component__WEBPACK_IMPORTED_MODULE_2__["CardComponent"], _dialog_dialog_component__WEBPACK_IMPORTED_MODULE_3__["DialogComponent"], _harvest_harvest_component__WEBPACK_IMPORTED_MODULE_4__["HarvestComponent"], _land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_13__["LandGridComponent"], _player_hands_player_hands_component__WEBPACK_IMPORTED_MODULE_5__["PlayerHandsComponent"], _player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_12__["PlayerDeckComponent"], _scorecard_scorecard_component__WEBPACK_IMPORTED_MODULE_6__["ScorecardComponent"], _society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_7__["SocietySummaryComponent"], _vote_vote_component__WEBPACK_IMPORTED_MODULE_8__["VoteComponent"]],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__["CommonModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_11__["FontAwesomeModule"], _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_10__["MatBottomSheetModule"]],
        exports: [_announcement_announcement_component__WEBPACK_IMPORTED_MODULE_1__["AnnouncementComponent"], _card_card_component__WEBPACK_IMPORTED_MODULE_2__["CardComponent"], _dialog_dialog_component__WEBPACK_IMPORTED_MODULE_3__["DialogComponent"], _harvest_harvest_component__WEBPACK_IMPORTED_MODULE_4__["HarvestComponent"], _land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_13__["LandGridComponent"], _player_hands_player_hands_component__WEBPACK_IMPORTED_MODULE_5__["PlayerHandsComponent"], _player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_12__["PlayerDeckComponent"], _scorecard_scorecard_component__WEBPACK_IMPORTED_MODULE_6__["ScorecardComponent"], _society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_7__["SocietySummaryComponent"], _vote_vote_component__WEBPACK_IMPORTED_MODULE_8__["VoteComponent"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ComponentsModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__["CommonModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_11__["FontAwesomeModule"]].concat(ngMaterial),
          declarations: [].concat(components),
          exports: [].concat(components)
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/components/dialog/dialog.component.ts": function srcAppComponentsDialogDialogComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DialogComponent", function () {
      return DialogComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var DialogComponent = function DialogComponent() {
      _classCallCheck(this, DialogComponent);
    };

    DialogComponent.ɵfac = function DialogComponent_Factory(t) {
      return new (t || DialogComponent)();
    };

    DialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: DialogComponent,
      selectors: [["app-dialog"]],
      hostVars: 2,
      hostBindings: function DialogComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("dialog", true);
        }
      },
      decls: 0,
      vars: 0,
      template: function DialogComponent_Template(rf, ctx) {},
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvZGlhbG9nL2RpYWxvZy5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](DialogComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-dialog',
          templateUrl: './dialog.component.html',
          styleUrls: ['./dialog.component.scss'],
          host: {
            '[class.dialog]': 'true'
          }
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/components/harvest/harvest.component.ts": function srcAppComponentsHarvestHarvestComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HarvestComponent", function () {
      return HarvestComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! lodash */
    "./node_modules/lodash/lodash.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @fortawesome/free-solid-svg-icons */
    "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
    /* harmony import */


    var src_app_utilties__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! src/app/utilties */
    "./src/app/utilties.ts");
    /* harmony import */


    var src_app_interfaces__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! src/app/interfaces */
    "./src/app/interfaces.ts");
    /* harmony import */


    var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/material/bottom-sheet */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _card_card_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ../card/card.component */
    "./src/app/components/card/card.component.ts");
    /* harmony import */


    var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @fortawesome/angular-fontawesome */
    "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");

    function HarvestComponent_div_1_div_1_div_3_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var card_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("one", card_r6.value === 1)("two", card_r6.value === 2)("three", card_r6.value === 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", card_r6.value, " ");
      }
    }

    function HarvestComponent_div_1_div_1_div_4_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 13);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 14);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    }

    function HarvestComponent_div_1_div_1_Template(rf, ctx) {
      if (rf & 1) {
        var _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "card", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HarvestComponent_div_1_div_1_Template_card_click_1_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);

          var i_r7 = ctx.index;

          var r_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index;

          var ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          var _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](5);

          return ctx_r11.selectTile(r_r4, i_r7, _r1);
        })("sideChange", function HarvestComponent_div_1_div_1_Template_card_sideChange_1_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);

          var card_r6 = ctx.$implicit;
          return card_r6.side = $event;
        })("sideChange", function HarvestComponent_div_1_div_1_Template_card_sideChange_1_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);

          var i_r7 = ctx.index;

          var r_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index;

          var ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r15.process(r_r4, i_r7);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, HarvestComponent_div_1_div_1_div_3_Template, 2, 7, "div", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, HarvestComponent_div_1_div_1_div_4_Template, 2, 0, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "div", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var card_r6 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("contaminated", card_r6.contaminated == true)("empty", card_r6.value === 0 - 1)("owned", card_r6.owner !== null);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("data-badge", card_r6.owner ? card_r6.owner.name : null)("data-division", card_r6.owner ? card_r6.owner.division : null);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("owned", true)("disabled", card_r6.value == 0 - 1 || card_r6.contaminated == true);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("side", card_r6.side)("mark", card_r6.mark);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", card_r6.value > 0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", card_r6.value === 0);
      }
    }

    function HarvestComponent_div_1_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, HarvestComponent_div_1_div_1_Template, 6, 16, "div", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var row_r3 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", row_r3);
      }
    }

    function HarvestComponent_ng_template_4_div_2_Template(rf, ctx) {
      if (rf & 1) {
        var _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 17);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HarvestComponent_ng_template_4_div_2_Template_div_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r20);

          var ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r19.explore();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "fa-icon", 18);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Explore (e) ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", ctx_r17.exploreIcon);
      }
    }

    function HarvestComponent_ng_template_4_div_3_Template(rf, ctx) {
      if (rf & 1) {
        var _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 17);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HarvestComponent_ng_template_4_div_3_Template_div_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r22);

          var ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r21.gather();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "fa-icon", 18);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Gather (g) ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", ctx_r18.gatherIcon);
      }
    }

    function HarvestComponent_ng_template_4_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 15);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, HarvestComponent_ng_template_4_div_2_Template, 3, 1, "div", 16);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, HarvestComponent_ng_template_4_div_3_Template, 3, 1, "div", 16);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.message, " ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.status) === "explorable");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.status) === "explored" || (ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.status) === "explorable");
      }
    }

    var MAX_HARVEST = 49;
    var KEY_CODE = {
      e: 69,
      g: 71
    };

    var HarvestComponent = /*#__PURE__*/function () {
      function HarvestComponent(_bottomSheet) {
        _classCallCheck(this, HarvestComponent);

        this._bottomSheet = _bottomSheet;
        this.landGrid = []; // ICONS

        this.exploreIcon = _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faEye"];
        this.gatherIcon = _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_4__["faShoppingBag"];
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.landTiles = [];
        this.gatherResource = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.landGrid = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_5__["shuffle"])(this.landGrid);
      }

      _createClass(HarvestComponent, [{
        key: "keyEvent",
        value: function keyEvent(event) {
          var _this$selectedCardCoo = _slicedToArray(this.selectedCardCoords, 2),
              r = _this$selectedCardCoo[0],
              i = _this$selectedCardCoo[1];

          if (event.keyCode === KEY_CODE.e) {
            this.explore();
          } else if (event.keyCode === KEY_CODE.g) {
            this.gather();
          }
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this = this;

          var slots = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["range"])(MAX_HARVEST);
          this.landTiles = slots.map(function () {
            return {
              value: Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_5__["getRandomInt"])(1, 3),
              owner: _this.getOwner(),
              side: 'back',
              contaminated: false,
              mark: null
            };
          });
          this.newHarvest();
        }
      }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
          this.destroy$.next(true);
        }
      }, {
        key: "getResourceStatus",
        value: function getResourceStatus() {
          var card = this.getSelectedCard();

          if (!card) {
            return;
          }

          if (card.side === 'back') {
            return {
              status: 'explorable'
            };
          } else if (card.value == 0) {
            return {
              status: 'contaminated',
              message: 'This land is contaminated'
            };
          } else if (card.owner) {
            var ownedBy = card.owner.division == card.owner.name ? 'a member of the ' + card.owner.division + ' division' : 'player ' + card.owner.name;
            return {
              status: 'owned',
              message: 'This land is owned by ' + ownedBy
            };
          }

          return {
            status: 'explored'
          };
        }
      }, {
        key: "getSelectedCard",
        value: function getSelectedCard() {
          if (this.selectedCardCoords) {
            var _this$selectedCardCoo2 = _slicedToArray(this.selectedCardCoords, 2),
                r = _this$selectedCardCoo2[0],
                i = _this$selectedCardCoo2[1];

            return this.landGrid[r][i];
          }

          return null;
        }
      }, {
        key: "newHarvest",
        value: function newHarvest() {
          var _this2 = this;

          this.landGrid = this.generateHarvest(13, 2);
          setTimeout(function () {
            _this2.gatherOwnedLand();
          }, 500);
        }
      }, {
        key: "getOwner",
        value: function getOwner() {
          var owned = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_5__["getRandomInt"])(0, 3) == 0;
          var div = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_5__["getRandomInt"])(0, 1) == 0 ? 'NE' : 'W';
          return owned ? {
            name: div,
            division: div
          } : null;
        }
      }, {
        key: "resetLandTiles",
        value: function resetLandTiles() {
          this.landTiles = _toConsumableArray(this.landTiles.map(function (tile) {
            return Object.assign(Object.assign({}, tile), {
              side: 'back',
              value: Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_5__["getRandomInt"])(1, 3),
              contaminated: false,
              mark: null
            });
          }));
        }
      }, {
        key: "generateHarvest",
        value: function generateHarvest(totalCards, totalContaminents) {
          var _this3 = this;

          // Start with a range of integers
          var slots = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["range"])(MAX_HARVEST);
          this.resetLandTiles(); // Generate indexes for removing tiles

          var removals = this.pluck(slots, MAX_HARVEST - totalCards);
          removals.forEach(function (i) {
            _this3.landTiles[i].value = src_app_interfaces__WEBPACK_IMPORTED_MODULE_6__["LandCardValues"].EMPTY;
          }); // Generate harvest (selectable card tiles)

          var harvest = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["difference"])(slots, removals); // Add contaminants

          var contaminents = this.pluck(harvest, totalContaminents);
          contaminents.forEach(function (i) {
            _this3.landTiles[i].value = src_app_interfaces__WEBPACK_IMPORTED_MODULE_6__["LandCardValues"].CONTAM;
          }); // Build matrix (2D array)

          return Object(lodash__WEBPACK_IMPORTED_MODULE_1__["chunk"])(this.landTiles, 7);
        }
      }, {
        key: "gatherOwnedLand",
        value: function gatherOwnedLand() {
          var _this4 = this;

          this.landGrid.forEach(function (row, r) {
            row.forEach(function (card, i) {
              if (card.owner) {
                card.side = 'front';

                _this4.process(r, i);
              }
            });
          });
        }
      }, {
        key: "pluck",
        value: function pluck(array, remove) {
          var toRemove = [];

          while (toRemove.length < remove) {
            var value = array[Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_5__["getRandomInt"])(0, array.length - 1)];

            if (!Object(lodash__WEBPACK_IMPORTED_MODULE_1__["includes"])(toRemove, value)) {
              toRemove.push(value);
            }
          }

          return toRemove;
        }
      }, {
        key: "selectTile",
        value: function selectTile(r, i, sheetTemplate) {
          var _this5 = this;

          this.mark(r, i);
          this.landSelectSheet = this._bottomSheet.open(sheetTemplate);
          this.selectedResourceStatus = this.getResourceStatus();
          this.landSelectSheet.afterDismissed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(function () {
            if (_this5.selectedCardCoords) {
              _this5.clearSelection();
            }
          });
        }
      }, {
        key: "clearSelection",
        value: function clearSelection() {
          var _this$selectedCardCoo3 = _slicedToArray(this.selectedCardCoords, 2),
              r = _this$selectedCardCoo3[0],
              i = _this$selectedCardCoo3[1];

          this.landGrid[r][i].mark = null;
          this.selectedCardCoords = null;
        }
      }, {
        key: "mark",
        value: function mark(r, i) {
          if (this.selectedCardCoords) {
            this.clearSelection();
          }

          var card = this.landGrid[r][i];
          card.mark = card.mark ? null : 1;
          this.selectedCardCoords = [r, i];
        }
      }, {
        key: "explore",
        value: function explore() {
          if (this.selectedCardCoords) {
            var _this$selectedCardCoo4 = _slicedToArray(this.selectedCardCoords, 2),
                r = _this$selectedCardCoo4[0],
                i = _this$selectedCardCoo4[1];

            var card = this.landGrid[r][i];

            if (card.side === 'back' && card.value !== -1) {
              this.landGrid[r][i].side = 'front';
            }

            if (this.landSelectSheet) {
              this.landSelectSheet.dismiss();
            }

            this.clearSelection();
          }
        }
      }, {
        key: "gather",
        value: function gather() {
          if (this.selectedCardCoords && this.selectedResourceStatus) {
            var status = this.selectedResourceStatus.status;

            if (status === 'explorable' || status === 'explored') {
              console.log('do gather');

              var _this$selectedCardCoo5 = _slicedToArray(this.selectedCardCoords, 2),
                  r = _this$selectedCardCoo5[0],
                  i = _this$selectedCardCoo5[1];

              var card = this.landGrid[r][i];
              this.gatherResource.emit({
                value: card.value
              });
              this.landGrid[r][i].value = -1;
            }

            if (this.landSelectSheet) {
              this.landSelectSheet.dismiss();
            }

            this.clearSelection();
          }
        }
      }, {
        key: "process",
        value: function process(r, i) {
          var _a, _b, _c, _d; // A card value of 0 signifies a contaminant


          if (this.landGrid[r][i].value === src_app_interfaces__WEBPACK_IMPORTED_MODULE_6__["LandCardValues"].CONTAM) {
            var left = (_a = this.landGrid[r]) === null || _a === void 0 ? void 0 : _a[i - 1];
            var right = (_b = this.landGrid[r]) === null || _b === void 0 ? void 0 : _b[i + 1];
            var top = (_c = this.landGrid[r - 1]) === null || _c === void 0 ? void 0 : _c[i];
            var bottom = (_d = this.landGrid[r + 1]) === null || _d === void 0 ? void 0 : _d[i];
            setTimeout(function () {
              if (left && !left.owner) {
                left.contaminated = true;
              }

              if (right && !right.owner) {
                right.contaminated = true;
              }

              if (top && !top.owner) {
                top.contaminated = true;
              }

              if (bottom && !bottom.owner) {
                bottom.contaminated = true;
              }
            });
          }
        }
      }]);

      return HarvestComponent;
    }();

    HarvestComponent.ɵfac = function HarvestComponent_Factory(t) {
      return new (t || HarvestComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_7__["MatBottomSheet"]));
    };

    HarvestComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: HarvestComponent,
      selectors: [["app-harvest"]],
      hostVars: 2,
      hostBindings: function HarvestComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keyup", function HarvestComponent_keyup_HostBindingHandler($event) {
            return ctx.keyEvent($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveWindow"]);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("harvest", true);
        }
      },
      inputs: {
        player: "player",
        division: "division"
      },
      outputs: {
        gatherResource: "gatherResource"
      },
      decls: 6,
      vars: 1,
      consts: [[1, "harvest-cards"], ["class", "card-row", 4, "ngFor", "ngForOf"], [3, "click"], ["tileSelectSheet", ""], [1, "card-row"], ["class", "land-tile", 3, "contaminated", "empty", "owned", 4, "ngFor", "ngForOf"], [1, "land-tile"], ["width", "40", "height", "40", 3, "side", "mark", "click", "sideChange"], ["front", "", 1, "harvest-card"], ["class", "resource", 3, "one", "two", "three", 4, "ngIf"], ["class", "contamination", 4, "ngIf"], ["back", "", 1, "harvest-card", "back"], [1, "resource"], [1, "contamination"], ["src", "../assets/contamination.png"], [1, "action-sheet"], ["class", "large-action-button", 3, "click", 4, "ngIf"], [1, "large-action-button", 3, "click"], ["size", "lg", 3, "icon"]],
      template: function HarvestComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, HarvestComponent_div_1_Template, 2, 1, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "button", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HarvestComponent_Template_button_click_2_listener() {
            return ctx.newHarvest();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "New");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, HarvestComponent_ng_template_4_Template, 4, 3, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.landGrid);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], _card_card_component__WEBPACK_IMPORTED_MODULE_9__["CardComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_10__["FaIconComponent"]],
      styles: [".harvest-cards[_ngcontent-%COMP%] {\n  perspective: 50em;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  align-items: flex-start;\n}\n.harvest-cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%] {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.harvest-cards[_ngcontent-%COMP%]   .card-row[_ngcontent-%COMP%] {\n  display: flex;\n}\n.harvest-card[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  position: relative;\n}\n.harvest-card[_ngcontent-%COMP%]   .contamination[_ngcontent-%COMP%] {\n  background: tomato;\n  height: 100%;\n  display: flex;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.harvest-card[_ngcontent-%COMP%]   .contamination[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  padding: 4px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.harvest-card.back[_ngcontent-%COMP%] {\n  background: #fdd08a;\n}\n.harvest-card.back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  margin: 5px;\n}\n.harvest-card[_ngcontent-%COMP%]   .resource[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 22px;\n  height: 100%;\n}\n.land-tile[_ngcontent-%COMP%] {\n  position: relative;\n  display: block;\n  width: 40px;\n  height: 40px;\n  margin: 6px;\n  border-radius: 10px;\n  transition: background-color 1s ease;\n  transition-delay: 0.5s;\n  flex-shrink: 0;\n}\n.land-tile.empty[_ngcontent-%COMP%] {\n  background: #f1ede7;\n}\n.land-tile[_ngcontent-%COMP%]:not(.empty) {\n  background: transparent;\n}\n.land-tile.contaminated[_ngcontent-%COMP%] {\n  background-color: black;\n}\n.land-tile.owned[data-badge][_ngcontent-%COMP%]::after {\n  content: attr(data-badge);\n  position: absolute;\n  padding: 0 5px;\n  min-width: 10px;\n  border-radius: 5px;\n  box-shadow: -2px 2px;\n  font-weight: 900;\n  top: -10px;\n  right: -10px;\n  z-index: 10;\n}\n.land-tile.owned[data-badge][data-division=NE][_ngcontent-%COMP%]::after {\n  background: #adf1ad;\n}\n.land-tile.owned[data-badge][data-division=W][_ngcontent-%COMP%]::after {\n  background: #9ec8e2;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYW1tYWNraW5ub24vcHJvamVjdHMvbmV3c29jaWV0aWVzL3NyYy9hcHAvY29tcG9uZW50cy9oYXJ2ZXN0L2hhcnZlc3QuY29tcG9uZW50LnNjc3MiLCJzcmMvYXBwL2NvbXBvbmVudHMvaGFydmVzdC9oYXJ2ZXN0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsaUJBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxXQUFBO0VBQ0EsdUJBQUE7QUNDRjtBRENFO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0FDQ0o7QURFRTtFQUNFLGFBQUE7QUNBSjtBRElBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtBQ0RGO0FER0U7RUFDRSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsT0FBQTtBQ0RKO0FER0k7RUFDRSxZQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0FDRE47QURLRTtFQUNFLG1CQUFBO0FDSEo7QURLSTtFQUNFLFdBQUE7QUNITjtBRE9FO0VBQ0UsV0FBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0FDTEo7QURVQTtFQUNFLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLG1CQUFBO0VBQ0Esb0NBQUE7RUFDQSxzQkFBQTtFQUNBLGNBQUE7QUNQRjtBRFNFO0VBQ0UsbUJBQUE7QUNQSjtBRFVFO0VBQ0UsdUJBQUE7QUNSSjtBRFdFO0VBQ0UsdUJBQUE7QUNUSjtBRGFJO0VBQ0UseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0FDWE47QURjTTtFQUNFLG1CQUFBO0FDWlI7QURnQk07RUFDRSxtQkFBQTtBQ2RSIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9oYXJ2ZXN0L2hhcnZlc3QuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGFydmVzdC1jYXJkcyB7XG4gIHBlcnNwZWN0aXZlOiA1MGVtO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG5cbiAgLmNhcmQge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cblxuICAuY2FyZC1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gIH1cbn1cblxuLmhhcnZlc3QtY2FyZCB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7IFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gIC5jb250YW1pbmF0aW9uIHtcbiAgICBiYWNrZ3JvdW5kOiB0b21hdG87XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuXG4gICAgaW1nIHtcbiAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB9XG4gIH1cblxuICAmLmJhY2sge1xuICAgIGJhY2tncm91bmQ6ICNmZGQwOGE7XG5cbiAgICBpbWcge1xuICAgICAgbWFyZ2luOiA1cHg7XG4gICAgfVxuICB9XG5cbiAgLnJlc291cmNlIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmb250LXNpemU6IDIycHg7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICB9XG5cbn1cblxuLmxhbmQtdGlsZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgXG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xuICBtYXJnaW46IDZweDtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAxcyBlYXNlO1xuICB0cmFuc2l0aW9uLWRlbGF5OiAwLjVzO1xuICBmbGV4LXNocmluazogMDtcblxuICAmLmVtcHR5IHtcbiAgICBiYWNrZ3JvdW5kOiAjZjFlZGU3O1xuICB9XG5cbiAgJjpub3QoLmVtcHR5KSB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIH1cblxuICAmLmNvbnRhbWluYXRlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG4gIH1cblxuICAmLm93bmVkW2RhdGEtYmFkZ2VdIHtcbiAgICAmOjphZnRlciB7XG4gICAgICBjb250ZW50OiBhdHRyKGRhdGEtYmFkZ2UpO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgcGFkZGluZzogMCA1cHg7IFxuICAgICAgbWluLXdpZHRoOiAxMHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgYm94LXNoYWRvdzogLTJweCAycHg7XG4gICAgICBmb250LXdlaWdodDogOTAwO1xuICAgICAgdG9wOiAtMTBweDtcbiAgICAgIHJpZ2h0OiAtMTBweDtcbiAgICAgIHotaW5kZXg6IDEwO1xuICAgIH1cbiAgICAmW2RhdGEtZGl2aXNpb249TkVdIHtcbiAgICAgICY6OmFmdGVyIHtcbiAgICAgICAgYmFja2dyb3VuZDogI2FkZjFhZDtcbiAgICAgIH1cbiAgICB9XG4gICAgJltkYXRhLWRpdmlzaW9uPVddIHtcbiAgICAgICY6OmFmdGVyIHtcbiAgICAgICAgYmFja2dyb3VuZDogIzllYzhlMjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCIuaGFydmVzdC1jYXJkcyB7XG4gIHBlcnNwZWN0aXZlOiA1MGVtO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMTAwJTtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG59XG4uaGFydmVzdC1jYXJkcyAuY2FyZCB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbn1cbi5oYXJ2ZXN0LWNhcmRzIC5jYXJkLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5oYXJ2ZXN0LWNhcmQge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLmhhcnZlc3QtY2FyZCAuY29udGFtaW5hdGlvbiB7XG4gIGJhY2tncm91bmQ6IHRvbWF0bztcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbn1cbi5oYXJ2ZXN0LWNhcmQgLmNvbnRhbWluYXRpb24gaW1nIHtcbiAgcGFkZGluZzogNHB4O1xuICB3aWR0aDogMTAwJTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cbi5oYXJ2ZXN0LWNhcmQuYmFjayB7XG4gIGJhY2tncm91bmQ6ICNmZGQwOGE7XG59XG4uaGFydmVzdC1jYXJkLmJhY2sgaW1nIHtcbiAgbWFyZ2luOiA1cHg7XG59XG4uaGFydmVzdC1jYXJkIC5yZXNvdXJjZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBmb250LXNpemU6IDIycHg7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuLmxhbmQtdGlsZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiA0MHB4O1xuICBoZWlnaHQ6IDQwcHg7XG4gIG1hcmdpbjogNnB4O1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDFzIGVhc2U7XG4gIHRyYW5zaXRpb24tZGVsYXk6IDAuNXM7XG4gIGZsZXgtc2hyaW5rOiAwO1xufVxuLmxhbmQtdGlsZS5lbXB0eSB7XG4gIGJhY2tncm91bmQ6ICNmMWVkZTc7XG59XG4ubGFuZC10aWxlOm5vdCguZW1wdHkpIHtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG59XG4ubGFuZC10aWxlLmNvbnRhbWluYXRlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xufVxuLmxhbmQtdGlsZS5vd25lZFtkYXRhLWJhZGdlXTo6YWZ0ZXIge1xuICBjb250ZW50OiBhdHRyKGRhdGEtYmFkZ2UpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHBhZGRpbmc6IDAgNXB4O1xuICBtaW4td2lkdGg6IDEwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgYm94LXNoYWRvdzogLTJweCAycHg7XG4gIGZvbnQtd2VpZ2h0OiA5MDA7XG4gIHRvcDogLTEwcHg7XG4gIHJpZ2h0OiAtMTBweDtcbiAgei1pbmRleDogMTA7XG59XG4ubGFuZC10aWxlLm93bmVkW2RhdGEtYmFkZ2VdW2RhdGEtZGl2aXNpb249TkVdOjphZnRlciB7XG4gIGJhY2tncm91bmQ6ICNhZGYxYWQ7XG59XG4ubGFuZC10aWxlLm93bmVkW2RhdGEtYmFkZ2VdW2RhdGEtZGl2aXNpb249V106OmFmdGVyIHtcbiAgYmFja2dyb3VuZDogIzllYzhlMjtcbn0iXX0= */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HarvestComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-harvest',
          templateUrl: './harvest.component.html',
          styleUrls: ['./harvest.component.scss'],
          host: {
            '[class.harvest]': 'true'
          }
        }]
      }], function () {
        return [{
          type: _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_7__["MatBottomSheet"]
        }];
      }, {
        keyEvent: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"],
          args: ['window:keyup', ['$event']]
        }],
        gatherResource: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        player: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        division: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/components/land-grid/land-grid.component.ts": function srcAppComponentsLandGridLandGridComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LandGridComponent", function () {
      return LandGridComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! lodash */
    "./node_modules/lodash/lodash.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var src_app_interfaces__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! src/app/interfaces */
    "./src/app/interfaces.ts");
    /* harmony import */


    var _angular_fire_database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/fire/database */
    "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire-database.js");
    /* harmony import */


    var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/material/bottom-sheet */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _card_card_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../card/card.component */
    "./src/app/components/card/card.component.ts");

    function LandGridComponent_div_1_div_3_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 9);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var card_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("one", card_r1.value === 1)("two", card_r1.value === 2)("three", card_r1.value === 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", card_r1.value, " ");
      }
    }

    function LandGridComponent_div_1_div_4_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 11);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    }

    function LandGridComponent_div_1_div_6_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var card_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", card_r1.value == 0 ? "X" : "", " ");
      }
    }

    function LandGridComponent_div_1_Template(rf, ctx) {
      if (rf & 1) {
        var _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "card", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LandGridComponent_div_1_Template_card_click_1_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r9);

          var card_r1 = ctx.$implicit;

          var ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r8.selectTile(card_r1);
        })("sideChange", function LandGridComponent_div_1_Template_card_sideChange_1_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r9);

          var i_r2 = ctx.index;

          var ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

          return ctx_r10.process(i_r2);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, LandGridComponent_div_1_div_3_Template, 2, 7, "div", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, LandGridComponent_div_1_div_4_Template, 2, 0, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, LandGridComponent_div_1_div_6_Template, 2, 1, "div", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var card_r1 = ctx.$implicit;

        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("contaminated", card_r1.contaminated == true)("empty", card_r1.value === 0 - 1)("owned", card_r1.owner !== null);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("data-badge", card_r1.owner ? card_r1.owner.name : null)("data-division", card_r1.owner ? card_r1.owner.division : null);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("owned", true)("disabled", card_r1.value == 0 - 1 || card_r1.contaminated == true);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("side", card_r1.harvested ? "front" : "back")("mark", card_r1.mark)("playerId", ctx_r0.playerId);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", card_r1.value > 0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", card_r1.value === 0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.markCards);
      }
    }

    var MAX_HARVEST = 49;
    var HARVEST_ROW_LENGTH = 7;

    var LandGridComponent = /*#__PURE__*/function () {
      function LandGridComponent(db, _bottomSheet) {
        _classCallCheck(this, LandGridComponent);

        this.db = db;
        this._bottomSheet = _bottomSheet;
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.gatherResource = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.select = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.playerId = 0;
      }

      _createClass(LandGridComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this6 = this;

          this.db.object(this.updatePath).valueChanges().subscribe(function (tiles) {
            if (!_this6.landTiles) {
              _this6.landTiles = tiles;
            }

            tiles.forEach(function (update, i) {
              var _a, _b;

              if (!Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(update, _this6.landTiles[i])) {
                console.log('update: ', update);
                var tile = _this6.landTiles[i];
                tile.harvested = update.harvested;
                tile.value = update.value;
                tile.contaminated = update.contaminated;
                tile.mark = (_a = update.mark) !== null && _a !== void 0 ? _a : null;
                tile.owner = (_b = update.owner) !== null && _b !== void 0 ? _b : null;
              }
            });
          });
          this.db.object("shows/".concat(this.showId, "/contamination/current")).valueChanges().subscribe(function (level) {
            console.log('adjust contam: ', level); //this.adjustContamination(level);
          });
        }
      }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
          this.destroy$.next(true);
        }
      }, {
        key: "cardUpdates",
        value: function cardUpdates(tiles) {
          var _this7 = this;

          tiles.forEach(function (tile, i) {
            if (Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(tile, _this7.landTiles[i])) {
              _this7.landTiles[i] = Object.assign({}, tile);
            }
          });
        }
      }, {
        key: "getSelectedCard",
        value: function getSelectedCard() {
          var _a, _b;

          return (_b = (_a = this.landTiles) === null || _a === void 0 ? void 0 : _a[this.selectedCardIndex]) !== null && _b !== void 0 ? _b : null;
        }
      }, {
        key: "gatherOwnedLand",
        value: function gatherOwnedLand() {
          var _this8 = this;

          this.landTiles.forEach(function (card, i) {
            if (card.owner) {
              card.harvested = false;

              _this8.process(i);
            }
          });
        }
      }, {
        key: "selectTile",
        value: function selectTile(card) {
          console.log('select: ', card, Object(lodash__WEBPACK_IMPORTED_MODULE_1__["isEmpty"])(card.mark));

          if (!card.mark || card.mark === this.playerId) {
            this.select.emit(card);
            this.mark(card);
          }
        }
      }, {
        key: "clearSelection",
        value: function clearSelection(index) {
          this.landTiles[index].mark = null;
          this.selectedCardIndex = null;
          this.updateDB();
        }
      }, {
        key: "mark",
        value: function mark(_card) {
          if (this.selectedCardIndex) {
            this.clearSelection(this.selectedCardIndex);
          }

          var card = this.landTiles[_card.index];
          card.mark = card.mark ? null : this.playerId;
          this.selectedCardIndex = card.index;
          this.updateDB();
        }
      }, {
        key: "explore",
        value: function explore(card) {
          console.log('explore: ', card);

          if (!card.harvested && card.value !== src_app_interfaces__WEBPACK_IMPORTED_MODULE_3__["LandCardValues"].EMPTY) {
            this.landTiles[card.index].harvested = true;
            console.log('updates: ', this.landTiles);
            this.updateDB();
          }

          this.clearSelection(card.index);
        }
      }, {
        key: "gather",
        value: function gather(card) {
          console.log('do gather');
          this.gatherResource.emit({
            value: card.value
          });
          this.landTiles[card.index].value = -1;
          this.updateDB();
          this.clearSelection(card.index);
        }
      }, {
        key: "updateDB",
        value: function updateDB() {
          this.db.object(this.updatePath).update(this.landTiles);
        }
      }, {
        key: "getRelativeGridIndex",
        value: function getRelativeGridIndex(index, dir, dist) {
          var _a, _b, _c, _d;

          var grid = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["chunk"])(Object(lodash__WEBPACK_IMPORTED_MODULE_1__["range"])(MAX_HARVEST), HARVEST_ROW_LENGTH);
          var r = Math.floor(index / HARVEST_ROW_LENGTH);
          var c = index % HARVEST_ROW_LENGTH;

          if (dir === 'left') {
            return (_a = grid[r]) === null || _a === void 0 ? void 0 : _a[c - dist];
          }

          if (dir === 'right') {
            return (_b = grid[r]) === null || _b === void 0 ? void 0 : _b[c + dist];
          }

          if (dir === 'top') {
            return (_c = grid[r - dist]) === null || _c === void 0 ? void 0 : _c[c];
          }

          if (dir === 'bottom') {
            return (_d = grid[r + dist]) === null || _d === void 0 ? void 0 : _d[c];
          }
        }
      }, {
        key: "process",
        value: function process(i) {
          var _this9 = this;

          var tile = this.landTiles[i];

          if (tile.value === src_app_interfaces__WEBPACK_IMPORTED_MODULE_3__["LandCardValues"].CONTAM && tile.harvested) {
            var left = this.landTiles[this.getRelativeGridIndex(i, 'left', 1)];
            var right = this.landTiles[this.getRelativeGridIndex(i, 'right', 1)];
            var top = this.landTiles[this.getRelativeGridIndex(i, 'top', 1)];
            var bottom = this.landTiles[this.getRelativeGridIndex(i, 'bottom', 1)];
            setTimeout(function () {
              if (left && !left.owner) {
                left.contaminated = true;
              }

              if (right && !right.owner) {
                right.contaminated = true;
              }

              if (top && !top.owner) {
                top.contaminated = true;
              }

              if (bottom && !bottom.owner) {
                bottom.contaminated = true;
              }

              _this9.updateDB();
            });
          }
        }
      }]);

      return LandGridComponent;
    }();

    LandGridComponent.ɵfac = function LandGridComponent_Factory(t) {
      return new (t || LandGridComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_fire_database__WEBPACK_IMPORTED_MODULE_4__["AngularFireDatabase"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_5__["MatBottomSheet"]));
    };

    LandGridComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: LandGridComponent,
      selectors: [["app-land-grid"]],
      hostVars: 2,
      hostBindings: function LandGridComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("harvest", true);
        }
      },
      inputs: {
        markCards: "markCards",
        updatePath: "updatePath",
        showId: "showId",
        playerId: "playerId"
      },
      outputs: {
        gatherResource: "gatherResource",
        select: "select"
      },
      decls: 2,
      vars: 1,
      consts: [[1, "harvest-cards"], ["class", "land-tile", 3, "contaminated", "empty", "owned", 4, "ngFor", "ngForOf"], [1, "land-tile"], ["width", "40", "height", "40", 3, "side", "mark", "playerId", "click", "sideChange"], ["front", "", 1, "harvest-card"], ["class", "resource", 3, "one", "two", "three", 4, "ngIf"], ["class", "contamination", 4, "ngIf"], ["back", "", 1, "harvest-card", "back"], ["class", "flex-row flex-center", 4, "ngIf"], [1, "resource"], [1, "contamination"], ["src", "../assets/contamination.png"], [1, "flex-row", "flex-center"]],
      template: function LandGridComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, LandGridComponent_div_1_Template, 7, 18, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.landTiles);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"], _card_card_component__WEBPACK_IMPORTED_MODULE_7__["CardComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"]],
      styles: [".harvest-cards[_ngcontent-%COMP%] {\n  perspective: 50em;\n  max-width: 400px;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  width: 100%;\n  align-items: flex-start;\n}\n.harvest-cards[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%] {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n}\n.harvest-cards[_ngcontent-%COMP%]   .card-row[_ngcontent-%COMP%] {\n  display: flex;\n}\n.harvest-card[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  position: relative;\n}\n.harvest-card[_ngcontent-%COMP%]   .contamination[_ngcontent-%COMP%] {\n  background: tomato;\n  height: 100%;\n  display: flex;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.harvest-card[_ngcontent-%COMP%]   .contamination[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  padding: 4px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.harvest-card.back[_ngcontent-%COMP%] {\n  background: #fdd08a;\n}\n.harvest-card.back[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  margin: 5px;\n}\n.harvest-card[_ngcontent-%COMP%]   .resource[_ngcontent-%COMP%] {\n  width: 100%;\n  font-size: 22px;\n  height: 100%;\n}\n.land-tile[_ngcontent-%COMP%] {\n  position: relative;\n  display: block;\n  width: 40px;\n  height: 40px;\n  margin: 6px;\n  border-radius: 10px;\n  transition: background-color 1s ease;\n  transition-delay: 0.5s;\n  flex-shrink: 0;\n}\n.land-tile.empty[_ngcontent-%COMP%] {\n  background: #f1ede7;\n}\n.land-tile[_ngcontent-%COMP%]:not(.empty) {\n  background: transparent;\n}\n.land-tile.contaminated[_ngcontent-%COMP%] {\n  background-color: black;\n}\n.land-tile.owned[data-badge][_ngcontent-%COMP%]::after {\n  content: attr(data-badge);\n  position: absolute;\n  padding: 0 5px;\n  min-width: 10px;\n  border-radius: 5px;\n  box-shadow: -2px 2px;\n  font-weight: 900;\n  top: -10px;\n  right: -10px;\n  z-index: 10;\n}\n.land-tile.owned[data-badge][data-division=NE][_ngcontent-%COMP%]::after {\n  background: #adf1ad;\n}\n.land-tile.owned[data-badge][data-division=W][_ngcontent-%COMP%]::after {\n  background: #9ec8e2;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYW1tYWNraW5ub24vcHJvamVjdHMvbmV3c29jaWV0aWVzL3NyYy9hcHAvY29tcG9uZW50cy9sYW5kLWdyaWQvbGFuZC1ncmlkLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9jb21wb25lbnRzL2xhbmQtZ3JpZC9sYW5kLWdyaWQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLFdBQUE7RUFDQSx1QkFBQTtBQ0NGO0FEQ0U7RUFDRSxlQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUNDSjtBREVFO0VBQ0UsYUFBQTtBQ0FKO0FESUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0FDREY7QURHRTtFQUNFLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0FDREo7QURHSTtFQUNFLFlBQUE7RUFDQSxXQUFBO0VBQ0Esc0JBQUE7QUNETjtBREtFO0VBQ0UsbUJBQUE7QUNISjtBREtJO0VBQ0UsV0FBQTtBQ0hOO0FET0U7RUFDRSxXQUFBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7QUNMSjtBRFVBO0VBQ0Usa0JBQUE7RUFDQSxjQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxvQ0FBQTtFQUNBLHNCQUFBO0VBQ0EsY0FBQTtBQ1BGO0FEU0U7RUFDRSxtQkFBQTtBQ1BKO0FEVUU7RUFDRSx1QkFBQTtBQ1JKO0FEV0U7RUFDRSx1QkFBQTtBQ1RKO0FEYUk7RUFDRSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUNYTjtBRGNNO0VBQ0UsbUJBQUE7QUNaUjtBRGdCTTtFQUNFLG1CQUFBO0FDZFIiLCJmaWxlIjoic3JjL2FwcC9jb21wb25lbnRzL2xhbmQtZ3JpZC9sYW5kLWdyaWQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGFydmVzdC1jYXJkcyB7XG4gIHBlcnNwZWN0aXZlOiA1MGVtO1xuICBtYXgtd2lkdGg6IDQwMHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIHdpZHRoOiAxMDAlO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcblxuICAuY2FyZCB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgfVxuXG4gIC5jYXJkLXJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgfVxufVxuXG4uaGFydmVzdC1jYXJkIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogZmxleDsgXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgLmNvbnRhbWluYXRpb24ge1xuICAgIGJhY2tncm91bmQ6IHRvbWF0bztcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG5cbiAgICBpbWcge1xuICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cbiAgfVxuXG4gICYuYmFjayB7XG4gICAgYmFja2dyb3VuZDogI2ZkZDA4YTtcblxuICAgIGltZyB7XG4gICAgICBtYXJnaW46IDVweDtcbiAgICB9XG4gIH1cblxuICAucmVzb3VyY2Uge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGZvbnQtc2l6ZTogMjJweDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cblxufVxuXG4ubGFuZC10aWxlIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlOyBcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiA0MHB4O1xuICBoZWlnaHQ6IDQwcHg7XG4gIG1hcmdpbjogNnB4O1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDFzIGVhc2U7XG4gIHRyYW5zaXRpb24tZGVsYXk6IDAuNXM7XG4gIGZsZXgtc2hyaW5rOiAwO1xuXG4gICYuZW1wdHkge1xuICAgIGJhY2tncm91bmQ6ICNmMWVkZTc7XG4gIH1cblxuICAmOm5vdCguZW1wdHkpIHtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgfVxuXG4gICYuY29udGFtaW5hdGVkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgfVxuXG4gICYub3duZWRbZGF0YS1iYWRnZV0ge1xuICAgICY6OmFmdGVyIHtcbiAgICAgIGNvbnRlbnQ6IGF0dHIoZGF0YS1iYWRnZSk7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBwYWRkaW5nOiAwIDVweDsgXG4gICAgICBtaW4td2lkdGg6IDEwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgICBib3gtc2hhZG93OiAtMnB4IDJweDtcbiAgICAgIGZvbnQtd2VpZ2h0OiA5MDA7XG4gICAgICB0b3A6IC0xMHB4O1xuICAgICAgcmlnaHQ6IC0xMHB4O1xuICAgICAgei1pbmRleDogMTA7XG4gICAgfVxuICAgICZbZGF0YS1kaXZpc2lvbj1ORV0ge1xuICAgICAgJjo6YWZ0ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjYWRmMWFkO1xuICAgICAgfVxuICAgIH1cbiAgICAmW2RhdGEtZGl2aXNpb249V10ge1xuICAgICAgJjo6YWZ0ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjOWVjOGUyO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi5oYXJ2ZXN0LWNhcmRzIHtcbiAgcGVyc3BlY3RpdmU6IDUwZW07XG4gIG1heC13aWR0aDogNDAwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgd2lkdGg6IDEwMCU7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xufVxuLmhhcnZlc3QtY2FyZHMgLmNhcmQge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG4uaGFydmVzdC1jYXJkcyAuY2FyZC1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uaGFydmVzdC1jYXJkIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5oYXJ2ZXN0LWNhcmQgLmNvbnRhbWluYXRpb24ge1xuICBiYWNrZ3JvdW5kOiB0b21hdG87XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG59XG4uaGFydmVzdC1jYXJkIC5jb250YW1pbmF0aW9uIGltZyB7XG4gIHBhZGRpbmc6IDRweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG4uaGFydmVzdC1jYXJkLmJhY2sge1xuICBiYWNrZ3JvdW5kOiAjZmRkMDhhO1xufVxuLmhhcnZlc3QtY2FyZC5iYWNrIGltZyB7XG4gIG1hcmdpbjogNXB4O1xufVxuLmhhcnZlc3QtY2FyZCAucmVzb3VyY2Uge1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC1zaXplOiAyMnB4O1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5sYW5kLXRpbGUge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xuICBtYXJnaW46IDZweDtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAxcyBlYXNlO1xuICB0cmFuc2l0aW9uLWRlbGF5OiAwLjVzO1xuICBmbGV4LXNocmluazogMDtcbn1cbi5sYW5kLXRpbGUuZW1wdHkge1xuICBiYWNrZ3JvdW5kOiAjZjFlZGU3O1xufVxuLmxhbmQtdGlsZTpub3QoLmVtcHR5KSB7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xufVxuLmxhbmQtdGlsZS5jb250YW1pbmF0ZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbn1cbi5sYW5kLXRpbGUub3duZWRbZGF0YS1iYWRnZV06OmFmdGVyIHtcbiAgY29udGVudDogYXR0cihkYXRhLWJhZGdlKTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBwYWRkaW5nOiAwIDVweDtcbiAgbWluLXdpZHRoOiAxMHB4O1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIGJveC1zaGFkb3c6IC0ycHggMnB4O1xuICBmb250LXdlaWdodDogOTAwO1xuICB0b3A6IC0xMHB4O1xuICByaWdodDogLTEwcHg7XG4gIHotaW5kZXg6IDEwO1xufVxuLmxhbmQtdGlsZS5vd25lZFtkYXRhLWJhZGdlXVtkYXRhLWRpdmlzaW9uPU5FXTo6YWZ0ZXIge1xuICBiYWNrZ3JvdW5kOiAjYWRmMWFkO1xufVxuLmxhbmQtdGlsZS5vd25lZFtkYXRhLWJhZGdlXVtkYXRhLWRpdmlzaW9uPVddOjphZnRlciB7XG4gIGJhY2tncm91bmQ6ICM5ZWM4ZTI7XG59Il19 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LandGridComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-land-grid',
          templateUrl: './land-grid.component.html',
          styleUrls: ['./land-grid.component.scss'],
          host: {
            '[class.harvest]': 'true'
          }
        }]
      }], function () {
        return [{
          type: _angular_fire_database__WEBPACK_IMPORTED_MODULE_4__["AngularFireDatabase"]
        }, {
          type: _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_5__["MatBottomSheet"]
        }];
      }, {
        gatherResource: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        select: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        markCards: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        updatePath: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        showId: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        playerId: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/components/player-deck/player-deck.component.ts": function srcAppComponentsPlayerDeckPlayerDeckComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlayerDeckComponent", function () {
      return PlayerDeckComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! lodash */
    "./node_modules/lodash/lodash.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
    /* harmony import */


    var src_app_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! src/app/interfaces */
    "./src/app/interfaces.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");

    function PlayerDeckComponent_div_5_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var resource_r2 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("one", resource_r2.value == 1)("two", resource_r2.value == 2)("three", resource_r2.value == 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", resource_r2.value, " ");
      }
    }

    function PlayerDeckComponent_div_9_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var resource_r3 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("one", resource_r3.value == 1)("two", resource_r3.value == 2)("three", resource_r3.value == 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", resource_r3.value, " ");
      }
    }

    var PlayerDeckComponent = /*#__PURE__*/function () {
      function PlayerDeckComponent() {
        _classCallCheck(this, PlayerDeckComponent);

        this._resources = [{
          value: 1
        }, {
          value: 3
        }, {
          value: 2
        }, {
          value: 1
        }, {
          value: 3
        }, {
          value: 2
        }, {
          value: 1
        }, {
          value: 3
        }, {
          value: 2
        }];
        this.wealth = 0;
      }

      _createClass(PlayerDeckComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          // this.resources = sortBy(this.resources, 'value');
          this.calculateWealth();
        }
      }, {
        key: "resources",
        get: function get() {
          return this._resources;
        },
        set: function set(value) {
          this._resources = value;
        }
      }, {
        key: "add",
        value: function add(R) {
          if (R.value === src_app_interfaces__WEBPACK_IMPORTED_MODULE_2__["LandCardValues"].CONTAM) {
            this.contaminateResources();
          } else {
            this._resources.push(R);

            this.wealth += R.value; // this.resources = sortBy(this.resources, 'value')
          }
        }
      }, {
        key: "remove",
        value: function remove(id) {
          console.log('remove resource: ', id);
        }
      }, {
        key: "spend",
        value: function spend(cost) {
          if (cost > this.wealth) {
            window.alert("Sorry, you can't afford that :(");
          } else {
            var change = this.spendResources(cost);
          }
        }
      }, {
        key: "spendResources",
        value: function spendResources(cost) {
          var spend = 0;
          var transactions = 0;
          var maxTransactions = this.resources.length;

          while (spend < cost && transactions <= maxTransactions) {
            spend += this.resources[0].value;
            this.resources.shift();
            transactions++;
          }

          if (cost > spend) {
            alert('TRANSACTION DECLINED');
          } else {
            var change = spend - cost;

            if (change > 0) {
              this.resources.push({
                value: change
              });
            }

            this.calculateWealth();
            console.log('SPENT: ', spend, 'CHANGE: ', change);
          }
        }
      }, {
        key: "calculateWealth",
        value: function calculateWealth() {
          this.wealth = this.resources.reduce(function (acc, R) {
            return acc + R.value;
          }, 0);
        }
      }, {
        key: "contaminateResources",
        value: function contaminateResources() {
          var toDestroy = Math.ceil(this.resources.length / 2);
          var destroyMsg = toDestroy > 0 ? " ".concat(formatPlural(toDestroy, 'resource has', 'resources have'), " been destroyed") : '';
          this.resources = Object(lodash__WEBPACK_IMPORTED_MODULE_1__["slice"])(this.resources, toDestroy);
          this.calculateWealth();
          window.alert("You gathered a contaminant!".concat(destroyMsg));
        }
      }]);

      return PlayerDeckComponent;
    }();

    PlayerDeckComponent.ɵfac = function PlayerDeckComponent_Factory(t) {
      return new (t || PlayerDeckComponent)();
    };

    PlayerDeckComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PlayerDeckComponent,
      selectors: [["app-player-deck"]],
      hostVars: 2,
      hostBindings: function PlayerDeckComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("player-deck", true);
        }
      },
      inputs: {
        id: "id",
        division: "division"
      },
      decls: 11,
      vars: 6,
      consts: [[1, "flex-row"], [1, "flex-column"], [1, "player-hand"], ["class", "resource", 3, "one", "two", "three", 4, "ngFor", "ngForOf"], [1, "gla-resources"], [1, "resource"]],
      template: function PlayerDeckComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, " Harvested ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, PlayerDeckComponent_div_5_Template, 2, 7, "div", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " GLA ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, PlayerDeckComponent_div_9_Template, 2, 7, "div", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](10, "async");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("PLAYER: ", ctx.id, " | WEALTH: ", ctx.wealth, "\n");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.resources);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](10, 4, ctx.$GLAResources));
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["AsyncPipe"]],
      styles: [".player-hand[_ngcontent-%COMP%] {\n  align-content: flex-start;\n  display: flex;\n  flex-wrap: wrap;\n  width: 96px;\n  height: 96px;\n  border: solid 1px lightgrey;\n  background: lightgrey;\n  padding: 1px;\n  overflow: scroll;\n}\n.player-hand[_ngcontent-%COMP%]   .resource[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 12px;\n  margin: 1px;\n  border-radius: 5px;\n  border: solid 1px lightgrey;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYW1tYWNraW5ub24vcHJvamVjdHMvbmV3c29jaWV0aWVzL3NyYy9hcHAvY29tcG9uZW50cy9wbGF5ZXItZGVjay9wbGF5ZXItZGVjay5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvY29tcG9uZW50cy9wbGF5ZXItZGVjay9wbGF5ZXItZGVjay5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHlCQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDJCQUFBO0VBQ0EscUJBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7QUNDRjtBRENFO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsMkJBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcGxheWVyLWRlY2svcGxheWVyLWRlY2suY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucGxheWVyLWhhbmQge1xuICBhbGlnbi1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBkaXNwbGF5OiBmbGV4OyBcbiAgZmxleC13cmFwOiB3cmFwO1xuICB3aWR0aDogOTZweDtcbiAgaGVpZ2h0OiA5NnB4O1xuICBib3JkZXI6IHNvbGlkIDFweCBsaWdodGdyZXk7XG4gIGJhY2tncm91bmQ6IGxpZ2h0Z3JleTtcbiAgcGFkZGluZzogMXB4O1xuICBvdmVyZmxvdzogc2Nyb2xsO1xuXG4gIC5yZXNvdXJjZSB7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBtYXJnaW46IDFweDtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgYm9yZGVyOiBzb2xpZCAxcHggbGlnaHRncmV5O1xuICB9XG59XG4iLCIucGxheWVyLWhhbmQge1xuICBhbGlnbi1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIHdpZHRoOiA5NnB4O1xuICBoZWlnaHQ6IDk2cHg7XG4gIGJvcmRlcjogc29saWQgMXB4IGxpZ2h0Z3JleTtcbiAgYmFja2dyb3VuZDogbGlnaHRncmV5O1xuICBwYWRkaW5nOiAxcHg7XG4gIG92ZXJmbG93OiBzY3JvbGw7XG59XG4ucGxheWVyLWhhbmQgLnJlc291cmNlIHtcbiAgd2lkdGg6IDIwcHg7XG4gIGhlaWdodDogMjBweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBtYXJnaW46IDFweDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBib3JkZXI6IHNvbGlkIDFweCBsaWdodGdyZXk7XG59Il19 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PlayerDeckComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-player-deck',
          templateUrl: './player-deck.component.html',
          styleUrls: ['./player-deck.component.scss'],
          host: {
            '[class.player-deck]': 'true'
          }
        }]
      }], null, {
        id: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        division: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();

    function formatPlural(num, singular, plural) {
      return num == 1 ? "".concat(num, " ").concat(singular) : "".concat(num, " ").concat(plural);
    }
    /***/

  },

  /***/
  "./src/app/components/player-hands/player-hands.component.ts": function srcAppComponentsPlayerHandsPlayerHandsComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlayerHandsComponent", function () {
      return PlayerHandsComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var PlayerHandsComponent = /*#__PURE__*/function () {
      function PlayerHandsComponent() {
        _classCallCheck(this, PlayerHandsComponent);

        this._hand = [];
        this._score = 0;
      }

      _createClass(PlayerHandsComponent, [{
        key: "hand",
        get: function get() {
          return this._hand;
        },
        set: function set(value) {
          this._hand = value;
        }
      }, {
        key: "add",
        value: function add(card) {
          this._hand.push(card);

          console.log("add card: ", card, this.hand);
        }
      }, {
        key: "remove",
        value: function remove(id) {
          console.log('remove card: ', id);
        }
      }]);

      return PlayerHandsComponent;
    }();

    PlayerHandsComponent.ɵfac = function PlayerHandsComponent_Factory(t) {
      return new (t || PlayerHandsComponent)();
    };

    PlayerHandsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PlayerHandsComponent,
      selectors: [["app-player-hands"]],
      hostVars: 2,
      hostBindings: function PlayerHandsComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("player-hands", true);
        }
      },
      inputs: {
        players: "players",
        focus: "focus"
      },
      decls: 0,
      vars: 0,
      template: function PlayerHandsComponent_Template(rf, ctx) {},
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcGxheWVyLWhhbmRzL3BsYXllci1oYW5kcy5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PlayerHandsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-player-hands',
          templateUrl: './player-hands.component.html',
          styleUrls: ['./player-hands.component.scss'],
          host: {
            '[class.player-hands]': 'true'
          }
        }]
      }], null, {
        players: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        focus: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/components/scorecard/scorecard.component.ts": function srcAppComponentsScorecardScorecardComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ScorecardComponent", function () {
      return ScorecardComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var ScorecardComponent = function ScorecardComponent() {
      _classCallCheck(this, ScorecardComponent);
    };

    ScorecardComponent.ɵfac = function ScorecardComponent_Factory(t) {
      return new (t || ScorecardComponent)();
    };

    ScorecardComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ScorecardComponent,
      selectors: [["app-scorecard"]],
      hostVars: 2,
      hostBindings: function ScorecardComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("scorecard", true);
        }
      },
      decls: 0,
      vars: 0,
      template: function ScorecardComponent_Template(rf, ctx) {},
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvc2NvcmVjYXJkL3Njb3JlY2FyZC5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ScorecardComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-scorecard',
          templateUrl: './scorecard.component.html',
          styleUrls: ['./scorecard.component.scss'],
          host: {
            '[class.scorecard]': 'true'
          }
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/components/society-summary/society-summary.component.ts": function srcAppComponentsSocietySummarySocietySummaryComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SocietySummaryComponent", function () {
      return SocietySummaryComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");

    function SocietySummaryComponent_ng_container_0_ng_container_15_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Reserve:");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Harvested (actual):");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Capacity:");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Harvest:");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
      }

      if (rf & 2) {
        var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.calculateReserve(ctx_r1.division.reserve));

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.division.harvested);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", ctx_r1.division.capacity, "+", ctx_r1.division.extra, "");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r1.division.harvest);
      }
    }

    function SocietySummaryComponent_ng_container_0_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Season:");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Score:");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "strong");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Land cost:");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](15, SocietySummaryComponent_ng_container_0_ng_container_15_Template, 17, 5, "ng-container", 0);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
      }

      if (rf & 2) {
        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Division: ", ctx_r0.division == null ? null : ctx_r0.division.code, "");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.division.season);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.division.score);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.division.landCost);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.details === "full");
      }
    }

    var SocietySummaryComponent = /*#__PURE__*/function () {
      function SocietySummaryComponent() {
        _classCallCheck(this, SocietySummaryComponent);
      }

      _createClass(SocietySummaryComponent, [{
        key: "calculateReserve",
        value: function calculateReserve(reserve) {
          return reserve.reduce(function (acc, R) {
            return acc + R;
          }, 0);
        }
      }]);

      return SocietySummaryComponent;
    }();

    SocietySummaryComponent.ɵfac = function SocietySummaryComponent_Factory(t) {
      return new (t || SocietySummaryComponent)();
    };

    SocietySummaryComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: SocietySummaryComponent,
      selectors: [["app-society-summary"]],
      hostVars: 4,
      hostBindings: function SocietySummaryComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("society-summary", true)("flex-column", true);
        }
      },
      inputs: {
        division: "division",
        details: "details"
      },
      decls: 1,
      vars: 1,
      consts: [[4, "ngIf"]],
      template: function SocietySummaryComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, SocietySummaryComponent_ng_container_0_Template, 16, 5, "ng-container", 0);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.division);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvc29jaWV0eS1zdW1tYXJ5L3NvY2lldHktc3VtbWFyeS5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](SocietySummaryComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-society-summary',
          templateUrl: './society-summary.component.html',
          styleUrls: ['./society-summary.component.scss'],
          host: {
            '[class.society-summary]': 'true',
            '[class.flex-column]': 'true'
          }
        }]
      }], null, {
        division: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        details: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/components/vote/vote.component.ts": function srcAppComponentsVoteVoteComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "VoteComponent", function () {
      return VoteComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");

    var VoteComponent = function VoteComponent() {
      _classCallCheck(this, VoteComponent);
    };

    VoteComponent.ɵfac = function VoteComponent_Factory(t) {
      return new (t || VoteComponent)();
    };

    VoteComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: VoteComponent,
      selectors: [["app-vote"]],
      hostVars: 2,
      hostBindings: function VoteComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("vote", true);
        }
      },
      decls: 0,
      vars: 0,
      template: function VoteComponent_Template(rf, ctx) {},
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvdm90ZS92b3RlLmNvbXBvbmVudC5zY3NzIn0= */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](VoteComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-vote',
          templateUrl: './vote.component.html',
          styleUrls: ['./vote.component.scss'],
          host: {
            '[class.vote]': 'true'
          }
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/interfaces.ts": function srcAppInterfacesTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LandCardValues", function () {
      return LandCardValues;
    });

    var LandCardValues;

    (function (LandCardValues) {
      LandCardValues[LandCardValues["EMPTY"] = -1] = "EMPTY";
      LandCardValues[LandCardValues["CONTAM"] = 0] = "CONTAM";
      LandCardValues[LandCardValues["V1"] = 1] = "V1";
      LandCardValues[LandCardValues["V2"] = 2] = "V2";
      LandCardValues[LandCardValues["V3"] = 3] = "V3";
    })(LandCardValues || (LandCardValues = {}));
    /***/

  },

  /***/
  "./src/app/pages/central/central.component.ts": function srcAppPagesCentralCentralComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "CentralComponent", function () {
      return CentralComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! lodash */
    "./node_modules/lodash/lodash.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
    /* harmony import */


    var _templates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./templates */
    "./src/app/pages/central/templates.ts");
    /* harmony import */


    var _angular_fire_database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/fire/database */
    "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire-database.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _components_society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../components/society-summary/society-summary.component */
    "./src/app/components/society-summary/society-summary.component.ts");

    function CentralComponent_div_2_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "async");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "app-society-summary", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "async");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var $division_r1 = ctx.$implicit;

        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        var tmp_0_0 = null;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"](" localhost:4200/", ctx_r0.showKey, "/", (tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 3, $division_r1)) == null ? null : tmp_0_0.code, "/X ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("division", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 5, $division_r1));
      }
    }

    var DIVISIONS = ['N', 'S', 'E', 'W', 'NE', 'SE', 'SW', 'NW'];
    var MAX_HARVEST = 49;

    var CentralComponent = /*#__PURE__*/function () {
      function CentralComponent(db) {
        _classCallCheck(this, CentralComponent);

        this.db = db;
      }

      _createClass(CentralComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this10 = this;

          this.db.list('shows', function (ref) {
            return ref.limitToLast(1);
          }).snapshotChanges().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                snapshot = _ref2[0];

            _this10.showKey = snapshot.key;

            _this10.createDivisionListeners(snapshot.payload.val());
          });
        }
      }, {
        key: "createDivisionListeners",
        value: function createDivisionListeners(show) {
          var _this11 = this;

          if (show === null || show === void 0 ? void 0 : show.divisions) {
            this.divisionChanges = Object(lodash__WEBPACK_IMPORTED_MODULE_2__["toArray"])(show.divisions).map(function (division) {
              return _this11.db.object("shows/".concat(_this11.showKey, "/divisions/").concat(division.code)).valueChanges();
            });
          }
        }
      }, {
        key: "newShow",
        value: function newShow() {
          var _this12 = this;

          var divisions = this.generateDivisions();
          this.db.list('shows').push(Object.assign({
            divisions: divisions
          }, _templates__WEBPACK_IMPORTED_MODULE_3__["SHOW_TEMPLATE"])).then(function (res) {
            _this12.buildShow(res.key);
          });
        }
      }, {
        key: "buildShow",
        value: function buildShow(key) {
          var _this13 = this;

          this.db.object("shows/".concat(key)).valueChanges().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (show) {
            _this13.showKey = key;

            _this13.createDivisionListeners(show);
          });
        }
      }, {
        key: "generateDivisions",
        value: function generateDivisions() {
          var _this14 = this;

          return DIVISIONS.reduce(function (acc, abv) {
            return Object.assign(Object.assign({}, acc), _defineProperty({}, abv, Object.assign({
              code: abv,
              landTiles: _this14.generateLandTiles()
            }, _templates__WEBPACK_IMPORTED_MODULE_3__["DIVISION_TEMPLATE"])));
          }, {});
        }
      }, {
        key: "generateLandTiles",
        value: function generateLandTiles() {
          var slots = Object(lodash__WEBPACK_IMPORTED_MODULE_2__["range"])(MAX_HARVEST);
          return slots.map(function (_, index) {
            return {
              value: -1,
              owner: null,
              harvested: false,
              contaminated: false,
              mark: null,
              index: index
            };
          });
        }
      }]);

      return CentralComponent;
    }();

    CentralComponent.ɵfac = function CentralComponent_Factory(t) {
      return new (t || CentralComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_fire_database__WEBPACK_IMPORTED_MODULE_4__["AngularFireDatabase"]));
    };

    CentralComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CentralComponent,
      selectors: [["app-central"]],
      decls: 3,
      vars: 1,
      consts: [[3, "click"], ["class", "division-summary", 4, "ngFor", "ngForOf"], [1, "division-summary"], ["details", "full", 3, "division"]],
      template: function CentralComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function CentralComponent_Template_button_click_0_listener() {
            return ctx.newShow();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "New Show");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, CentralComponent_div_2_Template, 5, 7, "div", 1);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.divisionChanges);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], _components_society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_6__["SocietySummaryComponent"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["AsyncPipe"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2NlbnRyYWwvY2VudHJhbC5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](CentralComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-central',
          templateUrl: './central.component.html',
          styleUrls: ['./central.component.scss']
        }]
      }], function () {
        return [{
          type: _angular_fire_database__WEBPACK_IMPORTED_MODULE_4__["AngularFireDatabase"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/pages/central/templates.ts": function srcAppPagesCentralTemplatesTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DIVISION_TEMPLATE", function () {
      return DIVISION_TEMPLATE;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SHOW_TEMPLATE", function () {
      return SHOW_TEMPLATE;
    });

    var DIVISION_TEMPLATE = {
      achievements: {
        safety: {
          accomplishedBy: null,
          reward: 'Exploring a contamination will not affect the harvest line.'
        },
        health: {
          accomplishedBy: null,
          reward: 'Gathering a contamination will not affect your hand.'
        },
        arts: {
          accomplishedBy: null,
          reward: 'The effect is immeasurable.'
        },
        knowledge: {
          accomplishedBy: null,
          reward: 'Peek at one resource on the harvest line without exploring.'
        },
        infastructure: {
          accomplishedBy: null,
          reward: '+1 action.'
        }
      },
      imports: {
        messages: [],
        gla: [],
        resources: [],
        players: []
      },
      exports: {
        messages: [],
        gla: [],
        resources: [],
        players: []
      },
      landCost: 5,
      VP: 0,
      score: 'Low',
      principles: [],
      resolutions: [],
      season: 1,
      messages: [],
      incomingAnnouncement: null,
      announcements: [],
      reserve: [1, 2, 3, 2],
      reserveThresholds: {
        low: 7,
        mid: 12,
        hight: 17
      },
      capacity: 18,
      extra: 8,
      harvest: 25,
      harvested: 20,
      land: [],
      citizens: []
    };
    var SHOW_TEMPLATE = {
      clock: 0,
      live: false,
      contamination: {
        min: 5,
        max: 100,
        current: 5,
        formula: 'linear'
      },
      newsFeed: [],
      content: {},
      gla: {
        actual: 0,
        capacity: 0
      }
    };
    /***/
  },

  /***/
  "./src/app/pages/host/host.component.ts": function srcAppPagesHostHostComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HostComponent", function () {
      return HostComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var src_app_utilties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! src/app/utilties */
    "./src/app/utilties.ts");
    /* harmony import */


    var src_app_interfaces__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! src/app/interfaces */
    "./src/app/interfaces.ts");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! lodash */
    "./node_modules/lodash/lodash.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
    /* harmony import */


    var _angular_fire_database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/fire/database */
    "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire-database.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _components_land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../../components/land-grid/land-grid.component */
    "./src/app/components/land-grid/land-grid.component.ts");
    /* harmony import */


    var _components_society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ../../components/society-summary/society-summary.component */
    "./src/app/components/society-summary/society-summary.component.ts");

    function HostComponent_span_0_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" Contamination Level: ", ctx_r0.contamination, "%\n");
      }
    }

    function HostComponent_app_society_summary_2_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-society-summary", 4);
      }

      if (rf & 2) {
        var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("division", ctx_r1.division);
      }
    }

    var HostComponent = /*#__PURE__*/function () {
      function HostComponent(db, route) {
        _classCallCheck(this, HostComponent);

        this.db = db;
        this.route = route;
      }

      _createClass(HostComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this15 = this;

          this.divisionId = this.route.snapshot.params.division;
          this.showId = this.route.snapshot.params.show;
          this.divisionPath = "shows/".concat(this.showId, "/divisions/").concat(this.divisionId);
          this.landTilesPath = "".concat(this.divisionPath, "/landTiles");
          this.db.object(this.divisionPath).valueChanges().subscribe(function (division) {
            _this15.division = division;
          });
          this.db.object("shows/".concat(this.showId, "/contamination/current")).valueChanges().subscribe(function (level) {
            _this15.adjustContamination(level);
          });
        }
      }, {
        key: "newSeason",
        value: function newSeason() {
          var _this$division = this.division,
              landTiles = _this$division.landTiles,
              harvest = _this$division.harvest;
          this.harvest = this.generateHarvest(landTiles, harvest);
          this.db.object("".concat(this.divisionPath, "/landTiles")).set(Object.assign({}, this.harvest));
          console.log('NEW HARVEST: ', this.harvest);
        }
      }, {
        key: "adjustContamination",
        value: function adjustContamination(level) {
          var _this16 = this;

          console.log('adjust contam');
          this.contamination = level;

          if (this.harvest) {
            var cardIndexes = this.harvest.map(function (tile, index) {
              return tile.value == src_app_interfaces__WEBPACK_IMPORTED_MODULE_2__["LandCardValues"].EMPTY ? -1 : index;
            }).filter(function (value) {
              return value !== -1;
            });
            var contaminantsCount = Math.ceil(this.contamination / 100 * cardIndexes.length);
            var currentContaminantIndexes = this.harvest.map(function (tile, index) {
              return tile.value === src_app_interfaces__WEBPACK_IMPORTED_MODULE_2__["LandCardValues"].CONTAM ? index : -1;
            }).filter(function (value) {
              return value !== -1;
            });
            var adjustment = contaminantsCount - currentContaminantIndexes.length;
            console.log({
              cardIndexes: cardIndexes,
              contaminantsCount: contaminantsCount,
              current: currentContaminantIndexes.length,
              adjustment: adjustment
            });

            if (adjustment > 0) {
              var contaminate = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_1__["pluckRandom"])(Object(lodash__WEBPACK_IMPORTED_MODULE_3__["difference"])(cardIndexes, currentContaminantIndexes), Math.min(adjustment, cardIndexes.length));
              console.log('add contams: ', contaminate);
              contaminate.forEach(function (i) {
                if (!_this16.harvest[i].harvested) {
                  _this16.harvest[i].value = src_app_interfaces__WEBPACK_IMPORTED_MODULE_2__["LandCardValues"].CONTAM;
                }
              });
            } else if (adjustment < 0) {
              var uncontaminate = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_1__["pluckRandom"])(currentContaminantIndexes, Math.min(Math.abs(adjustment), currentContaminantIndexes.length));
              console.log('Remove contams: ', uncontaminate);
              uncontaminate.forEach(function (i) {
                if (!_this16.harvest[i].harvested) {
                  _this16.harvest[i].value = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_1__["getRandomInt"])(1, 3);
                }
              });
            }
          }
        }
      }, {
        key: "generateHarvest",
        value: function generateHarvest(landTiles, harvestableCards) {
          var tiles = _toConsumableArray(this.resetLandTiles(landTiles));

          var harvest = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_1__["pluckRandom"])(Object(lodash__WEBPACK_IMPORTED_MODULE_3__["range"])(tiles.length), harvestableCards);
          var contaminantsCount = Math.ceil(this.contamination / 100 * harvestableCards);
          var contaminants = Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_1__["pluckRandom"])(harvest, contaminantsCount);
          harvest.forEach(function (i) {
            tiles[i].value = Object(lodash__WEBPACK_IMPORTED_MODULE_3__["includes"])(contaminants, i) ? 0 : Object(src_app_utilties__WEBPACK_IMPORTED_MODULE_1__["getRandomInt"])(1, 3);
          });
          return tiles;
        }
      }, {
        key: "resetLandTiles",
        value: function resetLandTiles(tiles) {
          return tiles.map(function (tile) {
            return Object.assign(Object.assign({}, tile), {
              value: -1,
              contaminated: false,
              mark: null,
              harvested: false
            });
          });
        }
      }]);

      return HostComponent;
    }();

    HostComponent.ɵfac = function HostComponent_Factory(t) {
      return new (t || HostComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_fire_database__WEBPACK_IMPORTED_MODULE_4__["AngularFireDatabase"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]));
    };

    HostComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: HostComponent,
      selectors: [["app-host"]],
      decls: 6,
      vars: 5,
      consts: [[4, "ngIf"], ["details", "full", 3, "division", 4, "ngIf"], [3, "click"], [3, "markCards", "showId", "updatePath"], ["details", "full", 3, "division"]],
      template: function HostComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, HostComponent_span_0_Template, 2, 1, "span", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "hr");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, HostComponent_app_society_summary_2_Template, 1, 1, "app-society-summary", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "button", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function HostComponent_Template_button_click_3_listener() {
            return ctx.newSeason();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "New Season");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "app-land-grid", 3);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.contamination !== undefined);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.division);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("markCards", true)("showId", ctx.showId)("updatePath", ctx.landTilesPath);
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _components_land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_7__["LandGridComponent"], _components_society_summary_society_summary_component__WEBPACK_IMPORTED_MODULE_8__["SocietySummaryComponent"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL2hvc3QvaG9zdC5jb21wb25lbnQuc2NzcyJ9 */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](HostComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-host',
          templateUrl: './host.component.html',
          styleUrls: ['./host.component.scss']
        }]
      }], function () {
        return [{
          type: _angular_fire_database__WEBPACK_IMPORTED_MODULE_4__["AngularFireDatabase"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/pages/pages.module.ts": function srcAppPagesPagesModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PagesModule", function () {
      return PagesModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _host_host_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./host/host.component */
    "./src/app/pages/host/host.component.ts");
    /* harmony import */


    var _central_central_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./central/central.component */
    "./src/app/pages/central/central.component.ts");
    /* harmony import */


    var _player_player_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./player/player.component */
    "./src/app/pages/player/player.component.ts");
    /* harmony import */


    var _components_components_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../components/components.module */
    "./src/app/components/components.module.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @fortawesome/angular-fontawesome */
    "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");

    var pages = [_central_central_component__WEBPACK_IMPORTED_MODULE_2__["CentralComponent"], _host_host_component__WEBPACK_IMPORTED_MODULE_1__["HostComponent"], _player_player_component__WEBPACK_IMPORTED_MODULE_3__["PlayerComponent"]];

    var PagesModule = function PagesModule() {
      _classCallCheck(this, PagesModule);
    };

    PagesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: PagesModule
    });
    PagesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function PagesModule_Factory(t) {
        return new (t || PagesModule)();
      },
      imports: [[_components_components_module__WEBPACK_IMPORTED_MODULE_4__["ComponentsModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeModule"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](PagesModule, {
        declarations: [_central_central_component__WEBPACK_IMPORTED_MODULE_2__["CentralComponent"], _host_host_component__WEBPACK_IMPORTED_MODULE_1__["HostComponent"], _player_player_component__WEBPACK_IMPORTED_MODULE_3__["PlayerComponent"]],
        imports: [_components_components_module__WEBPACK_IMPORTED_MODULE_4__["ComponentsModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeModule"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]],
        exports: [_central_central_component__WEBPACK_IMPORTED_MODULE_2__["CentralComponent"], _host_host_component__WEBPACK_IMPORTED_MODULE_1__["HostComponent"], _player_player_component__WEBPACK_IMPORTED_MODULE_3__["PlayerComponent"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PagesModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_components_components_module__WEBPACK_IMPORTED_MODULE_4__["ComponentsModule"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_6__["FontAwesomeModule"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]],
          declarations: [].concat(pages),
          exports: [].concat(pages)
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/pages/player/player.component.ts": function srcAppPagesPlayerPlayerComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlayerComponent", function () {
      return PlayerComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var src_app_components_player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! src/app/components/player-deck/player-deck.component */
    "./src/app/components/player-deck/player-deck.component.ts");
    /* harmony import */


    var src_app_components_land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! src/app/components/land-grid/land-grid.component */
    "./src/app/components/land-grid/land-grid.component.ts");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var src_app_interfaces__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! src/app/interfaces */
    "./src/app/interfaces.ts");
    /* harmony import */


    var _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @fortawesome/free-solid-svg-icons */
    "./node_modules/@fortawesome/free-solid-svg-icons/index.es.js");
    /* harmony import */


    var _angular_fire_database__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/fire/database */
    "./node_modules/@angular/fire/__ivy_ngcc__/fesm2015/angular-fire-database.js");
    /* harmony import */


    var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! @angular/material/bottom-sheet */
    "./node_modules/@angular/material/__ivy_ngcc__/fesm2015/bottom-sheet.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! @fortawesome/angular-fontawesome */
    "./node_modules/@fortawesome/angular-fontawesome/__ivy_ngcc__/fesm2015/angular-fontawesome.js");

    function PlayerComponent_ng_template_10_div_2_Template(rf, ctx) {
      if (rf & 1) {
        var _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PlayerComponent_ng_template_10_div_2_Template_div_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);

          var ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r5.explore();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "fa-icon", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Explore (e) ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", ctx_r3.exploreIcon);
      }
    }

    function PlayerComponent_ng_template_10_div_3_Template(rf, ctx) {
      if (rf & 1) {
        var _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 7);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PlayerComponent_ng_template_10_div_3_Template_div_click_0_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);

          var ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r7.gather();
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "fa-icon", 8);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Gather (g) ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", ctx_r4.gatherIcon);
      }
    }

    function PlayerComponent_ng_template_10_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 5);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, PlayerComponent_ng_template_10_div_2_Template, 3, 1, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, PlayerComponent_ng_template_10_div_3_Template, 3, 1, "div", 6);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.message, " ");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.status) === "explorable");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.status) === "explored" || (ctx_r2.selectedResourceStatus == null ? null : ctx_r2.selectedResourceStatus.status) === "explorable");
      }
    }

    var KEY_CODE = {
      e: 69,
      g: 71
    };

    var PlayerComponent = /*#__PURE__*/function () {
      function PlayerComponent(db, _bottomSheet, route) {
        _classCallCheck(this, PlayerComponent);

        this.db = db;
        this._bottomSheet = _bottomSheet;
        this.route = route;
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.division = 'N'; // ICONS

        this.exploreIcon = _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faEye"];
        this.gatherIcon = _fortawesome_free_solid_svg_icons__WEBPACK_IMPORTED_MODULE_6__["faShoppingBag"];
      }

      _createClass(PlayerComponent, [{
        key: "keyEvent",
        value: function keyEvent(event) {
          if (event.keyCode === KEY_CODE.e) {
            this.explore();
          } else if (event.keyCode === KEY_CODE.g) {
            this.gather();
          }
        }
      }, {
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this$route$snapshot$ = this.route.snapshot.params,
              show = _this$route$snapshot$.show,
              division = _this$route$snapshot$.division,
              id = _this$route$snapshot$.id;
          var showPath = "shows/".concat(show);
          this.showId = show;
          this.id = id;
          this.landTilesPath = "".concat(showPath, "/divisions/").concat(division, "/landTiles");
        }
      }, {
        key: "onGather",
        value: function onGather(card) {
          this.playerDeck.add(card);
        }
      }, {
        key: "onSelect",
        value: function onSelect(card) {
          var _this17 = this;

          this.selectedCard = card;
          this.actionSheet = this._bottomSheet.open(this.sheetTemplate);
          this.selectedResourceStatus = this.getResourceStatus(card);
          this.actionSheet.afterDismissed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(function () {
            if (_this17.selectedCard) {
              _this17.landGrid.clearSelection(_this17.selectedCard.index);
            }
          });
        }
      }, {
        key: "getResourceStatus",
        value: function getResourceStatus(card) {
          if (card === undefined) {
            return;
          }

          if (!card.harvested) {
            return {
              status: 'explorable'
            };
          } else if (card.value == src_app_interfaces__WEBPACK_IMPORTED_MODULE_5__["LandCardValues"].CONTAM) {
            return {
              status: 'contaminated',
              message: 'This land is contaminated'
            };
          } else if (card.owner) {
            var ownedBy = card.owner.division == card.owner.name ? 'a member of the ' + card.owner.division + ' division' : 'player ' + card.owner.name;
            return {
              status: 'owned',
              message: 'This land is owned by ' + ownedBy
            };
          }

          return {
            status: 'explored'
          };
        }
      }, {
        key: "buy",
        value: function buy(item) {
          this.playerDeck.spend(item.cost);
        }
      }, {
        key: "explore",
        value: function explore() {
          console.log('explore');
          this.landGrid.explore(this.selectedCard);
          this.actionSheet.dismiss();
        }
      }, {
        key: "gather",
        value: function gather() {
          var _a;

          var status = (_a = this.selectedResourceStatus) === null || _a === void 0 ? void 0 : _a.status;

          if (status === 'explorable' || status === 'explored') {
            this.landGrid.gather(this.selectedCard);
          }

          this.actionSheet.dismiss();
        }
      }]);

      return PlayerComponent;
    }();

    PlayerComponent.ɵfac = function PlayerComponent_Factory(t) {
      return new (t || PlayerComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_fire_database__WEBPACK_IMPORTED_MODULE_7__["AngularFireDatabase"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_8__["MatBottomSheet"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"]));
    };

    PlayerComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PlayerComponent,
      selectors: [["app-player"]],
      viewQuery: function PlayerComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](src_app_components_player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_1__["PlayerDeckComponent"], true);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](src_app_components_land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_2__["LandGridComponent"], true);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"], true);
        }

        if (rf & 2) {
          var _t;

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.playerDeck = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.landGrid = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.sheetTemplate = _t.first);
        }
      },
      hostBindings: function PlayerComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keyup", function PlayerComponent_keyup_HostBindingHandler($event) {
            return ctx.keyEvent($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveWindow"]);
        }
      },
      decls: 12,
      vars: 7,
      consts: [[3, "markCards", "updatePath", "showId", "playerId", "gatherResource", "select"], ["landGrid", ""], [3, "id", "division"], [3, "click"], ["tileSelectSheet", ""], [1, "action-sheet"], ["class", "large-action-button", 3, "click", 4, "ngIf"], [1, "large-action-button", 3, "click"], ["size", "lg", 3, "icon"]],
      template: function PlayerComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "app-land-grid", 0, 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("gatherResource", function PlayerComponent_Template_app_land_grid_gatherResource_1_listener($event) {
            return ctx.onGather($event);
          })("select", function PlayerComponent_Template_app_land_grid_select_1_listener($event) {
            return ctx.onSelect($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "app-player-deck", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PlayerComponent_Template_button_click_4_listener() {
            return ctx.buy({
              cost: 2
            });
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Spend $2");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "button", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PlayerComponent_Template_button_click_6_listener() {
            return ctx.buy({
              cost: 5
            });
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "Spend $5");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "button", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PlayerComponent_Template_button_click_8_listener() {
            return ctx.buy({
              cost: 6
            });
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Spend $6");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, PlayerComponent_ng_template_10_Template, 4, 3, "ng-template", null, 4, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("DIVISION: ", ctx.division, " ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("markCards", false)("updatePath", ctx.landTilesPath)("showId", ctx.showId)("playerId", ctx.id);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx.id)("division", ctx.division);
        }
      },
      directives: [src_app_components_land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_2__["LandGridComponent"], src_app_components_player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_1__["PlayerDeckComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_10__["NgIf"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_11__["FaIconComponent"]],
      styles: [".resource[_ngcontent-%COMP%] {\n  display: block;\n}\n.resource.one[_ngcontent-%COMP%] {\n  background: #3f7ba3;\n}\n.resource.two[_ngcontent-%COMP%] {\n  background: #8148a7;\n}\n.resource.three[_ngcontent-%COMP%] {\n  background: #a74578;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYW1tYWNraW5ub24vcHJvamVjdHMvbmV3c29jaWV0aWVzL3NyYy9hcHAvcGFnZXMvcGxheWVyL3BsYXllci5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvcGFnZXMvcGxheWVyL3BsYXllci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7QUNDRjtBRENFO0VBQ0UsbUJBQUE7QUNDSjtBRENFO0VBQ0UsbUJBQUE7QUNDSjtBRENFO0VBQ0UsbUJBQUE7QUNDSiIsImZpbGUiOiJzcmMvYXBwL3BhZ2VzL3BsYXllci9wbGF5ZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucmVzb3VyY2Uge1xuICBkaXNwbGF5OiBibG9jaztcblxuICAmLm9uZSB7XG4gICAgYmFja2dyb3VuZDogIzNmN2JhMztcbiAgfVxuICAmLnR3byB7XG4gICAgYmFja2dyb3VuZDogIzgxNDhhNztcbiAgfVxuICAmLnRocmVlIHtcbiAgICBiYWNrZ3JvdW5kOiAjYTc0NTc4O1xuICB9XG59XG4iLCIucmVzb3VyY2Uge1xuICBkaXNwbGF5OiBibG9jaztcbn1cbi5yZXNvdXJjZS5vbmUge1xuICBiYWNrZ3JvdW5kOiAjM2Y3YmEzO1xufVxuLnJlc291cmNlLnR3byB7XG4gIGJhY2tncm91bmQ6ICM4MTQ4YTc7XG59XG4ucmVzb3VyY2UudGhyZWUge1xuICBiYWNrZ3JvdW5kOiAjYTc0NTc4O1xufSJdfQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PlayerComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-player',
          templateUrl: './player.component.html',
          styleUrls: ['./player.component.scss']
        }]
      }], function () {
        return [{
          type: _angular_fire_database__WEBPACK_IMPORTED_MODULE_7__["AngularFireDatabase"]
        }, {
          type: _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_8__["MatBottomSheet"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"]
        }];
      }, {
        playerDeck: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: [src_app_components_player_deck_player_deck_component__WEBPACK_IMPORTED_MODULE_1__["PlayerDeckComponent"], {
            "static": false
          }]
        }],
        landGrid: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: [src_app_components_land_grid_land_grid_component__WEBPACK_IMPORTED_MODULE_2__["LandGridComponent"], {
            "static": false
          }]
        }],
        sheetTemplate: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"], {
            "static": false
          }]
        }],
        keyEvent: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"],
          args: ['window:keyup', ['$event']]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/utilties.ts": function srcAppUtiltiesTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "shuffle", function () {
      return shuffle;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getRandomInt", function () {
      return getRandomInt;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "pluckRandom", function () {
      return pluckRandom;
    });
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! lodash */
    "./node_modules/lodash/lodash.js");
    /* harmony import */


    var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref3 = [a[j], a[i]];
        a[i] = _ref3[0];
        a[j] = _ref3[1];
      }

      return a;
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pluckRandom(array, total) {
      var plucked = [];

      if (total > array.length) {
        console.error('pluck random: "total" cannot be greater than length of array to pluck from');
        return array;
      }

      while (plucked.length < total) {
        var value = array[getRandomInt(0, array.length - 1)];

        if (!Object(lodash__WEBPACK_IMPORTED_MODULE_0__["includes"])(plucked, value)) {
          plucked.push(value);
        }
      }

      return plucked;
    }
    /***/

  },

  /***/
  "./src/environments/environment.ts": function srcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    }); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.


    var environment = {
      production: false,
      firebase: {
        apiKey: "AIzaSyAN_zOphtFT2At-ZHMYYacm-xmTSJvCyoU",
        authDomain: "new-societies-8049d.firebaseapp.com",
        projectId: "new-societies-8049d",
        storageBucket: "new-societies-8049d.appspot.com",
        messagingSenderId: "375668793661",
        appId: "1:375668793661:web:0a818f374766b6e353e554",
        measurementId: "G-2RV4B8YR29"
      }
    };
    /*
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "./src/main.ts": function srcMainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./app/app.module */
    "./src/app/app.module.ts");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");

    if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
    }

    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])["catch"](function (err) {
      return console.error(err);
    });
    /***/

  },

  /***/
  0: function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! /Users/sammackinnon/projects/newsocieties/src/main.ts */
    "./src/main.ts");
    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map