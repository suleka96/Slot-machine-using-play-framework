package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import services.Counter;

import javax.inject.Inject;
import javax.inject.Singleton;


@Singleton
public class CountController extends Controller {

    private final Counter counter;

    @Inject
    public CountController(Counter counter) {
       this.counter = counter;
    }

    public Result count() {
        return ok(Integer.toString(counter.nextCount()));
    }

}
