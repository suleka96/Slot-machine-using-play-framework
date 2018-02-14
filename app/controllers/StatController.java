package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.Game.Statistics;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's Statistics page.
 */

//The action that renders the Statistics HTML page
public class StatController extends Controller {
    public Result index() {
        return ok(Statistics.render());
    }

}
