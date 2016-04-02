#define NUM_GIRLS 15
#define NUM_DAYS 7
#define GIRLS_IN_ROW 3
#define NUM_ROWS 5

#include <stdio.h>
#include <string.h>
#include <stdbool.h>


typedef struct {
	int layout[NUM_DAYS][NUM_ROWS][GIRLS_IN_ROW]; // How the girls are laid out for each day.
	bool partners[NUM_GIRLS][NUM_GIRLS];	// Array of arrays, each representing girls each girl has stood with
	bool success; // True if we successfully placed the girl, false otherwise
} GirlLayout;

GirlLayout copyLayout(GirlLayout layout);
void printLayout(GirlLayout layout);

int funcCalls;


GirlLayout putGirl(GirlLayout layout, int girl, int day, int row) {
	funcCalls++;
	//printf("Trying girl %d on day %d in row %d\n", girl, day, row);
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
			//printf("dis bitch %d is already here\n", thisGirl);
			found = false;
			break;
		}
	}
	if (found) {
		//printf("Found a spot!\n");
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
				//printf("The nightmare should be over\n");
				newLayout.success = true;
				return newLayout;
			}
			// Otherwise, start with girl 0 tomorrow
			else {
				//printf("Onto the next day!\n");
				return putGirl(newLayout, 0, day + 1, 0);
			}
		}
		// Otherwise, try this next girl from the top today
		//printf("Trying next grill\n");
		GirlLayout result = putGirl(newLayout, girl + 1, day, 0);
		if (result.success) {
			//printf("I am girl %d on day %d and being in row %d worked\n", girl, day, row);
			return result;
		}
		// She didn't work? I guess we have to try me on the next row now
	}

	//printf("I am girl %d on day %d and row %d did not work for me\n", girl, day, row);
	// Couldn't put me in this row, or putting me in that row leads to an unfortunate series of events?
	// Welp, try to stick me in the next row.
	// Unless that was the last row...
	if (row >= NUM_ROWS - 1) {
		//printf("Last row scamaz :(\n");
		// in which case we're screwed
		layout.success = false;
		return layout;
	}
	// pass in the old layout, this one is trash
	//printf("Trying the next row\n");
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
				int thisGirl = layout.layout[day][row][girl];
				
				// If only one digit, add an extra space
				if (thisGirl / 10 == 0) {
					printf(" ");
				}
				
				printf("%d ", thisGirl);
			}
			printf("\t");
		}
		printf("\n");
	}
}

int main(){
	funcCalls = 0;
	GirlLayout grills;

	memset(&grills.layout, -1, NUM_DAYS * NUM_ROWS * GIRLS_IN_ROW * sizeof(int));
	memset(&grills.partners, 0, NUM_GIRLS * NUM_GIRLS * sizeof(bool));

	grills.success = 0;

	GirlLayout result = putGirl(grills, 0, 0, 0);

	printf("Success: %d FuncCalls: %d\n", result.success, funcCalls);

	printLayout(result);

	return 0;
} 
