import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class CalculatorTest {

    @Test
    void testAdd() {
        Calculator calc = new Calculator();
        assertEquals(8.0, calc.add(5.0, 3.0));
        assertEquals(0.0, calc.add(-2.0, 2.0));
    }

    @Test
    void testSubtract() {
        Calculator calc = new Calculator();
        assertEquals(2.0, calc.subtract(5.0, 3.0));
    }

    @Test
    void testMultiply() {
        Calculator calc = new Calculator();
        assertEquals(15.0, calc.multiply(5.0, 3.0));
    }

    @Test
    void testDivide_NormalFlow() {
        Calculator calc = new Calculator();
        assertEquals(5.0, calc.divide(10.0, 2.0));
        assertEquals(4.0, calc.divide(2.4, 0.6));
    }

    @Test
    void testDivide_ByZero() {
        Calculator calc = new Calculator();
        Exception exception = assertThrows(ArithmeticException.class, () -> {
            calc.divide(10.0, 0.0);
        });
        assertEquals("Cannot divide by zero.", exception.getMessage());
    }
}