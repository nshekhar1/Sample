appIndex.factory('DataService', ['$http', function ($http) {

    var getPersons = function () {
        return $http.get("http://127.0.0.1:8081/getPersons");
    }
    var addPerson = function (obj) {
        var data = angular.copy(obj);
        
        var parameters = {
            obj: JSON.stringify(data),
        };
        var config = {
            params: parameters
        };
        return $http.get("http://127.0.0.1:8081/addPerson", config);
    }    
    var editPerson = function (obj) {
        //removed the $$hashKey properties
        var data = angular.copy(obj);
        var parameters = {
            obj: JSON.stringify(data),
        };
        var config = {
            params: parameters
        };
        return $http.get("http://127.0.0.1:8081/updatePerson", config);
    }
    var deletePerson = function (id) {
        var parameters = {
            id: id,
        };
        var config = {
            params: parameters
        };
        return $http.get("http://127.0.0.1:8081/removePerson", config);
    }
    
    return {
        getPersons: getPersons,
        addPerson: addPerson,
        editPerson: editPerson,
        deletePerson: deletePerson,
    }
}]);