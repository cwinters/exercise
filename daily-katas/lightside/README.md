Exercise 1:

The instructions were contradictory, since any number evenly divisible by 6
will also be evenly divisible by 3. So the program will never print 'bar'.

    $ ruby foobar.rb 10 20
    10
    11
    foobar
    13
    14
    foo
    16
    17
    foobar
    19
    20

Exercise 2:

    $ javac Anagram.java
    $ java Anagram hello hi
    false
    $ java Anagram listen silent
    true

Exercise 3:

Run against a local postgres database with:

    $ createdb tracking
    $ psql -f exercise_3.sql tracking

I renamed `class` to `classroom` because `class` is a reserved word in either
SQL or Postgres.

This could be made faster if:

- You created an index on `student` with:

        CREATE INDEX student_name ON student(last_name, first_name)

- You created an index on `classroom` with:

        CREATE INDEX class_school ON classroom(school);

It would be a good idea to normalize the school into its own table as well.
