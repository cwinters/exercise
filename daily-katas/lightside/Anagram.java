import java.util.Arrays;

public class Anagram {
  public static void main(String ... args) {
    if (args.length != 2 ) {
      p("Expected two strings, get that garbage out of here!");
      System.exit(1);
    }
    p("" + isAnagram(args[0], args[1]));
  }

  public static boolean isAnagram(String a, String b) {
    if (a.equals(b) || a.length() != b.length()) {
      return false;
    }
    char[] aChars = toChars(a);
    char[] bChars = toChars(b);
    for (int i = 0; i < aChars.length; i++) {
      if (aChars[i] != bChars[i]) {
        return false;
      }
    }
    return true;
  }

  private static char[] toChars(String s) {
    char[] chars = s.toCharArray();
    Arrays.sort(chars);
    return chars;
  }

  private static void p(String msg) {System.out.println(msg);}
}
