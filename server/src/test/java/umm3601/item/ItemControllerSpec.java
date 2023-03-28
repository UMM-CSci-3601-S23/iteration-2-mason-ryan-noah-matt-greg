package umm3601.item;



import static com.mongodb.client.model.Filters.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;

/**
 * Tests the logic of the ItemController
 *
 * @throws IOException
 */
@SuppressWarnings({ "MagicNumber" })
class ItemControllerSpec {

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private ItemController itemController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId samsId;

  // The client and database that will be used
  // for all the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Item>> itemArrayListCaptor;

  @Captor
  private ArgumentCaptor<Item> itemCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;


  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build()
    );
    db = mongoClient.getDatabase("test");
  }

  @AfterAll/**
  * Tests the logic of the ItemController
  *
  * @throws IOException
  */
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    // Reset our mock context and argument captor (declared with Mockito annotations @Mock and @Captor)
    MockitoAnnotations.openMocks(this);

    // Setup database
    MongoCollection<Document> itemDocuments = db.getCollection("items");
    itemDocuments.drop();
    List<Document> testItems = new ArrayList<>();
    testItems.add(
        new Document()
            .append("itemName", "toothbrushes")
            .append("unit", "boxes")
            .append("amount", "123"));
    testItems.add(
        new Document()
            .append("itemName", "milk")
            .append("unit", "gallons")
            .append("amount", "12"));
    testItems.add(
        new Document()
            .append("itemName", "bread")
            .append("unit", "loafs")
            .append("amount", "113"));

    samsId = new ObjectId();
    Document sam = new Document()
        .append("_id", samsId)
        .append("itemName", "tomatoSoup")
        .append("unit", "cans")
        .append("amount", "2");

    itemDocuments.insertMany(testItems);
    itemDocuments.insertOne(sam);
    System.out.println(itemDocuments.countDocuments());
    itemController = new ItemController(db);
  }

  @Test
  void canGetAllItems() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in this case where we want all users)
    Map<String, List<String>> queryParams = new HashMap<>();
    when(ctx.queryParamMap()).thenReturn(queryParams);

    // Now, go ahead and ask the userController to getUsers
    // (which will, indeed, ask the context for its queryParamMap)
    itemController.getItems(ctx);

    // We are going to capture an argument to a function, and the type of that argument will be
    // of type ArrayList<User> (we said so earlier using a Mockito annotation like this):
    // @Captor
    // private ArgumentCaptor<ArrayList<User>> userArrayListCaptor;
    // We only want to declare that captor once and let the annotation
    // help us accomplish reassignment of the value for the captor
    // We reset the values of our annotated declarations using the command
    // `MockitoAnnotations.openMocks(this);` in our @BeforeEach

    // Specifically, we want to pay attention to the ArrayList<User> that is passed as input
    // when ctx.json is called --- what is the argument that was passed? We capture it and can refer to it later
    verify(ctx).json(itemArrayListCaptor.capture());
    System.out.println(itemArrayListCaptor.getValue());
    verify(ctx).status(HttpStatus.OK);

    // Check that the database collection holds the same number of documents as the size of the captured List<User>
    assertEquals(db.getCollection("items").countDocuments(), itemArrayListCaptor.getValue().size());
  }
  @Test
  void canGetItemsWithItemName() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    queryParams.put(ItemController.ITEM_TYPE_KEY, Arrays.asList(new String[] {"toothbrushes"}));
    queryParams.put(ItemController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    when(ctx.queryParamAsClass(ItemController.ITEM_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "toothbrushes", ItemController.ITEM_TYPE_KEY));

    itemController.getItems(ctx);

    verify(ctx).json(itemArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the requests passed to `json` work for food.
    for (Item item : itemArrayListCaptor.getValue()) {
      assertEquals("toothbrushes", item.itemName);
    }
  }


}
