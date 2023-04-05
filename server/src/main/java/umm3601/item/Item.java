package umm3601.item;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})

public class Item {
  @ObjectId @Id

  @SuppressWarnings({"MemberName"})

  public String _id;

  public String itemName;
  public int amount;
  public String unit;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Item)) {
      return false;
    }
    Item other = (Item) obj;
    return _id.equals((other._id));
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }

  public void setItemName(String in) {
    this.itemName = in;
  }

  public void setAmount(int am) {
    this.amount = am;
  }

  public void setUnit(String un) {
    this.unit = un;
  }
}
