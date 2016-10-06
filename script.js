// Code goes here

'use strict';

var app = angular.module('formlyApp', ['formly', 'formlyBootstrap', 'ui.bootstrap']);

app.controller('userFormly', function($scope, Country, $uibModal) {
  var user = this;

  // The model object that we reference
  // on the  element in index.html
  user.rental = {};

  // An array of our form fields with configuration
  // and options set. We make reference to this in
  // the 'fields' attribute on the  element

  user.rentalFields = [{
    key: 'firstName',
    type: 'input',
    templateOptions: {
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter First Name',
      required: true
    }
  }, {
    key: 'lastName',
    type: 'input',
    templateOptions: {
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter Last Name',
      required: true

    }
  }, {
    key: 'email',
    type: 'input',
    templateOptions: {
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter email',
      required: true
    }
  }, {
    key: 'gender',
    type: 'radio',
    templateOptions: {
      label: 'Gender',
      inline: true,
      options: [{
        name: 'Male',
        value: 'Male'
      }, {
        name: 'Female',
        value: 'Female'
      }]
    }
  }, {
    key: 'country',
    type: 'select',
    templateOptions: {
      label: 'country',
      options: Country.getCountryList()
    }
  }, {
    key: 'above18',
    type: 'checkbox',
    templateOptions: {
      label: 'Are you above 18?',
    }
  }, {
    key: 'panNo',
    type: 'input',
    templateOptions: {
      label: 'Pan Card',
      placeholder: 'Enter your PAN card no.',
    },
    hideExpression: '!model.above18',
    validators: {
      // Custom validator to check whether the pancard
      // number that the user enters is valid or not
      panCardNumber: function($viewValue, $modelValue, scope) {
        var value = $modelValue || $viewValue;
        if (value) {
          // call the validatePanCard function
          // which either returns true or false
          // depending on whether the entry is valid
          return validatePanCard(value);
        }
      }
    }
  }, {
    key: 'adhaarNo',
    type: 'input',
    templateOptions: {
      label: 'Adhaar Card',
      placeholder: 'Enter adhaar card number'
    },
    hideExpression: '!model.above18',
    validators: {
      adhaarCardNum: function($modelValue, $viewValue, scope) {
        var value = $modelValue || $viewValue;
        if (value) {
          return validateAdhaarCard(value);
        }
      }
    },
    expressionProperties: {
      'templateOptions.disabled': function($viewValue, $modelValue, scope) {
        if (scope.model.country === 'India') {
          return false;
        }
        scope.model.adhaarNo = "";
        return true;
      }
    }
  }]

  function validatePanCard(value) {
    return /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(value);
  }

  function validateAdhaarCard(value) {
    return /^\d+$/.test(value);
  }

  $scope.showData = function() {
    if (user.rental.above18 === false) {
      delete user.rental.adhaarNo;
      delete user.rental.panNo;
    }
    $uibModal.open({
      templateUrl: 'displayData.html',
      controller: 'displayDataCtrl',
      resolve: {
        fields: function() {
          return user.rental;
        }
      }
    })
  }
});

app.controller('displayDataCtrl', function($scope, fields) {
  $scope.user = fields;
})

app.factory('Country', function() {

  function getCountryList() {
    return [{
      name: 'India',
      value: 'India'
    }, {
      name: 'Ireland',
      value: 'Ireland'
    }, {
      name: 'Afghanistan',
      value: 'Afghanistan'
    }]
  }

  return {
    getCountryList: getCountryList
  }
})