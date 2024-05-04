function login(email, password){
    jQuery.ajax({
        url: 'http://127.0.0.1:8000/login',
        type: 'POST',
        data: {
            email: email,
            password: password
        },
        success: function(response){
            console.log(response);
            if(response.access != null){
                // Save the token in local storage
                chrome.storage.sync.set({Authorization_token: response.access}, function() {
                    console.log('Token saved');
                    
                });
                loadMainPage(response.access);
            }
        },
        error: function(error){
            console.log(error);
            var errors = error.responseJSON;
            jQuery('#loginerrors').empty();
            if(errors.detail){
                jQuery('#loginerrors').append(errors.detail);
            }else{
                jQuery('#loginerrors').append("Invalid email or password");
            
            }
        }
    });
}

function loadRegisterPage(){
    jQuery('#main').load('/HtmlForms/registerform.html', function() {
        // Once the login form is loaded, attach event listeners
        let registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            
            var email = registerForm.email.value;
            var password1 = registerForm.password1.value;
            var password2 = registerForm.password2.value;
            var first_name = registerForm.first_name.value;
            var last_name = registerForm.last_name.value;


            register(email, password1, password2, first_name, last_name);
        });
        jQuery("#loginpage").click(function(){
            loadLoginPage();
        });
    });
}

function loadLoginPage(){
    jQuery('#main').load('/HtmlForms/loginform.html', function() {
        // Once the login form is loaded, attach event listeners
        let loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            // Retrieve email and password input values
            let email = document.getElementById('login_email').value;
            let password = document.getElementById('login_password').value;
            // this.reset(); // Reset form
            login(email, password);
            // Do something with email and password
            console.log(email, password);
        });
        jQuery("#registerpage").click(function(){
            loadRegisterPage();
        });
    });
}

function register(email, password1, password2, first_name, last_name){
    jQuery('#email_error').empty();
    jQuery('#password1_error').empty();
    jQuery('#password2_error').empty();
    jQuery.ajax({
        url: 'http://127.0.0.1:8000/register',
        type: 'POST',
        data: {
            email: email,
            password1: password1,
            password2: password2,
            first_name: first_name,
            last_name: last_name
        },
        success: function(response){
            console.log(response);
            if(response.access != null){
                // Save the token in local storage
                chrome.storage.sync.set({Authorization_token: response.access}, function() {
                    console.log('Token saved');
                });
                loadMainPage(response.access);
            }
        },
        error: function(error){
            // Show Errors in the form
            console.log(error.responseJSON);
            var errors = error.responseJSON;
            if(errors.email != null){
                for(var i = 0; i < errors.email.length; i++){
                    jQuery('#email_error').append(errors.email[i]);
                }
            }
            else if(errors.password1 != null){
                for(var i = 0; i < errors.password1.length; i++){
                    jQuery('#password1_error').append(errors.password1[i]);
                }
            }
            else if(errors.password2 != null){
                for(var i = 0; i < errors.password2.length; i++){
                    jQuery('#password2_error').append(errors.password2[i]);
                }
            }
            else if(errors.non_field_errors != null){
                for(var i = 0; i < errors.non_field_errors.length; i++){
                    jQuery('#non_field_errors').append(errors.non_field_errors[i]);
                }
            }
        }
    });
}

function loadMainPage(Authorization_token){
    jQuery.ajax({
        url: 'http://127.0.0.1:8000/user',
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + Authorization_token
        },
        success: function(response){
            console.log(response);
            jQuery('#main').load('/HtmlForms/main.html', function() {
                // Once the main page is loaded, attach event listeners
                let logoutButton = document.getElementById('logoutButton');
                logoutButton.addEventListener('click', function(event) {
                    // Remove the token from local storage
                    chrome.storage.sync.remove('Authorization_token', function() {
                        console.log('Token removed');
                    });
                    // Load the login form
                    loadLoginPage();
                });
            });
        },
        error: function(error){
            console.log(error);
            // Remove the token from local storage
            chrome.storage.sync.remove('Authorization_token', function() {
                console.log('Token removed');
            });
            // Load the login form
            loadLoginPage();
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    var main_div = document.getElementById('main');
    var Authorization_token = null;
    const initStorageCache = chrome.storage.sync.get();
    console.log('Init storage cache: ', initStorageCache);
    initStorageCache.then((data) => {
        Authorization_token = data.Authorization_token;
        console.log(Authorization_token);
        if (Authorization_token == null || Authorization_token == "" || Authorization_token == "undefined" || Authorization_token == "null") {
            console.log('No token found');
            // Load the login form
            loadLoginPage();
        }
        else{
            loadMainPage(Authorization_token);
        }
    });
});
