use strict;
use integer;

use List::MoreUtils qw(first_index);

my @letters = qw{A B C D E F G H I J K L M N O P Q R S T U V W X Y Z};

sub cipher{
    my ( $msg, $key ) = @_;

    # what we're returning
    my $encrypted = "";

    # saving the index of our key separately since it wraps around
    my $keyIndex = 0;

    for( my $i = 0; $i < length($msg); ++$i) {
        my $letter = substr($msg, $i, 1);
        my $keyLetter = substr($key, $keyIndex, 1);

        # Amount we shift our alphabet by
        my $shift = first_index {$_ eq $keyLetter} @letters;
        # Position in the alphabet of our desired letter
        my $pos = first_index {$_ eq $letter} @letters;

        # Keep wrapping around in mind
        $encrypted .= $letters[($shift + $pos) % 26];

        # Still keeping wrapping around in mind
        $keyIndex = ($keyIndex + 1) % length $key;
    }

    return $encrypted;
}

my @tests = (
    ["", "EMPTY", ""],
    [qw{IDENTITY A IDENTITY}],
    [qw{ATTACKATDAWN LEMON LXFOPVEFRNHR}],
    [qw{CRYPTOISSHORTFORCRYPTOGRAPHY ABCD CSASTPKVSIQUTGQUCSASTPIUAQJB}],
    [qw{THISISATEST TEST MLALBWSMXWL}],
    [qw{HOMEWORKNUMBERTWO ALGORITHMS HZSSNWKRZMMMKFKEH}],
    [qw{WHYDOTHISINPYTHON PERL LLPODXYTHMEANXYZC}]
);

for( my $i = 0; $i < scalar(@tests); ++$i ) {
    my $test = @tests[$i];
    my $expected = $test->[2];
    my $result = cipher( $test->[0], $test->[1]);
    if( !($result eq $test->[2]) ){
        print "test $i failed. Expected $expected got $result\n"; 
    }
}