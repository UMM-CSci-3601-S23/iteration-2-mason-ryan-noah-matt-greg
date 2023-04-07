package umm3601.item;

import static com.mongodb.client.model.Filters.eq;
import java.util.ArrayList;
import com.mongodb.client.MongoDatabase;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import java.util.Map;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import java.security.NoSuchAlgorithmException;

public class ItemController {
  static final String ITEM_TYPE_KEY = "itemType";
  static final String FOOD_TYPE_KEY = "foodType";
  static final String SORT_ORDER_KEY = "sortorder";
  private static final String ITEM_NAME_REGEX = "^(.*)$";


  private final JacksonMongoCollection<Item> itemCollection;

  public ItemController(MongoDatabase database) {
    itemCollection = JacksonMongoCollection.builder().build(
      database,
      "inventory",
      Item.class,
      UuidRepresentation.STANDARD);
  }
  /**
   * Set the JSON body of the response to be the single Item
   * specified by the `id` parameter in the Item
   *
   * @param ctx a Javalin HTTP context
   */
  public void getItem(Context ctx) {
    String id = ctx.pathParam("id");
    Item item;

    try {
      item = itemCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired Item id wasn't a legal Mongo Object ID.");
    }
    if (item == null) {
      throw new NotFoundResponse("The desired Item was not found");
    } else {
      ctx.json(item);
      ctx.status(HttpStatus.OK);
    }
  }

  /**
   * Set the JSON body of the response to be a list of all the items returned from the database
   * that match any itemed filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */
  public void getItems(Context ctx) {

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the items with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<Item> matchingItems = itemCollection.find().into(new ArrayList<>());
    System.out.println(matchingItems.toString());
    // Set the JSON body of the response to be the list of items returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json

    ctx.json(matchingItems);

    // Explicitly set the context status to OK
    ctx.status(HttpStatus.OK);
  }


  public void addNewItem(Context ctx) {

    //Method 1:
    Item newItem = ctx.bodyValidator(Item.class)
      .check(req -> req.itemName.matches(ITEM_NAME_REGEX), "Item must contain valid item name")
      .check(req -> req.unit.matches(ITEM_NAME_REGEX), "Unit must contain a valid string")
      .check(req -> (req.amount > -1), "Amount must be greater than zero").get();


    itemCollection.insertOne(newItem);


    ctx.json(Map.of("id", newItem._id));
    // 201 is the HTTP code for when we successfully
    // create a new resource (a item in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpStatus.CREATED);
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

