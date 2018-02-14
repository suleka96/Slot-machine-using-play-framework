package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.Game.SplashScreen;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's SpalshScreen page.
 */
public class HomeController extends Controller {


    //The action that renders the SplashScreen HTML page
    public Result index() {
        return ok(SplashScreen.render());
    }

}
