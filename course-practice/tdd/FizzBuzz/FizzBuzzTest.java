package com.tdd.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class FizzBuzzTest {

	@Test
	public void shouldProcessInput() {
	    FizzBuzz fizzBuzz = new FizzBuzz();

	    assertEquals(fizzBuzz.processNumber(1),"1");
	    assertEquals(fizzBuzz.processNumber(2),"2");
	    assertEquals(fizzBuzz.processNumber(3),"Fizz");
	    assertEquals(fizzBuzz.processNumber(5),"Buzz");
	    assertEquals(fizzBuzz.processNumber(6),"Fizz");
	    assertEquals(fizzBuzz.processNumber(10),"Buzz");
	    assertEquals(fizzBuzz.processNumber(15),"FizzBuzz");
	    assertEquals(fizzBuzz.processNumber(30), "FizzBuzz");
	}

}
