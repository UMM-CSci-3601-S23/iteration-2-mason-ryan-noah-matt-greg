package umm3601.form;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import com.mongodb.client.result.DeleteResult;
import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import java.util.Map;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import java.security.NoSuchAlgorithmException;


public class FormController {
  static final String SORT_ORDER_KEY = "sortorder";

  // private static final String SORT_ORDER_REGEX = "^(oldest|newest)$";


  private final JacksonMongoCollection<Form> requestCollection;


  public FormController(MongoDatabase database) {
    requestCollection = JacksonMongoCollection.builder().build(
      database,
      "requests",
      Form.class,
      UuidRepresentation.STANDARD);
  }

  /**foodType and itemType
   * Set the JSON body of the response to be a list of all the requests returned from the database
   * that match any requested filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */
  public void getForms(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the requests with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<Form> matchingRequests = requestCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of requests returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json
    System.out.println(matchingRequests);
    ctx.json(matchingRequests);

    // Explicitly set the context status to OK
    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with a blank document
    /*
    if (ctx.queryParamMap().containsKey(ITEM_TYPE_KEY)) {
      String itemType = ctx.queryParamAsClass(ITEM_TYPE_KEY, String.clfoodType and itemType
      String foodType = ctx.queryParamAsClass(FOOD_TYPE_KEY, String.class)
        .check(it -> it.matches(FOOD_TYPE_REGEX), "Request must contain valid food type")
        .get();
      filters.add(eq(FOOD_TYPE_KEY, foodType));
    }
    if (ctx.queryParamMap().containsKey(SORT_ORDER_KEY)){
      String sortOrder = ctx.queryParamAsClass(SORT_ORDER_KEY, String.class)
        .check(it -> it.matches(SORT_ORDER_REGEX), "Sort order must be 'oldest' or 'newest")
        .get();
      filters.add(eq(SORT_ORDER_KEY, sortOrder));
    }
    */
    // Combine the list of filters into a single filtering document.
    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    // Sort the results. Use the `sortby` query param (default "name")
    // as the field to sort by, and the query param `sortorder` (default
    // "asc") to specify the sort order.
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "newest");
    Bson sortingOrder = sortOrder.equals("newest") ?
    Sorts.descending("timeSubmitted") : Sorts.ascending("timeSubmitted");
    return sortingOrder;
  }

  public void addNewForm(Context ctx) {
    /*
     * The follow chain of statements uses the Javalin validator system
     * to verify that instance of `Request` provided in this context is
     * a "legal" request. It checks the following things (in order):
     *    - itemType is valid
     *    - foodType is Valid
     */
    Form newRequest = ctx.bodyAsClass(Form.class);

    /*
    String try2 = ctx.body();
    System.out.println(try2);
    try2 = try2.replace("\"", "");
    try2 = try2.replace("{", "");
    try2 = try2.replace("}", "");
    try2 = try2.replace("[", "");
    try2 = try2.replace("]", "");
    try2 = try2.replace("selections", "");
    String[] selectionsExtracted = try2.split(",");
    System.out.println(try2);
    newRequest.setSelections(selectionsExtracted);
    */

    requestCollection.insertOne(newRequest);

    ctx.json(Map.of("id", newRequest._id));
    // 201 is the HTTP code for when we successfully
    // create a new resource (a request in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpStatus.CREATED);
  }


  /**
   * Delete the user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */

  public void deleteForm(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = requestCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Was unable to delete ID "
          + id
          + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }



}
