package umm3601.request;

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
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import java.security.NoSuchAlgorithmException;


public class RequestController {
  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<Request> requestCollection;


  public RequestController(MongoDatabase database) {
    requestCollection = JacksonMongoCollection.builder().build(
      database,
      "requests",
      Request.class,
      UuidRepresentation.STANDARD);
  }

  /**
   * Set the JSON body of the response to be the single request
   * specified by the `id` parameter in the request
   *
   * @param ctx a Javalin HTTP context
   */
  public void getRequest(Context ctx) {
    String id = ctx.pathParam("id");
    Request request;

    try {
      request = requestCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired request id wasn't a legal Mongo Object ID.");
    }
    if (request == null) {
      throw new NotFoundResponse("The desired request was not found");
    } else {
      ctx.json(request);
      ctx.status(HttpStatus.OK);
    }
  }

  /**foodType and itemType
   * Set the JSON body of the response to be a list of all the requests returned from the database
   * that match any requested filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */
  public void getRequests(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the requests with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<Request> matchingRequests = requestCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of requests returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json
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
      filters.add(eq(SORT_ORDER_KEY));
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
    Bson sortingOrder = sortOrder.equals("newest") ?  Sorts.descending("timeSubmitted") : Sorts.ascending("timeSubmitted");
    return sortingOrder;
  }

  public void addNewRequest(Context ctx) {
    /*
     * The follow chain of statements uses the Javalin validator system
     * to verify that instance of `Request` provided in this context is
     * a "legal" request. It checks the following things (in order):
     *    - itemType is valid
     *    - foodType is Valid
     */
    Request newRequest = new Request();

    // {"selections":["appleJuice","miscFreshFruit","frozenPeaches"]}
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
    requestCollection.insertOne(newRequest);

    ctx.json(Map.of("id", newRequest._id));
    // 201 is the HTTP code for when we successfully
    // create a new resource (a request in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpStatus.CREATED);
  }

  /*
   * Parses the list of request form items and adds any included in the request URL to the map stored in
   * the request class
   */
  public Request constructNewRequest(Context ctx){
      Request newRequest = new Request();
      String[] items = ItemList.formItems;
      for(int i = 0; i < items.length; i++){
      }
      return newRequest;
  }
  /**
   * Delete the user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */

  public void deleteRequest(Context ctx) {
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


  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  @SuppressWarnings("lgtm[java/weak-cryptographic-algorithm]")
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    StringBuilder result = new StringBuilder();
    for (byte b : hashInBytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }
}
