angular.module('dashboard', ['ngMaterial'])
.controller('tab_control', function($scope, $mdBottomSheet, $mdToast) {
    //VMs
    var tabs = [
    { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."}
    ];

    $scope.tabs = tabs;
    $scope.selectedIndex = 0;
    $scope.add_tab = function (title) {
        if (title !== undefined && title !== "") {
            view = title + " Content View";
            tabs.push({ title: title, content: view, disabled: false});
        }
        $scope.tTitle = "";
    };

    $scope.remove_tab = function (index) {
        $scope.tabs.splice(index, 1);
    };

    function replacer(key, value) {
        if (key === "$$hashKey") {
            return undefined;
        }
        return value;
    }

    //Bottom sheet
    $scope.links = [];
    $scope.allLink = "";
    $scope.openBottomSheet = function($event) {
        var index = 0;
        var allModels = [];
        $scope.links = [];
        //go through every tabs and initialize the data
        $scope.tabs.forEach(function(tab) {
            var item = document.getElementById("tab_" + index);
            if (typeof item != "undefined" && item != null) {
                var model = angular.element(document.getElementById("tab_" + index)).scope().model;
                var data = JSON.stringify(model, replacer);
                var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
                $scope.links.push({url: url});
                allModels.push(model);
            }
            index++;
        });
        var data = JSON.stringify(allModels, replacer);
        $scope.allLink = 'data:text/json;charset=utf8,' + encodeURIComponent(data);

        $mdBottomSheet.show({
            templateUrl: 'bottom-sheet.html',
            controller: 'bottom_sheet_control',
            targetEvent: $event
        }).then(function(clickedItem) {
            $scope.showActionToast(clickedItem.name + ' complete!');
        });
    };

    //Toast
    $scope.showActionToast = function(content) {
        var toast = $mdToast.simple()
            .content(content)
            .action('OK')
            .highlightAction(false)
            .position('top right')
            .hideDelay(1000);
        $mdToast.show(toast).then(function() {
        });
    };
})
.controller('vm_control', function($scope) {
    //Process
    $scope.traced_processes = [];

    $scope.add_process = function (name) {
        if (name !== undefined && name !== "") {
            $scope.traced_processes.push({name: name});
        }
        $scope.process_name = "";
    };

    $scope.remove_process = function (index) {
        $scope.traced_processes.splice(index, 1);
    };

    //Timing Model
    $scope.model = {};

    $scope.model.events = [
    {name: 'IRQ', value: true},
    {name: 'Kernel', value: true},
    {name: 'System Call', value: true},
    {name: 'Library', value: true},
    {name: 'User C/C++', value: false},
    {name: 'Dalvik', value: true}
    ];

    $scope.model.timing = [
    {name: 'Basic', value: true},
    {name: 'Pipeline', value: false},
    {name: 'I/D Cache', value: false},
    {name: 'Branch Prediction', value: false}
    ];

    $scope.model.process_list = $scope.traced_processes;

    //Websocket
    var ws = new WebSocket('ws://' + window.location.hostname + ':8080');
    ws.onopen = function()
    {
        // Web Socket is connected, send data using send()
        ws.send("Message to send");
        $scope.tab.content = "ws: Send a message";
        $scope.$apply();
    };

    ws.onmessage = function (evt) 
    { 
        var received_msg = evt.data;
        $scope.tab.content = "ws: Receive " + received_msg;
        $scope.$apply();
    };

    ws.onclose = function()
    { 
        // websocket is closed.
        tabs[$scope.selectedIndex].content = "ws: Connection is closed...";
    };

    function replacer(key, value) {
        if (key === "$$hashKey") {
            return undefined;
        }
        return value;
    }

    $scope.start_trace = function () {
        var data = "{\"type\": \"start_trace\", \"content\": ";
        data += JSON.stringify($scope.model, replacer);
        data += "}";

        ws.send(data);
    }
})
.controller('bottom_sheet_control', function($scope, $mdBottomSheet) {
    var parentScope = angular.element(document.getElementsByTagName("body")).scope();
    $scope.items = [
    { name: 'Save', icon: 'glyphicon glyphicon-download', jsonData: parentScope.links[parentScope.selectedIndex].url, fileName: "SET_setting-" + parentScope.selectedIndex + ".json" },
    { name: 'Save All', icon: 'glyphicon glyphicon-download', jsonData: parentScope.allLink, fileName: "SET_settings.json" },
    { name: 'Load', icon: 'glyphicon glyphicon-upload', jsonData: "", fileName: "" },
    { name: 'Load All', icon: 'glyphicon glyphicon-upload', jsonData: "", fileName: "" },
    { name: 'Settings', icon: 'glyphicon glyphicon-wrench', jsonData: "", fileName: "" }
    ];
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };
})
.config(function($compileProvider){
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|javascript):/);
});
