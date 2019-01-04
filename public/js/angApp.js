var app = angular.module('myApp', []);

/*Set up Frontend Route
app.config(function($routeProvider) {
    $routerProvider
    .when("/", {
        templateUrl : "index.html"
    })
    .when("/resumeSubmit", {
        templateUrl : "resumeSubmit.html"
    })
    .when("/managerLogin", {
        templateUrl : "manager.html"
    });
});
*/

// Controllers

app.controller('formCtr1', ['$scope', '$http', function ($scope, $http) {
    //Get positions in database
    $http.get('/dbConnection/positions').then(function (response) {
      console.log(response.data);
      //Get Positions details from DB
      $scope.positions = response.data;
    });

    //submit
        $scope.aForm = function() {
            console.log('Ready to UPLOAD');
    
            $http({
                method: `POST`,
                url: `/submit`,
                data: {
                    firstName: $scope.firstName,
                    lastName: $scope.lastName,
                    email: $scope.email,
                    position: $scope.position,
                    resumeFile: $scope.resumeFile}
            })
            .then(response => {
                window.location.href = `/success`;
            })
        }
  }]);
  
  
// Applicant submit



//Manager login
app.controller('formCtr2', ['$scope', '$http', '$window', 
                function ($scope, $http, $window) {

    $scope.mForm = function(){
        console.log("submitted login details");

        $http({
            method: "POST",
            url: '/login',
            data: {username: $scope.username, password: $scope.password},
            headers: {'Content-Type': `application/json; charset=utf-8`}
        })
        .then(response => {
            console.log("Im here")
            console.log(response.data)
            //if (res.data.success)
            if (response[`data`][`success`] === true) {
                $window.sessionStorage.accessToken = response.data.token

                console.log($window.sessionStorage.accessToken + "Logged in")
                //$location.path('/dashboard')
                window.location.href = `/dashboard`;
                console.log("Angular successfully login")
            }
            else {
                $scope.loginFailed = true;
            }
        })
    }
}]);



//Manager APP
var app2 = angular.module('uigrid', ['ui.grid', 'ngSanitize']);
    app2.controller('uigrid', ['$scope', '$log', '$http', '$window', function ($scope, $log, $http, $window) {

        //clear token if logout
        $scope.logout = function(){
            $window.sessionStorage.clear()
            window.location.href = `/logout`;
        }
        
        //display uigrid
        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            rowHeight: 40,
        };
        $scope.gridOptions.columnDefs = [{
                field: 'firstName',
                displayName: 'First Name',
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                width: 125,
            },
            {
                field: 'lastName',
                displayName: 'Last Name',
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>',
                width: 125
            },
            {
                field: 'email',
                displayName: 'Email',
            },
            {
                field: 'position',
                displayName: 'Position',
            },
            {
                field: 'resumeLink',
                displayName: 'View Resume',
                cellTemplate: '<div class="ui-grid-cell-contents"><a target="_blank" ng-href="/resumeRender/{{COL_FIELD}}">{{ COL_FIELD }}</a></div>',
                enableSorting: false,
                enableColumnMenu: false,
                enableFiltering: false,
                width: 200
            },
            {
                field: 'Delete',
                displayName: 'Delete',
                cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.remove(row)">DELETE</button></div>',
                enableSorting: false,
                enableColumnMenu: false,
                enableFiltering: false,
                width: 90
            },
        ];
        
        $http.get('/dbConnection/resumes').then(function (response) {
                    console.log(response);
                    $scope.gridOptions.data = response.data
                });


        $scope.remove = function (row) {
            var index = $scope.gridOptions.data.indexOf(row.entity);
            $scope.gridOptions.data.splice(index, 1);

            $http.post('/models/updateApp/' + row.entity.id).then(function (data) {
                console.log(row.entity.id)
            })
        }

    }]);