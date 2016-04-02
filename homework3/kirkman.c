#define NUM_GIRLS 4
#define NUM_DAYS 3
#define GIRLS_IN_ROW 2
#define NUM_ROWS 2

#include <stdio.h>
#include <string.h>
#include <stdbool.h>


typedef struct GirlLayouts {
	int layout[NUM_DAYS][NUM_ROWS][GIRLS_IN_ROW]; // How the girls are laid out for each day.
	bool partners[NUM_GIRLS][NUM_GIRLS];	// Array of arrays, each representing girls each girl has stood with
	bool success; // True if we successfully placed the girl, false otherwise
} GirlLayout;

GirlLayout copyLayout(GirlLayout layout);
void printLayout(GirlLayout layout);

//GirlLayout putGirl(GirlLayout layout, int girl, int day, int row);


GirlLayout putGirl(GirlLayout layout, int girl, int day, int row) {
	bool found = false;
	for (int i = 0; i < GIRLS_IN_ROW; ++i) {
		int thisGirl = layout.layout[day][row][i];
		// That's a spot!
		if (thisGirl == -1) {
			found = true;
			break;
		}
		// If we've stood next to her before, we can't be here
		if (layout.partners[girl][thisGirl]) {
			found = false;
			break;
		}
	}
	if (found) {
		GirlLayout newLayout = copyLayout(layout);
		for (int i = 0; i < GIRLS_IN_ROW; ++i) {
			int thisGirl = layout.layout[day][row][i];
			// That's the spot!
			if (thisGirl == -1) {
				// Stick me in there
				newLayout.layout[day][row][i] = girl;
				break;
			}
			// Remember we stood next to this one from now on
			else{
				newLayout.partners[girl][thisGirl] = true;
			}
		}
		
		// If this was the last girl, on to the next day (maybe)
		if (girl >= NUM_GIRLS - 1) {
			// If it's the last day, we won! The nightmare is over
			if (day >= NUM_DAYS - 1) {
				newLayout.success = true;
				return newLayout;
			}
			// Otherwise, start with girl 0 tomorrow
			else {
				return putGirl(newLayout, 0, day + 1, 0);
			}
		}
		// Otherwise, try this next girl from the top today
		GirlLayout result = putGirl(newLayout, girl + 1, day, 0);
		if (result.success) {
			return result;
		}
		// She didn't work? I guess we have to try me on the next row now
	}
	// Couldn't put me in this row, or putting me in that row leads to an unfortunate series of events?
	// Welp, try to stick me in the next row.
	// Unless that was the last row...
	if (row >= NUM_ROWS - 1) {
		// in which case we're screwed
		layout.success = false;
		return layout;
	}
	// pass in the old layout, this one is trash
	return putGirl(layout, girl, day, row + 1);
}

GirlLayout copyLayout(GirlLayout layout) {
	GirlLayout newLayout;

	int layoutLength = NUM_DAYS * NUM_ROWS * GIRLS_IN_ROW;
	memcpy(&newLayout.layout, &layout.layout, layoutLength * sizeof(int));
	int partnerLength = NUM_GIRLS * NUM_GIRLS;
	memcpy(&newLayout.partners, &layout.partners, partnerLength * sizeof(bool));

	newLayout.success = layout.success;
	return newLayout;
}

void printLayout(GirlLayout layout) {
	for (int row = 0; row < NUM_ROWS; ++row) {
		for (int day = 0; day < NUM_DAYS; ++day) {
			for (int girl = 0; girl < GIRLS_IN_ROW; ++girl) {
				printf("%d ", layout.layout[day][row][girl]);
			}
			printf("\t");
		}
		printf("\n");
	}
}

int main(){
	
	GirlLayout grills;

	memset(&grills.layout, -1, NUM_DAYS * NUM_ROWS * GIRLS_IN_ROW * sizeof(int));
	memset(&grills.partners, 0, NUM_GIRLS * NUM_GIRLS * sizeof(bool));

	grills.success = 0;

	GirlLayout result = putGirl(grills, 0, 0, 0);

	printf("Success? %d\n", result.success);

	printLayout(result);

	return 0;
} 
