angular.module('dashboard', ['ngMaterial'])
.controller('AppCtrl', function($scope) {
    $scope.data = {};
    $scope.data.cb1 = true;
    $scope.data.cb2 = false;

    $scope.data = {
        group1 : 'Banana',
        group2 : '3'
    };

    $scope.radioData = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' }
    ];

    $scope.addItem = function() {
        var r = Math.ceil(Math.random() * 1000);
        $scope.radioData.push({ label: r, value: r });
    };

    $scope.removeItem = function() {
        $scope.radioData.pop();
    };

    var tabs = [
        { title: 'One', content: "Tabs will become paginated if there isn't enough room for them."},
        { title: 'Two', content: "You can swipe left and right on a mobile device to change tabs."},
        { title: 'Three', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
        { title: 'Four', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
        { title: 'Five', content: "If you remove a tab, it will try to select a new one."},
        { title: 'Six', content: "There's an ink bar that follows the selected tab, you can turn it off if you want."},
        { title: 'Seven', content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."},
        { title: 'Eight', content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"},
        { title: 'Nine', content: "If you set md-theme=\"green\" on the md-tabs element, you'll get green tabs."},
        { title: 'Ten', content: "If you're still reading this, you should just go check out the API docs for tabs!"}
    ];

    $scope.tabs = tabs;
    $scope.selectedIndex = 2;

    $scope.announceSelected = announceSelected;
    $scope.announceDeselected = announceDeselected;

    $scope.addTab = function (title, view) {
        view = view || title + " Content View";
        tabs.push({ title: title, content: view, disabled: false});
        $scope.tTitle = "";
        $scope.tContent = "";
    };

    $scope.removeTab = function (tab) {
        for (var j = 0; j < tabs.length; j++) {
            if (tab.title == tabs[j].title) {
                $scope.tabs.splice(j, 1);
                break;
            }
        }
    };

    function announceDeselected(tab) {
        $scope.farewell = 'Goodbye ' + tab.title + '!';
    }

    function announceSelected(tab) {
        $scope.greeting = 'Hello ' + tab.title + '!';
    }
});


