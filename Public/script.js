angular.module('dashboard', ['ngMaterial'])
.controller('AppCtrl', function($scope) {
    //VMs
    var tabs = [
        { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."}
    ];

    $scope.tabs = tabs;
    $scope.selectedIndex = 0;
    $scope.addTab = function (title) {
        if (name !== undefined && name !== "") {
            view = title + " Content View";
            tabs.push({ title: title, content: view, disabled: false});
        }
        $scope.tTitle = "";
        $scope.tContent = "";
    };

    $scope.removeTab = function (index) {
        $scope.tabs.splice(index, 1);
    };

    //Process
    $scope.traced_processes = [];

    $scope.add_process = function (name) {
        if (name !== undefined && name !== "") {
            console.log(name);
            $scope.traced_processes.push({name: name});
        }
        $scope.process_name = "";
    };

    $scope.remove_process = function (index) {
        $scope.traced_processes.splice(index, 1);
    };

    //Timing Model
    $scope.model = {};

    $scope.model.timing = [
    {name: 'Basic', value: true},
    {name: 'Pipeline', value: false},
    {name: 'I/D Cache', value: false},
    {name: 'Branch Prediction', value: false}
    ];

    $scope.model.events = [
    {name: 'IRQ', value: true},
    {name: 'Kernel', value: true},
    {name: 'System Call', value: true},
    {name: 'Library', value: true},
    {name: 'User C/C++', value: false},
    {name: 'Dalvik', value: true}
    ];


    //Websocket
    var ws = new WebSocket('ws://127.0.0.1:8080');
    ws.onopen = function()
    {
        // Web Socket is connected, send data using send()
        ws.send("Message to send");
        tabs[$scope.selectedIndex].content = "ws: Send a message";
        $scope.$apply();
    };

    ws.onmessage = function (evt) 
    { 
        var received_msg = evt.data;
        tabs[$scope.selectedIndex].content = "ws: Receive " + received_msg;
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
});


