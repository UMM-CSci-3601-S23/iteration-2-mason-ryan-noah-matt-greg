package umm3601.form;

import static com.mongodb.client.model.Filters.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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

import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;

/**
 * Tests the logic of the FormController
 *
 * @throws IOException
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber" })
class FormControllerSpec {

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private FormController formController;

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
  // private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Form>> formArrayListCaptor;

  @Captor
  private ArgumentCaptor<Form> formCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  /**
   * Sets up (the connection to the) DB once; that connection and DB will
   * then be (re)used for all the tests, and closed in the `teardown()`
   * method. It's somewhat expensive to establish a connection to the
   * database, and there are usually limits to how many connections
   * a database will support at once. Limiting ourselves to a single
   * connection that will be shared across all the tests in this spec
   * file helps both speed things up and reduce the load on the DB
   * engine.
   */
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
  * Tests the logic of the FormController
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
    MongoCollection<Document> formDocuments = db.getCollection("forms");
    formDocuments.drop();
    List<Document> testForms = new ArrayList<>();

    List<String> selections1 = Arrays.asList("Fruit", "more Fruit", "and fruit");
    List<String> selections2 = Arrays.asList("Diapers");
    testForms.add(
        new Document()
            .append("name", "Greg")
            .append("timeSubmitted", "")
            .append("diaperSize", "")
            .append("selections", selections1));
    testForms.add(
        new Document()
        .append("timeSubmitted", "")
            .append("diaperSize", "")
            .append("name", "anonymous")
            .append("selections", selections2));

    samsId = new ObjectId();
    Document sam = new Document()
        .append("_id", samsId)
        .append("timeSubmitted", "")
        .append("diaperSize", "")
        .append("selections", selections1);

    formDocuments.insertMany(testForms);
    formDocuments.insertOne(sam);

    formController = new FormController(db);
  }

  @Test
  void canGetAllForms() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in this case where we want all users)
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());

    // Now, go ahead and ask the userController to getUsers
    // (which will, indeed, ask the context for its queryParamMap)
    formController.getForms(ctx);

    // We are going to capture an argument to a function, and the type of that argument will be
    // of type ArrayList<User> (we said so earlier using a Mockito annotation like this):
    // @Captor
    // private ArgumentCaptor<ArrayList<User>> userArrayListCaptor;
    // We only want to declare that captor once and let the annotation
    // help us accomplish reassignment of the value for the captor
    // We reset the values of our annotated declarations using the command
    // `MockitoAnnotations.openMocks(this);` in our @BeforeEach


    verify(ctx).json(formArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Check that the database collection holds the same number of documents as the size of the captured List<User>
    assertEquals(db.getCollection("forms").countDocuments(), formArrayListCaptor.getValue().size());
  }

  @Test
  void deleteFoundRequest() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    // Request exists before deletion
    assertEquals(1, db.getCollection("forms").countDocuments(eq("_id", new ObjectId(testID))));

    formController.deleteForm(ctx);

    verify(ctx).status(HttpStatus.OK);

    // request is no longer in the database
    assertEquals(0, db.getCollection("forms").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundRequest() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    formController.deleteForm(ctx);
    // Request is no longer in the database
    assertEquals(0, db.getCollection("forms").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      formController.deleteForm(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);

    // Request is still not in the database
    assertEquals(0, db.getCollection("forms").countDocuments(eq("_id", new ObjectId(testID))));
  }

}
