package umm3601.item;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ItemSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Item item1;
  private Item item2;

  @BeforeEach
  void setupEach() {
    item1 = new Item();
    item2 = new Item();
  }

  @Test
  void itemWithEqualIdAreEqual() {
    item1._id = FAKE_ID_STRING_1;
    item2._id = FAKE_ID_STRING_1;

    assertTrue(item1.equals(item2));
  }
}
