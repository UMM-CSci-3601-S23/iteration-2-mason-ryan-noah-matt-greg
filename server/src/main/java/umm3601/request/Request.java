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

  public LocalDateTime timeSubmitted;
  public String[] selections;

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

  public void setSelections(String[] sel){
    this.selections = sel;
  }
}
