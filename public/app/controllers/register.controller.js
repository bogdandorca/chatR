angular.module('app').controller('RegisterCtrl', function($scope, $location, UserService){
    $scope.emailConfirmation = null;
    $scope.passwordConfirmation = null;
    $scope.user = {
        firstName: null,
        lastName: null,
        email: null,
        password: null
    };

    var emailsMatch = function(){
        return $scope.emailConfirmation === $scope.user.email;
    };
    var passwordsMatch = function(){
        return $scope.passwordConfirmation === $scope.user.password;
    };
    var detailsAreValid = function(){
        return (validator.isAlpha($scope.user.firstName) && validator.isLength($scope.user.firstName, 2, 50) &&
        validator.isAlpha($scope.user.lastName) && validator.isLength($scope.user.lastName, 2, 50) &&
        validator.isEmail($scope.user.email) && validator.isLength($scope.user.email, 5, 30) &&
        validator.isLength($scope.user.password, 6, 30));
    };

    $scope.register = function(){
        console.log(detailsAreValid());
        console.log(emailsMatch());
        console.log(passwordsMatch());
        if(detailsAreValid() && emailsMatch() && passwordsMatch()){
            UserService.create($scope.user)
                .then(function(responseMessage){
                    // Confirm the registration
                    $location.path('/');
                });
        } else {
            // Inform the user regarding the error
        }
    };
});