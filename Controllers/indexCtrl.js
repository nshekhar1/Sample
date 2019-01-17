appIndex.controller('indexController', ['$scope', 'DataService', function ($scope, DataService) {
    $scope.listPerson = "";
    //load all available person from server.
    loadPersons();
    function loadPersons()
    {
        DataService.getPersons().then(function successCallback(response) {
            if (response.data.length > 0) {
                $scope.listPerson = response.data;
            } 
        }, function errorCallback(response) {
            //alert(response.status);
        });
    }
  
    $scope.Remove = function(id) {
        DataService.deletePerson(id).then(function successCallback(response) {
            if (response.data == "true") {
                loadPersons();
                alert("succefully done !");
            }
        
        }, function errorCallback(response) {
            //alert(response.status);
        });  
    }
    
    $scope.Edit = function (elem) {
        DataService.editPerson(elem).then(function successCallback(response) {
             if(response.data == "true"){
                 loadPersons();
                 alert("succefully done !");
             }
        }, function errorCallback(response) {
            //alert(response.status);
        });
    }
    $scope.AddNewPerson = function (master) {
        DataService.addPerson(master).then(function successCallback(response) {
            //refresh List of person
            loadPersons();
            //hide modal : 
            $("#myModalFormAddPerson").modal("hide");
        }, function errorCallback(response) {
            alert(response.status);
        }); 
    }
}]);
 