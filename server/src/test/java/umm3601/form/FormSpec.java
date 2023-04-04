package umm3601.form;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class FormSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Form request1;
  private Form request2;

  @BeforeEach
  void setupEach() {
    request1 = new Form();
    request2 = new Form();
  }

  @Test
  void requestWithEqualIdAreEqual() {
    request1._id = FAKE_ID_STRING_1;
    request2._id = FAKE_ID_STRING_1;

    assertTrue(request1.equals(request2));
  }

  @Test
  void requestWithDifferentIdAreNotEqual() {
    request1._id = FAKE_ID_STRING_1;
    request2._id = FAKE_ID_STRING_2;

    assertFalse(request1.equals(request2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    request1._id = FAKE_ID_STRING_1;
    request2._id = FAKE_ID_STRING_1;

    assertTrue(request1.hashCode() == request2.hashCode());
  }

  @SuppressWarnings({"unlikely-arg-type"})
  @Test
  void requestAreNotEqualToOtherKindsOfThings() {
    request1._id = FAKE_ID_STRING_1;
    // a request is not equal to its id even though id is used for checking equality
    assertFalse(request1.equals(FAKE_ID_STRING_1));
  }
}
