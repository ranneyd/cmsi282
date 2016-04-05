#define NUM_GIRLS 15
#define NUM_DAYS 7
#define GIRLS_IN_ROW 3
#define NUM_ROWS 5
#define ITERATIONS 20

#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <stdlib.h>
#include <time.h>


typedef struct {
	int layout[NUM_DAYS][NUM_ROWS][GIRLS_IN_ROW]; // How the girls are laid out for each day.
	bool partners[NUM_GIRLS][NUM_GIRLS];	// Array of arrays, each representing girls each girl has stood with
} GirlLayout;

GirlLayout copyLayout(GirlLayout layout);
void printLayout(GirlLayout layout);

int funcCalls;

/*
	day:  day we're trying to fill up
	row: row we're trying to put her in
	pos: position in row we're trying to put her in
	girlsPlacedToday: boolean array for each girl. We have to look up the girl we're
					  trying to place to see if she's already been placed today
*/
bool putSpot(GirlLayout * layout, int day, int row, int pos, bool * girlsPlacedToday) {
	
	// If it's the first slot of the day, we have to reset the girlsPlacedToday
	if (row == 0 && pos == 0) {
		bool newPlacedTable[NUM_GIRLS * sizeof(bool)];
		memset(newPlacedTable, false, NUM_GIRLS * sizeof(bool));
		// However, the first GIRLS_IN_ROW girls are in place already
		for (int i = 0; i < GIRLS_IN_ROW; ++i) {
			newPlacedTable[i] = true;
		}
		girlsPlacedToday = newPlacedTable;
	}

	// We have already placed the first GIRLS_IN_ROW girls for each day
	int firstGirl = GIRLS_IN_ROW;
	// We've done the first girl for the first GIRLS_IN_ROW rows already
	if (row < GIRLS_IN_ROW) {
		// First position is done
		if (pos == 0) {
			return putSpot(layout, day, row, pos + 1, girlsPlacedToday);
		}
	}
	else {
		// Since first column increases downward, our minimum is whoever is above us + 1
		if (pos == 0) {
			int topGirl = layout->layout[day][row - 1][pos] + 1;
			if (topGirl > firstGirl) {
				firstGirl = topGirl;
			}
		}
	}
	// Stick this here so it doesn't count the skips
	funcCalls++;

	// If we're not the first in this row
	if (pos > 0) {
		// Rows are sequential, so we can elimintate girls less than the girl to our left
		int leftGirl = layout->layout[day][row][pos - 1] + 1;
		if (leftGirl > firstGirl) {
			firstGirl = leftGirl;
		}
	}
	// If we are in the middle position in the top row
	if (row == 0 && pos == GIRLS_IN_ROW / 2) {
		// Middle girls increase as well
		int middleGirl = layout->layout[day - 1][row][pos] + 1;
		if (middleGirl > firstGirl) {
			firstGirl = middleGirl;
		}
	}

	int lastGirl = NUM_GIRLS - 1;
	// last GIRLS_IN_ROW girls can only go in the last column. So if we're not in the last column, the last
	// girl we can place is NUM_GIRLS - 1 - GIRLS_IN_ROW
	if (pos < GIRLS_IN_ROW - 1) {
		lastGirl = NUM_GIRLS - 1 - GIRLS_IN_ROW;
	}

	for (int girl = firstGirl; girl <= lastGirl; ++girl) {
		// Have we been placed today?
		if (!girlsPlacedToday[girl]) {
			// check the other girls in the row to see if we've been with them already
			bool problem = false;
			for (int i = 0; i < pos; ++i) {
				int thisGirl = layout->layout[day][row][i];
				if (layout->partners[girl][thisGirl]) {
					problem = true;
				}
			}
			if (!problem) {
				// So far, the story checks out and we can stick her in
				layout->layout[day][row][pos] = girl;
				// Update our table of stood-next-to's
				for (int i = 0; i < pos; ++i) {
					int thisGirl = layout->layout[day][row][i];
					layout->partners[girl][thisGirl] = true;
					layout->partners[thisGirl][girl] = true;
				}
				// Mark that we placed this girl today
				girlsPlacedToday[girl] = true;

				// Move on to the next one
				int newDay = day;
				int newRow = row;
				int newPos = pos + 1;
				if (newPos == GIRLS_IN_ROW) {
					newPos = 0;
					newRow += 1;
				}
				if (newRow == NUM_ROWS) {
					newRow = 0;
					newDay += 1;
				}
				if (newDay == NUM_DAYS) {
					// we won!
					return true;
				}
				bool result = putSpot(layout, newDay, newRow, newPos, girlsPlacedToday);
				if (result) {
					// We also win, because we successfully placed this girl in this row
					return true;
				}
				// If it wasn't a success we have to backtrack and undo setting the girl

				layout->layout[day][row][pos] = -1;
				for (int i = 0; i < pos; ++i) {
					int thisGirl = layout->layout[day][row][i];
					layout->partners[girl][thisGirl] = false;
					layout->partners[thisGirl][girl] = false;
				}
				girlsPlacedToday[girl] = false;
			}
		}
	}
	return false;
}

bool setup(GirlLayout * layout) {
	// We can do the first column, so we can get that out of the way.
	for (int row = 0; row < NUM_ROWS; ++row) {
		for (int girl = 0; girl < GIRLS_IN_ROW; ++girl) {
			// Just do it in order
			layout->layout[0][row][girl] = row * GIRLS_IN_ROW + girl;

			// Set the partner table. Doesn't matter if someone marks themself as true
			for (int neighbor = 0; neighbor < GIRLS_IN_ROW; ++neighbor) {
				layout->partners[girl][neighbor] = true;
			}
		}
	}
	// The first girl for every subsequent day, going down, is always 0, 1, 2
	for (int day = 1; day < NUM_DAYS; ++day) {
		for (int girl = 0; girl < GIRLS_IN_ROW; ++girl) {
			layout->layout[day][girl][0] = girl;
		}
	}

	return true;
}

void printLayout(GirlLayout layout) {
	for (int row = 0; row < NUM_ROWS; ++row) {
		for (int day = 0; day < NUM_DAYS; ++day) {
			for (int girl = 0; girl < GIRLS_IN_ROW; ++girl) {
				int thisGirl = layout.layout[day][row][girl];
				if (thisGirl > -1) {
					printf("%c", thisGirl + 'A');
				}
			}
			printf("\t");
		}
		printf("\n");
	}
}

bool kirkman(GirlLayout * girls) {
	bool girlsPlacedToday[NUM_GIRLS];
	bool result = setup(girls);
	if (result) {
		return putSpot(girls, 1, 0, 0, girlsPlacedToday);
	}
	return result;
}

int main(){
	GirlLayout girls;

	double sumMillis = 0;

	for (int i = 0; i < ITERATIONS; ++i) {
		funcCalls = 0;
		memset(&girls.layout, -1, NUM_DAYS * NUM_ROWS * GIRLS_IN_ROW * sizeof(int));
		memset(&girls.partners, 0, NUM_GIRLS * NUM_GIRLS * sizeof(bool));
		clock_t start = clock(), diff;
		bool result = kirkman(&girls);
		diff = clock() - start;

		sumMillis += diff;

		double seconds = diff * 1.0 / CLOCKS_PER_SEC;
		printf("Success: %d FuncCalls: %d Time: %f\n", result, funcCalls, seconds);
	}
	printLayout(girls);

	double finalAverage = sumMillis / ITERATIONS / CLOCKS_PER_SEC;

	printf("Final average time: %f", finalAverage);

	return 0;
} 
