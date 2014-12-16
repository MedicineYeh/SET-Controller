angular.module('dashboard', ['ngMaterial'])
.controller('tab_control', function($scope) {
    //VMs
    var tabs = [
        { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
        { title: 'Two', content: "Tabs will become paginated if there isn't enough room for them."}
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

})
.controller('vm_control', function($scope) {

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
        console.log(data);

        ws.send(data);
    }
});


