(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular-schema-form'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular-schema-form'));
    } else {
        root.angularSchemaFormMultiSelectTree = factory(root.schemaForm);
    }
}(this, function (schemaForm) {
    angular.module("schemaForm").run(["$templateCache", function ($templateCache) {
        $templateCache.put('directives/decorators/tree-select/tree-select.html',
            '<div class="form-group {{form.htmlClass}}" ng-controller="multiSelectTreeController">' +
            '   <div class="row" ng-class="{\'has-error\': hasError(), \'has-success\': hasSuccess()}">' +
            '       <label class="control-label col-sm-2 {{form.labelHtmlClass}}" ng-show="showTitle()">' +
            '           {{form.title}}' +
            '       </label>' +
            '       <div class="tree-control col-sm-10">' +
            '           <div class="col-sm-7 {{form.fieldHtmlClass}}">' +
            '               <button gm-multi-select-tree type="button" ng-click="onControlClicked()" class="btn btn-select form-control" ng-disabled="form.readonly"' +
            '                       data-placeholder="form.placeholder" ng-model="$$value$$" sf-changed="form" schema-validate="form" ng-model-options="form.ngModelOptions"' +
            '                       data-multi-select="form.options.multiple" ng-init="populateTitleMap(form)" name="{{form.key.slice(-1)[0]}}">' +
            '                   <i class=\"fa fa-spinner fa-spin fa-fw\" ng-if="loading"></i> {{showDropdownLabel()}}' +
            '                   <span class="caret"></span>' +
            '               </button>' +
            '           </div>' +
            '           <div class="tree-view" ng-if="showTree">' +
            '               <div class="border-bottom padding-top">' +
            '                   <div class="line">' +
            '                       <div class="tree-form-group">' +
            '                           <div class="row">' +
            '                               <div class="col-md-6">' +
            '                                   <div class="btn-group">' +
            '                                       <a class="btn btn-original btn-default active" ng-click="showAll($event)">Show All</a>' +
            '                                       <a class="btn btn-original btn-default" ng-click="showSelected($event)">Selected</a>' +
            '                                   </div>' +
            '                               </div>' +
            '                               <div class="col-md-6 text-right" ng-if="totalNumberItems">' +
            '                                   <span>{{totalNumberItems}} Item{{{true:"s", false:""}[totalNumberItems > 1]}} | {{{true: totalNumberItems, false: selectedItems.length}[allSelected]}} Selected</span>' +
            '                               </div>' +
            '                           </div>' +
            '                       </div>' +
            '                       <div class="tree-form-group">' +
            '                           <div class="row">' +
            '                               <div class="col-md-12">' +
            '                                   <div class="input-group">' +
            '                                       <input placeholder="Search..." type="text" ng-model="pagination.query"' +
            '                                              ng-change="queryChanged()" class="form-control form-control-original" ng-model-options="{debounce: 750}">' +
            '                                       <span class="input-group-btn" ng-click="clearFilter()">' +
            '                                           <button class="btn btn-original btn-default" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '                                       </span>' +
            '                                   </div>' +
            '                               </div>' +
            '                           </div>' +
            '                       </div>' +
            '                       <div class="tree-form-group">' +
            '                           <div class="row">' +
            '                               <div class="col-md-12">' +
            '                                   <div class="btn-group" ng-if="form.options.multiple">' +
            '                                       <a class="btn btn-original btn-default" ng-click="selectAll()">Select All</a>' +
            '                                       <a class="btn btn-original btn-default" ng-click="selectNone()">None</a>' +
            '                                   </div>' +
            '                               </div>' +
            '                           </div>' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '               <div class="tree-container">' +
            '                   <div class="tree-parent-node" ' +
            '                        infinite-scroll="nextPage()"' +
            '                        infinite-scroll-disabled="busy"' +
            '                        infinite-scroll-container="\'.tree-container\'">' +
            '                       <gm-tree-item class="top-level" ng-repeat="item in form.titleMap" item="item" ng-show="!item.isFiltered"' +
            '                                     can-select-item="canSelectItem" multi-select="form.options.multiple" item-clicked="itemClicked(item)"' +
            '                                     on-active-item="onActiveItem(item)" select-only-leafs="selectOnlyLeafs">' +
            '                       </gm-tree-item>' +
            '                       <div style="clear: both;"></div>' +
            '                       <div class="tree-child-node" ng-if="form.titleMap.length === 0 && !loading">No data available</div>' +
            '                       <div class="tree-child-node alert alert-danger" ng-if="error">' +
            '                           <i class=\"glyphicon glyphicon-exclamation-sign\"></i> Something went wrong' +
            '                       </div>' +
            '                       <div class="tree-child-node" ng-if="!form.titleMap && loading">' +
            '                           <i class=\"fa fa-spinner fa-spin fa-fw\"></i> Loading data...' +
            '                       </div>' +
            '                       <div class="tree-child-node" ng-if="totalNumberItems > form.titleMap.length && busy && !showSelectedOnly" ng-click="nextPage()">' +
            '                           <i class=\"fa fa-spinner fa-spin fa-fw\"></i> Loading more data... ({{totalNumberItems}} total)' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '               <div class="tree-form-group border-top padding-top">' +
            '                   <div class="row text-right">' +
            '                       <div class="col-md-12">' +
            '                           <a class="btn btn-original btn-default" ng-click="cancel()">Cancel</a>' +
            '                           <a class="btn btn-original btn-default" ng-click="done()">Done</a>' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '           <div class="tooltip-mark col-sm-1">' +
            '               <span ng-if="form.tooltip.content != null && form.tooltip.content != \'\'" class="glyphicon glyphicon-question-sign clickable"' +
            '                     ng-attr-tooltip-trigger="outsideClick" ng-attr-tooltip-placement="{{form.tooltip.position}}" ng-attr-uib-tooltip="{{form.tooltip.content}}"></span>' +
            '           </div>' +
            '           <div class="help-block col-sm-3" sf-message="form.description"></div>' +
            '           <div class="col-sm-1">' +
            '               <span ng-if="form.feedback !== false" class="form-control-feedback"' +
            '                     ng-class="evalInScope(form.feedback) || {\'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError() }"></span>' +
            '           </div>' +
            '       </div>' +
            '   </gm-multi-select-tree>' +
            '</div>'
        );

        $templateCache.put('directives/decorators/tree-select/tree-item.tpl.html',
            '<div class="tree-child-node">' +
            '   <div class="item-container" ng-class="{active: item.isActive, selected: item.selected}"' +
            '        ng-click="clickSelectItem(item)" ng-mouseover="onMouseOver(item)">' +
            '       <span ng-if="showExpand(item)" class="expand" ng-class="{\'expand-opened\': item.isExpanded}"' +
            '             ng-click="onExpandClicked(item)"></span>' +
            '       <div class="item-details">' +
            '           <input class="tree-checkbox" type="checkbox" ng-if="showCheckbox()"' +
            '                  ng-checked="item.selected"/>{{item.name}}' +
            '       </div>' +
            '   </div>' +
            '   <div class="tree-parent-node" ng-repeat="child in item.children" ng-if="item.isExpanded">' +
            '       <gm-tree-item item="child" item-clicked="subItemClicked(item)"' +
            '                     can-select-item="canSelectItem" multi-select="multiSelect"' +
            '                     on-active-item="activeSubItem(item)"></gm-tree-item>' +
            '    </div>' +
            '</div>'
        );
    }]);

    /**
     * Controller for multi select tree.
     */
    angular.module('schemaForm').controller('multiSelectTreeController', [
        '$rootScope', '$scope', '$http',
        function ($rootScope, $scope, $http) {
            function initSelectedItems() {
                if (!$scope.model) return [];
                if (!$scope.model.hasOwnProperty($scope.form.key)) return [];
                return $scope.model[$scope.form.key].map(function (item) {
                    return {
                        value: item
                    }
                });
            }

            var activeItem;
            $scope.allSelected = false;
            $scope.showTree = false;
            $scope.showSelectedOnly = false;
            $scope.selectedItems = initSelectedItems();
            $scope.previousItems = [];
            $scope.previousTitleMap = [];
            $scope.allItems = [];
            $scope.busy = false;
            $scope.loading = false;
            $scope.isQueried = false;
            $scope.multiSelect = $scope.form.options.multiple || false;
            $scope.selectOnlyLeafs = $scope.form.selectOnlyLeafs || false;
            $scope.form.options = $scope.form.options || {}
            $scope.form.options.scope = $scope;
            $scope.pagination = {
                pageIndex: 0,
                maxItems: $scope.form.maxItems || 20,
                query: ''
            }

            $scope.getCallback = function (callback) {
                if (typeof (callback) == "string") {
                    var _result = $scope.$parent.evalExpr(callback);
                    if (typeof (_result) == "function") {
                        return _result;
                    } else {
                        throw ("A callback string must match name of a function in the parent scope");
                    }
                } else if (typeof (callback) == "function") {
                    return callback;
                } else {
                    throw ("A callback must either be a string matching the name of a function in the parent scope or a " +
                        "direct function reference");
                }
            };

            function triggerEvent(form, value) {
                if (form.options.hasOwnProperty("registerEvents") && form.options.registerEvents) {
                    form.options.registerEvents.forEach(function (event) {
                        console.log("Register event with name: " + event);
                        $rootScope.$broadcast(event, value);
                    });
                }
            }

            function getDataAsync(form) {
                form = form || $scope.form;
                if ($scope.listenEventsArgs.length !== form.options.listenEvents.length || !$scope.model) return;

                $scope.loading = true;
                return $scope.getCallback(form.options.asyncCallback)($scope.listenEventsArgs, {
                    pageIndex: $scope.pagination.pageIndex,
                    maxItems: $scope.pagination.maxItems,
                    query: $scope.pagination.query
                }).then(function (response) {
                    $scope.totalNumberItems = response.data.totalNumber;
                    $scope.pagination.pageIndex = response.data.pageIndex;
                    // Finalize the title map
                    $scope.finalizeTitleMap(form, response.data.results, form.options);
                    $scope.busy = false;
                    $scope.loading = false;
                },
                function (response) {
                    console.log("Loading select items failed \nError: " + JSON.stringify(response));
                    $scope.loading = false;
                    $scope.error = true;
                });
            }
            
            function isAllSelectedInSelectedItems() {
                return $scope.selectedItems && $scope.selectedItems.length === 1 && $scope.selectedItems[0].value === "0";
            }

            /**
             * Checks of the item is already selected.
             *
             * @param item the item to be checked.
             * @return {boolean} if the item is already selected.
             */
            function isItemSelected(item) {
                if ($scope.allSelected || ($scope.selectOnlyLeafs && item.children && item.children.length > 0 && item.selected)) {
                    return true;
                }

                var isSelected = false;

                if ($scope.selectedItems) {
                    for (var i = 0; i < $scope.selectedItems.length; i++) {
                        if ($scope.selectedItems[i].value === item.value) {
                            isSelected = true;
                            break;
                        }
                    }
                }
                return isSelected;
            }
            function isItemInModel(item) {
                if (!$scope.model[$scope.form.key]) return false;
                if ($scope.selectedItems.length === 1 && $scope.selectedItems[0] === "0") return true;

                for (var i in $scope.selectedItems) {
                    if (item.value === $scope.selectedItems[i].value) {
                        $scope.selectedItems[i] = item;
                        return true;
                    }
                }
                return false;
            }
            /**
             * Iterates over children and sets the selected items.
             *
             * @param children the children element.
             */
            function setSelectedItems(items, reload) {
                if (reload) $scope.selectedItems = initSelectedItems();
                $scope.allSelected = isAllSelectedInSelectedItems();

                for (var i = 0, len = items.length; i < len; i++) {
                    if (isItemInModel(items[i])) {
                        items[i].selected = true;
                    } else if (!isItemSelected(items[i]) && items[i].selected === true) {
                        $scope.selectedItems.push(items[i]);
                    } else if (isItemSelected(items[i]) && (!items[i].hasOwnProperty('selected') || items[i].selected === false)) {
                        items[i].selected = true;
                    }

                    if (items[i] && items[i].children) {
                        setSelectedItems(items[i].children);
                    }
                }
            }

            $scope.populateTitleMap = function (form, search) {
                form = form || $scope.form;
                $scope.busy = true;

                if (!form.options) {
                    console.log("multiSelectTreeController.populateTitleMap(key:" + form.key + ") : No options set, needed for dynamic tree select");
                } else if (form.options.callback) {
                    $scope.awaiting = true;
                    if (form.options.listenEvents) {
                        if (!form.options && !form.options.callback)
                            throw ("No Callback was found in the options attribute");

                        $scope.listenEventsArgs = [];

                        form.options.listenEvents.forEach(function (listenEvent) {
                            $scope.$on(listenEvent.name, function (event, args) {
                                var updatedArg = false;
                                $scope.error = false;

                                $scope.listenEventsArgs.forEach(function (arg) {
                                    if (arg.name === listenEvent.argName) {
                                        arg.value = args;
                                        updatedArg = true;
                                    }
                                });

                                if ($scope.listenEventsArgs.length !== form.options.listenEvents.length && !updatedArg)
                                    $scope.listenEventsArgs.push({ name: listenEvent.argName, value: args });

                                if ($scope.listenEventsArgs.length === form.options.listenEvents.length) {
                                    $scope.loading = true;
                                    form.titleMap = $scope.getCallback(form.options.callback)($scope.listenEventsArgs, search);
                                    $scope.finalizeTitleMap(form, form.titleMap, form.options);
                                }
                                $scope.busy = false;
                            });
                        });
                    } else {
                        $scope.loading = true;
                        form.titleMap = $scope.getCallback(form.options.callback)(form.options, search);
                        $scope.finalizeTitleMap(form, form.titleMap, form.options);
                        $scope.busy = false;
                    }
                } else if (form.options.asyncCallback) {
                    $scope.awaiting = true;
                    if (form.options.listenEvents) {
                        if (!form.options && !form.options.asyncCallback)
                            throw ("No Callback was found in the options attribute");

                        $scope.listenEventsArgs = [];
                        form.readonly = true;

                        form.options.listenEvents.forEach(function (listenEvent) {
                            $scope.$on(listenEvent.name, function (event, args) {
                                if (args) {
                                    var updatedArg = false;

                                    $scope.listenEventsArgs.forEach(function (arg) {
                                        if (arg.name === listenEvent.argName) {
                                            arg.value = args;
                                            updatedArg = true;
                                        }
                                    });

                                    if ($scope.listenEventsArgs.length !== form.options.listenEvents.length && !updatedArg) {
                                        $scope.listenEventsArgs.push({ name: listenEvent.argName, value: args });
                                    }
                                }

                                if (args === false) {
                                    for (var i in $scope.listenEventsArgs) {
                                        if ($scope.listenEventsArgs[i].name === listenEvent.argName) {
                                            $scope.listenEventsArgs.splice(i, 1);
                                            form.titleMap = null;
                                            form.readonly = true;
                                            delete $scope.model[form.key];
                                            $scope.selectedItems = [];
                                            triggerEvent(form, false);
                                        }
                                    }
                                    return;
                                }

                                if (!args || $scope.listenEventsArgs.length === form.options.listenEvents.length) {
                                    getDataAsync(form);
                                    form.readonly = false;
                                }
                            });

                            var model = $scope.model;
                            if (model != null && model[listenEvent.name]) {
                                $scope.$emit(listenEvent.name, model[listenEvent.name]);
                            }
                        });
                    } else {
                        $scope.loading = true;
                        return $scope.getCallback(form.options.asyncCallback)(form.options, {
                            pageIndex: $scope.pagination.pageIndex,
                            maxItems: $scope.pagination.maxItems,
                            query: $scope.pagination.query
                        }).then(function (response) {
                            $scope.totalNumberItems = response.data.totalNumber;
                            $scope.pagination.pageIndex = response.data.pageIndex;
                            $scope.finalizeTitleMap(form, response.data.results, form.options);
                            if ($scope.ngModel.$modelValue) {
                                triggerEvent(form, $scope.ngModel.$modelValue);
                            }
                            $scope.busy = false;
                        },
                        function (response) {
                            alert("Loading select items failed \nError: " + JSON.stringify(response));
                        });
                    }
                } else if (form.options.httpPost) {
                    var finalOptions = $scope.getOptions(form.options, search);
                    return $http.post(finalOptions.httpPost.url, finalOptions.httpPost.parameter).then(
                        function (response) {
                            $scope.finalizeTitleMap(form, response.data, finalOptions);
                            console.log('httpPost items', form.titleMap);
                            $scope.busy = false;
                        },
                        function (response, status) {
                            alert("Loading select items failed (URL: '" + String(finalOptions.httpPost.url) +
                                "' Parameter: " + String(finalOptions.httpPost.parameter) + "\nError: " + status);
                        });
                } else if (form.options.httpGet) {
                    var finalOptions = $scope.getOptions(form.options, search);
                    return $http.get(finalOptions.httpGet.url, finalOptions.httpGet.parameter).then(
                        function (response) {
                            $scope.finalizeTitleMap(form, response.data, finalOptions);
                            console.log('httpGet items', form.titleMap);
                            $scope.busy = false;
                        },
                        function (response, status) {
                            alert("Loading select items failed (URL: '" + String(finalOptions.httpGet.url) +
                                "\nError: " + status);
                        });
                } else if (form.titleMap.length > 0) {
                    $scope.allItems = angular.copy(form.titleMap);
                    $scope.busy = false;
                }
            };

            // Remap the data
            $scope.finalizeTitleMap = function (form, data, newOptions) {
                var needReload = ($scope.isQueried || !form.titleMap || !$scope.busy);
                form.titleMap = needReload ? [] : form.titleMap;

                if (newOptions && "map" in newOptions && newOptions.map) {
                    var final = newOptions.map.nameProperty.length - 1,
                        separator = newOptions.map.separatorValue ? newOptions.map.separatorValue : ' - ';

                    data.forEach(function (currenRow) {
                        currenRow["value"] = currenRow[newOptions.map.valueProperty];
                        // Check if the value passed is a string or not
                        if (typeof newOptions.map.nameProperty != 'string') {
                            // Loop through the object/array
                            var newName = "";
                            for (var i in newOptions.map.nameProperty) {
                                newName += currenRow[newOptions.map.nameProperty[i]];
                                if (parseInt(i) !== final) { newName += separator };
                            }
                            currenRow["name"] = newName; // Init the 'name' property
                        }
                        else {
                            // If it is a string
                            currenRow["name"] = currenRow[newOptions.map.nameProperty];
                        }
                        form.titleMap.push(currenRow);
                    });
                }
                else {
                    data.forEach(function (item) {
                        if ("text" in item) {
                            item.name = item.text;
                        }
                    });
                    form.titleMap = data;
                }

                $scope.allItems = angular.copy(form.titleMap);
                if (!$scope.isQueried)
                    setSelectedItems(form.titleMap, needReload);
                else {
                    setSelectedItems(form.titleMap);
                    $scope.isQueried = false;
                }
                $scope.refreshOutputModel();
            };

            $scope.findInTitleMap = function (value) {
                for (var i = 0; i < $scope.form.titleMap.length; i++) {
                    if ($scope.form.titleMap[i].value === value) {
                        return { "value": $scope.form.titleMap[i].value, "name": $scope.form.titleMap[i].name }
                    }
                }
            }

            $scope.nextPage = function () {
                if ($scope.busy || (($scope.pagination.pageIndex + 1) * $scope.pagination.maxItems) > $scope.totalNumberItems) return;
                $scope.busy = true;
                $scope.pagination.pageIndex = $scope.pagination.pageIndex + 1;
                getDataAsync();
            }

            /**
             * Closes the tree popup.
             */
            function closePopup() {
                $scope.showTree = false;
                $scope.showAll();
                if (activeItem) {
                    activeItem.isActive = false;
                    activeItem = undefined;
                }
            }

            /**
             * Clicking on document will hide the tree.
             */
            $scope.docClickHide = function () {
                $scope.done();
                closePopup();
                $scope.$apply();
            }

            /**
             * Sets the active item.
             *
             * @param item the item element.
             */
            $scope.onActiveItem = function (item) {
                if (activeItem !== item) {
                    if (activeItem) {
                        activeItem.isActive = false;
                    }
                    activeItem = item;
                    activeItem.isActive = true;
                }
            };
            /**
             * Copies the selectedItems in to output model.
             */
            $scope.refreshOutputModel = function () {
                $scope.outputModel = angular.copy($scope.selectedItems);
                setSelectedItems($scope.form.titleMap);
            };

            $scope.showDropdownLabel = function () {
                return ($scope.loading) ? "Loading Data..." :
                    ($scope.selectedItems.length === 0) ? $scope.form.placeholder :
                    ($scope.allSelected) ? $scope.totalNumberItems + " items selected" :
                    $scope.selectedItems.length + " items selected";
            }
            /**
             * Refreshes the selected Items model.
             */
            $scope.refreshSelectedItems = function () {
                if ($scope.form.titleMap) {
                    setSelectedItems($scope.form.titleMap, true);
                }
            };
            /**
             * Deselect the item.
             *
             * @param item the item element
             */
            $scope.deselectItem = function (item) {
                $scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
                item.selected = false;
                this.refreshOutputModel();
            };
            /**
             * Swap the tree popup on control click event.
             */
            $scope.onControlClicked = function () {
                $scope.showTree = !$scope.showTree;
                $scope.previousItems = angular.copy($scope.selectedItems);
                $scope.previousTitleMap = angular.copy($scope.form.titleMap);
            };

            $scope.queryChanged = function () {
                $scope.pagination.pageIndex = 0;
                $scope.isQueried = true;
                getDataAsync();
            }
            /**
             * Clears the filter text.
             */
            $scope.clearFilter = function () {
                $scope.pagination.query = '';
                $scope.queryChanged();
            };
            /**
             * Wrapper function for can select item callback.
             *
             * @param item the item
             */
            $scope.canSelectItem = function (item) {
                return $scope.callback({
                    item: item,
                    selectedItems: $scope.selectedItems
                });
            };
            /**
             * The callback is used to switch the views.
             * based on the view type.
             */
            $scope.switchCurrentView = function () {
                $scope.switchViewCallback({ scopeObj: $scope });
            };

            var getLeafs = function (tree, childAttribute, array) {
                array = array || [];
                for (var i in tree) {
                    if (tree[i].hasOwnProperty(childAttribute) && tree[i][childAttribute].length > 0) {
                        array.join(getLeafs(tree[i][childAttribute], childAttribute, array));
                    } else {
                        array.push(tree[i]);
                    }
                }
                return array;
            }

            function arrayObjectIndexOf(array, value, property) {
                for (var i = 0, len = array.length; i < len; i++) {
                    if (array[i][property] === value) return i;
                }
                return -1;
            }

            /**
             * Handles the item select event.
             *
             * @param item the selected item.
             */
            $scope.itemClicked = function (item) {
                console.log($scope.model);
                if ($scope.useCallback && $scope.canSelectItem(item) === false) {
                    return;
                }

                if ($scope.allSelected) {
                    $scope.allSelected = false;
                    if ($scope.selectOnlyLeafs)
                        $scope.selectedItems = getLeafs($scope.form.titleMap, 'children');
                }

                if (!$scope.multiSelect) {
                    closePopup();
                    for (var i = 0; i < $scope.selectedItems.length; i++) {
                        $scope.selectedItems[i].selected = false;
                    }
                    item.selected = true;
                    $scope.selectedItems = [item];
                } else {
                    if (!$scope.selectOnlyLeafs || !item.children || item.children.length === 0)
                        item.selected = true;
                    var indexOfItem = arrayObjectIndexOf($scope.selectedItems, item.value, 'value');
                    if (isItemSelected(item)) {
                        item.selected = false;
                        if (!$scope.selectOnlyLeafs || !item.children || item.children.length === 0)
                            $scope.selectedItems.splice(indexOfItem, 1);
                        for (var i in item.children)
                            $scope.itemClicked(item.children[i]);
                    } else {
                        if (!$scope.selectOnlyLeafs || !item.children || item.children.length === 0)
                            $scope.selectedItems.push(item);
                        for (var i in item.children)
                            $scope.itemClicked(item.children[i]);
                    }
                }
                this.refreshOutputModel();
            };

            var setAttributeInTree = function (tree, childAttribute, attribute, value) {
                for (var i in tree) {
                    tree[i][attribute] = value;
                    if (tree[i].hasOwnProperty(childAttribute) && tree[i][childAttribute].length > 0) {
                        setAttributeInTree(tree[i].children, childAttribute, attribute, value);
                    }
                }
            }

            function makeItem(id, name) {
                return {
                    children: [],
                    id: id,
                    value: id,
                    isActive: true,
                    isExpanded: false,
                    name: name,
                    selected: true
                }
            }

            /**
             * Handles the select all event.
             */
            $scope.selectAll = function () {
                if (!$scope.multiSelect) {
                    return;
                }

                $scope.outputModel = $scope.form.titleMap;
                setAttributeInTree($scope.outputModel, 'children', 'selected', true);

                $scope.selectedItems = [makeItem("0", "All")];
                $scope.allSelected = true;
            }
            /**
             * Handles the select none event.
             */
            $scope.selectNone = function () {
                if ($scope.useCallback) {
                    return;
                }

                $scope.outputModel = $scope.form.titleMap;
                setAttributeInTree($scope.outputModel, 'children', 'selected', false);
                $scope.selectedItems = [];
                $scope.allSelected = false;
                this.refreshOutputModel();
            }

            /**
             * Handles the show all event.
             */
            $scope.showAll = function ($event) {
                $scope.showSelectedOnly = false;
                $scope.form.titleMap = angular.copy($scope.allItems);
                if ($event) {
                    $($event.target).addClass('active');
                    $($event.target).siblings().removeClass('active');
                }
                this.refreshOutputModel();
            }
            /**
             * Handles the show select event.
             */
            $scope.showSelected = function ($event) {
                $scope.showSelectedOnly = true;
                $($event.target).addClass('active');
                $($event.target).siblings().removeClass('active');
                if (!isAllSelectedInSelectedItems()) {
                    $scope.form.titleMap = ($scope.selectedItems.hasOwnProperty('name')) ? angular.copy($scope.selectedItems) : $scope.selectedItems.map(function (item) { return makeItem(item.value, item.value) });
                }
            }

            $scope.done = function () {
                var model = angular.copy($scope.selectedItems.map(function (item) { return item.value }));
                if (model.length > 0 && !angular.equals($scope.model[$scope.form.key], model) && $scope.form.options) {
                    $scope.model[$scope.form.key] = model;
                    if ($scope.form.options.registerEvents)
                        triggerEvent($scope.form, $scope.model[$scope.form.key]);
                } else if (model.length === 0) {
                    delete $scope.model[$scope.form.key];
                    if ($scope.form.options.registerEvents)
                        triggerEvent($scope.form, false);
                }
                closePopup();
            }

            $scope.cancel = function () {
                $scope.allSelected = $scope.previousItems.length === 1 && $scope.previousItems[0].value === "0";

                if ($scope.allSelected)
                    $scope.selectAll();
                else {
                    $scope.selectedItems = angular.copy($scope.previousItems);
                    $scope.form.titleMap = angular.copy($scope.previousTitleMap);
                }
                closePopup();
            }

            $scope.$watch('filterKeyword', function () {

                /**
                  * Return all childNodes of a given node (as Array of Nodes)
                  */
                function getAllChildNodesFromNode(node, childNodes) {
                    if (!item.children) return null;
                    for (var i = 0; i < node.children.length; i++) {
                        childNodes.push(node.children[i]);
                        // add the childNodes from the children if available
                        getAllChildNodesFromNode(node.children[i], childNodes);
                    }
                    return childNodes;
                }

                /**
                  * Checks whether any of children match the keyword.
                  *
                  * @param item the parent item
                  * @param keyword the filter keyword
                  * @returns {boolean} false if matches.
                  */
                function isChildrenFiltered(item, keyword) {
                    var childNodes = getAllChildNodesFromNode(item, []);
                    for (var i = 0, len = childNodes.length; i < len; i++) {
                        if (childNodes[i].name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                            return false;
                        }
                    }
                    return true;
                }

                if ($scope.filterKeyword !== undefined) {
                    angular.forEach($scope.form.titleMap, function (item) {
                        if (item.name.toLowerCase().indexOf($scope.filterKeyword.toLowerCase()) !== -1) {
                            item.isFiltered = false;
                        } else if (!isChildrenFiltered(item, $scope.filterKeyword)) {
                            item.isFiltered = false;
                        } else {
                            item.isFiltered = true;
                        }
                    });
                }
            });
        }
    ]);

    /**
     * Controller for sortable item.
     *
     * @param $scope - drag item scope
     */
    angular.module('schemaForm').controller('treeItemCtrl', [
      '$scope',
      function ($scope) {
          $scope.item.isExpanded = false;
          /**
           * Shows the expand option.
           *
           * @param item the item
           * @returns {*|boolean}
           */
          $scope.showExpand = function (item) {
              return item.children && item.children.length > 0;
          };
          /**
         * On expand clicked toggle the option.
         *
         * @param item the item
         */
          $scope.onExpandClicked = function (item) {
              item.isExpanded = !item.isExpanded;
          };

          /**
         * Event on click of select item.
         *
         * @param item the item
         */
          $scope.clickSelectItem = function (item) {
              if ($scope.itemClicked) {
                  $scope.itemClicked({ item: item });
              }
          };
          /**
         * Is leaf selected.
         *
         * @param item the item
         */
          $scope.subItemClicked = function (item) {
              if ($scope.itemClicked) {
                  $scope.itemClicked({ item: item });
              }
          };
          /**
         * Active sub item.
         *
         * @param item the item
         */
          $scope.activeSubItem = function (item) {
              if ($scope.onActiveItem) {
                  $scope.onActiveItem({ item: item });
              }
          };
          /**
         * On mouse over event.
         *
         * @param item the item
         */
          $scope.onMouseOver = function (item) {
              if ($scope.onActiveItem) {
                  $scope.onActiveItem({ item: item });
              }
          };
          /**
         * Can select item.
         *
         * @returns {*}
         */
          $scope.showCheckbox = function () {
              var showCheckbox = true;
              if (!$scope.multiSelect) {
                  showCheckbox = false;
              }
              if ($scope.selectOnlyLeafs) {
                  showCheckbox = true;
              }
              if ($scope.useCallback) {
                  showCheckbox = $scope.canSelectItem($scope.item);
              }

              return showCheckbox;
          };
      }
    ]);

    /**
     * sortableItem directive.
     */
    angular.module('schemaForm').directive('gmMultiSelectTree', ['$document', '$window', function ($document) {
        return {
            restrict: 'AE',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                gmMultiSelectTree: '=',
                selectOnlyLeafs: '=?'
            },
            link: function ($scope, $element, $attrs, ngModel) {
                function handler (event) {
                    if ($(event.target).parents('.tree-control').length === 0) {
                        $scope.$parent.docClickHide();
                    }
                }

                $scope.$watch('$parent.showTree', function (newVal) {
                    if (newVal) {
                        $document.on('click', handler);
                    } else {
                        $document.off('click', handler);
                    }
                });

                $scope.$on('$destroy', function () {
                    $document.off('click', handler);
                });
            }
        };
    }]);

    /**
     * sortableItem directive.
     */
    angular.module('schemaForm').directive('gmTreeItem', [
      '$compile',
      function ($compile) {
          return {
              restrict: 'E',
              templateUrl: 'directives/decorators/tree-select/tree-item.tpl.html',
              scope: {
                  item: '=',
                  itemClicked: '&',
                  onActiveItem: '&',
                  selectOnlyLeafs: '=?',
                  isActive: '=',
                  canSelectItem: '='
              },
              controller: 'treeItemCtrl',
              compile: function (element, attrs, link) {
                  // Normalize the link parameter
                  if (angular.isFunction(link)) {
                      link = { post: link };
                  }
                  // Break the recursion loop by removing the contents
                  var contents = element.contents().remove();
                  var compiledContents;
                  return {
                      pre: link && link.pre ? link.pre : null,
                      post: function (scope, element, attrs) {
                          // Compile the contents
                          if (!compiledContents) {
                              compiledContents = $compile(contents);
                          }
                          // Re-add the compiled contents to the element
                          compiledContents(scope, function (clone) {
                              element.append(clone);
                          });
                          // Call the post-linking function, if any
                          if (link && link.post) {
                              link.post.apply(null, arguments);
                          }
                      }
                  };
              }
          };
      }
    ]);

    angular.module('schemaForm').config([
        'schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
        function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
            var treeSelect = function (name, schema, options) {
                if (schema.type === 'array' && schema.format === 'treeselect') {
                    var f = schemaFormProvider.stdFormObj(name, schema, options);
                    f.key = options.path;
                    f.type = 'treeselect';
                    options.lookup[sfPathProvider.stringify(options.path)] = f;
                    return f;
                }
            };

            schemaFormProvider.defaults.array.unshift(treeSelect);

            //Add to the bootstrap directive
            schemaFormDecoratorsProvider.defineAddOn(
                'bootstrapDecorator',
                'treeselect',
                'directives/decorators/tree-select/tree-select.html'
            );
        }
    ]);
}));