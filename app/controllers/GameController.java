package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.Game.GamePlay;

/**
 * This controller contains an action to handle HTTP requests
 * to the application's GamePlay page.
 */
public class GameController extends Controller {

    //The action that renders the GamePlay HTML page
    public Result index() {
        return ok(GamePlay.render());
    }

}
