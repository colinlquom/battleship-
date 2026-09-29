import Ship from "../src/ship"; 

describe("Ship", () => {
	test("has a length, zero hits, and is not sunk at start", () => {
		const ship = new Ship(3); 
		expect(ship.length).toBe(3);
		expect(ship.hits).toBe(0); 
		expect(ship.isSunk()).toBe(false);
	});

	 test("hit() increases the number of hits", () => {
 		 const ship = new Ship(3);
  		 ship.hit();
   		 ship.hit();
   		 expect(ship.hits).toBe(2);
  	});

  test("is sunk once hits equal length", () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
})
