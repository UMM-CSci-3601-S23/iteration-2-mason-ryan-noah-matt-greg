package umm3601.request;

import org.mongojack.Id;
import org.mongojack.ObjectId;

import java.time.LocalDateTime;
import java.util.HashMap;

@SuppressWarnings({"VisibilityModifier"})

public class Request {
  @ObjectId @Id

  @SuppressWarnings({"MemberName"})

  public String _id;

  // Exhaustive list of items on the physical request form
  public ItemList itemList = new ItemList();
  public String[] formItems = itemList.formItems;

  public LocalDateTime timeSubmitted;
  public HashMap<String, Boolean> selections;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Request)) {
      return false;
    }
    Request other = (Request) obj;
    return _id.equals((other._id));
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }

}
