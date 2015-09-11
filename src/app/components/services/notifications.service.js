(function() {
    'use strict';

    var notificationModule = angular.module('readerApp.service.notification', []);

    notificationModule.controller('NotificationController', NotificationController);

    NotificationController.$inject = ['$scope', 'model'];
    function NotificationController($scope, model) {
        $scope.isSuccess = (model.notifyType === 'success');
        $scope.isError = (model.notifyType === 'error');
        $scope.isInfo = (model.notifyType === 'info');

        $scope.message = model.message;
        $scope.title = model.title;
    }

    notificationModule.provider("notificationMessage", notificationMessage);
    function notificationMessage() {

        // default notification message settings
        var defaults = {
                autoClose: 6000,
                template:   '<div class="sr-notification-inner" ng-class="{\'-success\': isSuccess, \'-error\': isError, \'-info\': isInfo}">' +
                                '<i class="sr-icon" ng-class="{\'icon-warning\': isError, \'icon-info\': isInfo}"></i>' +
                                '<span class="notification-title" ng-bind-html="title"></span>' +
                                '<span class="notification-content" ng-bind-html="message"></span>' +
                            '</div>'
            };

        getNotification.$inject = ['$http', '$document', '$compile', '$rootScope',
            '$controller', '$templateCache', '$q', '$injector', '$timeout'];

        return {
            $get: getNotification
        };

        function getNotification($http, $document, $compile, $rootScope, $controller, $templateCache, $q, $injector, $timeout) {

            var body = $document.find('body'),
                notifyContainer = angular.element('<div>');
            notifyContainer.addClass('sr-notification');
            body.append(notifyContainer);

            function Notification(opts) {
                var self = this;

                this.options = angular.extend({}, defaults, opts);
                this.open = false;
                this.closeTimeout = null;
                this.popupEl = angular.element('<div>');

                this.handleClose = function () {
                    self._close();
                };
            }

            Notification.prototype.show = function (templateUrl, controller) {
                var self = this,
                    options = this.options;

                if (templateUrl) {
                    options.templateUrl = templateUrl;
                }
                if (controller) {
                    options.controller = controller;
                }

                if (!(options.template || options.templateUrl)) {
                    throw new Error('notificationMessage.show expected template or templateUrl, neither found. ' +
                        'Use options or open method to specify them.');
                }

                /**
                 * Extend NotificationController with
                 */
                this._loadResolves().then(function (locals) {
                    var $scope = locals.$scope = self.$scope = locals.$scope ? locals.$scope : $rootScope.$new();

                    self.popupEl.html(locals.$template);

                    if (self.options.controller) {
                        var ctrl = $controller(self.options.controller, locals);
                        self.popupEl.children().data('ngControllerController', ctrl);
                    }

                    $compile(self.popupEl)($scope);
                    self._addElementsToDom();
                    self._bindEvents();
                });

                this._autoClose();

                this.deferred = $q.defer();
                return this.deferred.promise;
            };

            Notification.prototype.isOpen = function () {
                return this.open;
            };


            /**
             * Close notification message.
             */
            Notification.prototype._close = function () {
                if (this.open) {
                    this._onCloseComplete();
                }
            };

            /**
             * Auto close notification message after specified time.
             * @private
             */
            Notification.prototype._autoClose = function () {
                var self = this;
                if (this.options.autoClose && this.options.autoClose > 0 && this.popupEl !== null) {
                    this.closeTimeout = $timeout(function () {
                        self._close();
                    }, this.options.autoClose);
                }
            };

            /**
             * Set events.
             * @private
             */
            Notification.prototype._bindEvents = function () {
                this.$scope.$on('$locationChangeSuccess', this.handleClose);
            };

            /**
             * Clean up element once when "_autoClose" time has been expired.
             * @private
             */
            Notification.prototype._onCloseComplete = function () {
                var self = this;

                self._removeElementsFromDom();
            };

            /**
             * Add new notification to notification container.
             * @private
             */
            Notification.prototype._addElementsToDom = function () {
                notifyContainer.append(this.popupEl);
                this.open = true;
            };

            /**
             * Remove notification from notification container.
             * @private
             */
            Notification.prototype._removeElementsFromDom = function () {
                this.popupEl.remove();
                this.open = false;
            };

            /**
             * Load notification template and prepare all other parameters.
             * @returns {*}
             * @private
             */
            Notification.prototype._loadResolves = function () {
                var self = this,
                    values = [],
                    keys = [],
                    templatePromise;

                if (this.options.template) {
                    templatePromise = $q.when(this.options.template);
                } else if (this.options.templateUrl) {
                    templatePromise = $http.get(this.options.templateUrl, {cache: $templateCache})
                        .then(function (response) {
                            return response.data;
                        });
                }

                angular.forEach(this.options.resolve || [], function (value, key) {
                    keys.push(key);
                    values.push(angular.isString(value) ? $injector.get(value) : $injector.invoke(value));
                });

                keys.push('$template');
                values.push(templatePromise);

                return $q.all(values).then(function (values) {
                    var locals = {};

                    angular.forEach(values, function (value, index) {
                        locals[keys[index]] = value;
                    });

                    locals.notification = self;
                    return locals;
                });
            };

            var getInstance = function (message, type) {
                return new Notification ({
                    controller: 'NotificationController',
                    resolve: {
                        model: function () {
                            return {
                                notifyType: type,
                                message: message
                            };
                        }
                    }
                });
            };

            return {
                success: function (message) {
                    getInstance(message, 'success').show();
                },
                error: function (message) {
                    getInstance(message, 'error').show();
                },
                info: function (message) {
                    getInstance(message, 'info').show();
                }
            };
        }
    }



})();