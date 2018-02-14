package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.Game.Login;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's Login page.
 */

//The action that renders the Login HTML page
public class LoginController  extends Controller {
    public Result index() {
        return ok(Login.render());
    }
}








