package controllers;

import akka.actor.ActorSystem;
import javax.inject.*;

import akka.actor.Scheduler;
import play.*;
import play.mvc.*;
import java.util.concurrent.Executor;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.TimeUnit;

import scala.concurrent.ExecutionContext;
import scala.concurrent.duration.Duration;
import scala.concurrent.ExecutionContextExecutor;

// AsyncController is a singleton Controller class that defines the functionality
// for asynchronous tasks within the slot machine application

@Singleton
public class AsyncController extends Controller {

    private final ActorSystem system;
    private final ExecutionContextExecutor exec;

    @Inject
    public AsyncController(ActorSystem system, ExecutionContextExecutor exec) {
      this.system = system;
      this.exec = exec;
    }

    public CompletionStage<Result> message() {
        return getFutureMessage(1, TimeUnit.SECONDS).thenApplyAsync(Results::ok, exec);
    }

    private CompletionStage<String> getFutureMessage(long time, TimeUnit timeUnit) {
        CompletableFuture<String> future = new CompletableFuture<>();
        system.scheduler().scheduleOnce(
            Duration.create(time, timeUnit),
            () -> future.complete("Hi!"),
            exec
        );
        return future;
    }

}
