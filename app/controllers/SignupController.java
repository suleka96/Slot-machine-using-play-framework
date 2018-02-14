package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.Game.Signup;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's Signup page.
 */

//The action that renders the Signup HTML page
public class SignupController extends Controller {
    public Result index() {
        return ok(Signup.render());
    }
}






