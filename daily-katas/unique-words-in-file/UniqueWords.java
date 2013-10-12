import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class UniqueWords {
    private final Map<String,AtomicInteger> counts = new HashMap<>();

    public Map<String,Integer> getCounts() {
        Map<String,Integer> copy = new HashMap<>();
        for (Map.Entry<String, AtomicInteger> e: counts.entrySet()) {
            copy.put(e.getKey(), e.getValue().get());
        }
        return copy;
    }

    public Map<String,AtomicInteger> getRawCounts() {
        return counts;
    }

    public void addFile(File f) throws IOException {
        for (String line: toLines(f)) {
            for (String word: line.trim().split("(\\-\\-|\\s+)")) {
                String cleaned = clean(word);
                if (cleaned == null || cleaned == "") continue;
                if (! counts.containsKey(cleaned)) {
                    counts.put(cleaned, new AtomicInteger(0));
                }
                counts.get(cleaned).incrementAndGet();
            }
        }
    }

    private Iterable<String> toLines(final File f) throws IOException {
        List<String> lines = new ArrayList<>();
        BufferedReader reader = new BufferedReader(new FileReader(f));
        String line;
        while ((line = reader.readLine()) != null) {
            lines.add(line);
        }
        return lines;
    }
    
    private String clean(String word) {
        return word.matches("^\\d+$") ? null : word.toLowerCase().replaceAll("[\\W_]", "");
    }

    public static void main(String ... args) throws Exception {
        UniqueWords counter = new UniqueWords();
        for (String filename: args) {
            counter.addFile(new File(filename));
        }

        //printAsIs(counter);
        printSorted(counter);
    }

    private static void printAsIs(UniqueWords counter) {
        for (Map.Entry<String,AtomicInteger> e: counter.getRawCounts().entrySet()) {
            System.out.println(String.format("%15s: %s", e.getKey(), e.getValue().get()));
        }
    }

    private static void printSorted(UniqueWords counter) {
        Comparator<Map.Entry> c = new Comparator<Map.Entry>() {
            public int compare(Map.Entry a, Map.Entry b) {
                int aNum = ((AtomicInteger)a.getValue()).get();
                int bNum = ((AtomicInteger)b.getValue()).get();
                if (bNum > aNum) return 1;
                if (bNum < aNum) return -1;
                return ((String)a.getKey()).compareTo((String)b.getKey());
            }
        };
        Map<String,AtomicInteger> counts = counter.getRawCounts();
        Map.Entry[] entries = new Map.Entry[counts.size()];
        int index = 0;
        for (Map.Entry<String,AtomicInteger> e: counts.entrySet()) {
            entries[index++] = e;
        }
        Arrays.sort(entries, c);
        for (Map.Entry e: entries) {
            System.out.println(String.format("%15s: %s", e.getKey(), ((AtomicInteger)e.getValue()).get()));
        }
    }
}
