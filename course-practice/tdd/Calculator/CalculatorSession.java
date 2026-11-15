import java.util.Scanner;

public class CalculatorSession {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Calculator calc = new Calculator();

        System.out.println("Simple Calculator. Type q to quit.");
        
        while (true) {
            try {
                System.out.print("Enter first number (or q to quit): ");
                String input1 = scanner.nextLine();
                if (input1.equalsIgnoreCase("q")) break;

                System.out.print("Enter second number: ");
                String input2 = scanner.nextLine();

                double num1 = Double.parseDouble(input1);
                double num2 = Double.parseDouble(input2);

                System.out.print("Choose operation (+, -, *, /): ");
                String op = scanner.nextLine();

                double result;

                switch (op) {
                    case "+":
                        result = calc.add(num1, num2);
                        break;
                    case "-":
                        result = calc.subtract(num1, num2);
                        break;
                    case "*":
                        result = calc.multiply(num1, num2);
                        break;
                    case "/":
                        result = calc.divide(num1, num2);
                        break;
                    case "q":
                    case "quit":
                        System.out.println("Exiting calculator...");
                        scanner.close();
                        return;
                    default:
                        System.out.println("Unknown operation. Choose +, -, *, /, or q.");
                        continue;
                }

                System.out.println("Result: " + result);

            } catch (NumberFormatException e) {
                System.out.println("Invalid number. Please try again.");
            } catch (ArithmeticException e) {
                System.out.println(e.getMessage());
            } catch (Exception e) {
                System.out.println("Unexpected error: " + e.getMessage());
            }
        }

        System.out.println("Goodbye!");
        scanner.close();
    }
}