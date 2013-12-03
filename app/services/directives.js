(function() {
    'use strict';

    var app = angular.module('app');

    app.directive('ccSidebar', ['$window', function ($window) {
        // Repositions the sidebar on window resize 
        // and opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        var $win = $($window);
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $win.resize(resize);
            $dropdownElement.click(dropdown);

            function resize() {
                $win.width() >= 765 ? $sidebarInner.slideDown(350) : $sidebarInner.slideUp(350);
            }

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    }]);

    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="icon-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="icon-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="icon-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="icon-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('icon-chevron-up');
                    iElement.addClass('icon-chevron-down');
                } else {
                    iElement.removeClass('icon-chevron-down');
                    iElement.addClass('icon-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="icon-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="icon-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown(): element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function() {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    /////////////////////////////////

    app.directive('treeNode', function ($compile) {

        /**
         * Add node to the tree
         * @param treeNode
         */
        var addTreeNode = function (treeNode) {
            treeNode.children.push({
                name: 'task' + parseInt(treeNode.children.length + 1),
                checked: false,
                children: []
            });
        };

        /**
         * Remove node from tree
         * @param parentNode
         * @param index
         */
        var removeTreeNode = function (parentNode, index) {
            if (parentNode) {
                parentNode.children.splice(index, 1);
            }
        };

        return {
            restrict: "A",
            replace: true,
            scope: {
                parentNode: "=",
                treeNode: "=",
                treeNodeIndex: "=",
                isShown: "="
            },
            template:
                '<li data-ng-hide="treeNode.checked && !isShown">' +
                    '<label>' +
                        '<input type="checkbox" data-ng-model="treeNode.checked">{{ treeNode.name }}' +
                        '<button data-ng-click="addTreeNode(treeNode)">+</button>' +
                        '<button data-ng-show="parentNode" data-ng-click="removeTreeNode(parentNode, treeNodeIndex)">' +
                            '-' +
                        '</button>' +
                    '</label>' +
                '</li>',

            link: function (scope, element) {

                scope.addTreeNode = addTreeNode;
                scope.removeTreeNode = removeTreeNode;

                var $nodes = $compile(
                    '<ul>' +
                        '<li data-ng-repeat="node in treeNode.children" data-is-shown="isShown"' +
                            'data-parent-node="treeNode" data-tree-node="node" data-tree-node-index="$index">' +
                        '</li>' +
                    '</ul>'
                )(scope);

                element.append($nodes);
            }
        }
    });


})();