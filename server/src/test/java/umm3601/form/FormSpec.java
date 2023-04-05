package umm3601.form;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class FormSpec {

  private static final String FAKE_ID_STRING_1 = "fakeIdOne";
  private static final String FAKE_ID_STRING_2 = "fakeIdTwo";

  private Form form1;
  private Form form2;

  @BeforeEach
  void setupEach() {
    form1 = new Form();
    form2 = new Form();
  }

  @Test
  void requestWithEqualIdAreEqual() {
    form1._id = FAKE_ID_STRING_1;
    form2._id = FAKE_ID_STRING_1;

    assertTrue(form1.equals(form2));
  }

  @Test
  void requestWithDifferentIdAreNotEqual() {
    form1._id = FAKE_ID_STRING_1;
    form2._id = FAKE_ID_STRING_2;

    assertFalse(form1.equals(form2));
  }

  @Test
  void hashCodesAreBasedOnId() {
    form1._id = FAKE_ID_STRING_1;
    form2._id = FAKE_ID_STRING_1;

    assertTrue(form1.hashCode() == form2.hashCode());
  }

  @SuppressWarnings({"unlikely-arg-type"})
  @Test
  void requestAreNotEqualToOtherKindsOfThings() {
    form1._id = FAKE_ID_STRING_1;
    // a request is not equal to its id even though id is used for checking equality
    assertFalse(form1.equals(FAKE_ID_STRING_1));
  }
}
