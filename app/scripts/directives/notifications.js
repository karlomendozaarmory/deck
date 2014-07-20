'use strict';

angular.module('deckApp')
  .directive('notifications', function($exceptionHandler) {
    return {
      scope: {},
      restrict: 'E',
      replace: true,
      templateUrl: 'views/notifications.html',
      controller: function($scope, notifications) {
        var addNotificationProps = function(notificationsObj) {
          return Object.defineProperties(notificationsObj, {
            unread: {
              get: function() {
                return this.filter(function(notification) {
                  return !notification.$read;
                }).length;
              },
            },
            hasUnread: {
              get: function() {
                return this.unread > 0;
              },
            },
            onView: {
              value: function() {
                this.forEach(function(notification) {
                  notification.$read = true;
                });
              },
            },
            active: {
              get: function() {
                return addNotificationProps(this.filter(function(notification) {
                  return !notification.$dismissed;
                }));
              },
            },
          });
        };

        $scope.notifications = addNotificationProps([
          {
            title: 'testing',
            $done: false,
            href: '/',
            $success: false,
            message: 'still testing',
          }
        ]);

        notifications.subscribe(function(notification) {
          Object.defineProperties(notification, {
            $read: {
              value: false,
              writable: true,
            },
            $dismissed: {
              value: false,
              writable: true,
            },
            dismiss: {
              value: function() {
                this.$dismissed = true;
              },
            },
          });

          $scope.notifications.push(notification);
        }, function(err) {
          $exceptionHandler(err);
        });
      },
    };
  });
