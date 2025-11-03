// Multi-Subject Quiz Questions
const quizSubjects = {
    java: {
        name: "Java Programming",
        icon: "fab fa-java",
        color: "#ed8b00",
        questions: [
            {
                question: "What is the default value of a boolean variable in Java?",
                options: ["true", "false", "0", "null"],
                correctAnswer: 1,
                explanation: "In Java, the default value of a boolean variable is 'false'."
            },
            {
                question: "Which keyword is used to inherit a class in Java?",
                options: ["implements", "extends", "inherits", "super"],
                correctAnswer: 1,
                explanation: "The 'extends' keyword is used for class inheritance in Java."
            },
            {
                question: "What is the size of an int in Java?",
                options: ["16 bits", "32 bits", "64 bits", "Depends on the platform"],
                correctAnswer: 1,
                explanation: "In Java, an int is always 32 bits, regardless of the platform."
            },
            {
                question: "Which method is the entry point of a Java application?",
                options: ["start()", "main()", "run()", "execute()"],
                correctAnswer: 1,
                explanation: "The main() method is the entry point of any Java application."
            },
            {
                question: "What is the purpose of the 'final' keyword in Java?",
                options: ["To indicate a constant value", "To prevent method overriding", "To prevent class inheritance", "All of the above"],
                correctAnswer: 3,
                explanation: "The 'final' keyword can be used for variables (constants), methods (no overriding), and classes (no inheritance)."
            },
            {
                question: "Which collection class allows duplicate elements and maintains insertion order?",
                options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
                correctAnswer: 2,
                explanation: "ArrayList allows duplicates and maintains insertion order, unlike Sets which don't allow duplicates."
            },
            {
                question: "What is polymorphism in Java?",
                options: ["The ability to take multiple forms", "The process of hiding implementation details", "The mechanism of bundling data and methods", "The concept of inheriting properties"],
                correctAnswer: 0,
                explanation: "Polymorphism allows an object to take multiple forms, typically through method overriding and overloading."
            },
            {
                question: "Which exception is thrown when dividing by zero in Java?",
                options: ["NullPointerException", "ArithmeticException", "DivideByZeroException", "NumberFormatException"],
                correctAnswer: 1,
                explanation: "Dividing by zero in Java throws an ArithmeticException."
            },
            {
                question: "What is the output of: System.out.println(10 + 20 + 'Hello' + 10 + 20);",
                options: ["30Hello30", "30Hello1020", "1020Hello1020", "Error"],
                correctAnswer: 1,
                explanation: "First 10+20=30, then 30+'Hello'='30Hello', then '30Hello'+10='30Hello10', then '30Hello10'+20='30Hello1020'."
            },
            {
                question: "Which of the following is NOT a valid Java identifier?",
                options: ["_variable", "2variable", "$variable", "variable2"],
                correctAnswer: 1,
                explanation: "Identifiers cannot start with a digit in Java. '2variable' is invalid."
            }
        ]
    },
    
    python: {
        name: "Python Programming",
        icon: "fab fa-python",
        color: "#3776ab",
        questions: [
            {
                question: "What is the output of: print(3 * 'Hello') in Python?",
                options: ["HelloHelloHello", "3Hello", "Error", "Hello 3 times"],
                correctAnswer: 0,
                explanation: "In Python, multiplying a string by an integer repeats the string that many times."
            },
            {
                question: "Which of the following is used to define a function in Python?",
                options: ["function", "def", "define", "func"],
                correctAnswer: 1,
                explanation: "The 'def' keyword is used to define functions in Python."
            },
            {
                question: "What does the 'len()' function return for a dictionary?",
                options: ["Number of keys", "Number of values", "Number of key-value pairs", "Total characters in all keys"],
                correctAnswer: 2,
                explanation: "len() returns the number of key-value pairs in a dictionary."
            },
            {
                question: "Which data type is mutable in Python?",
                options: ["tuple", "string", "list", "int"],
                correctAnswer: 2,
                explanation: "Lists are mutable, meaning they can be changed after creation, unlike tuples and strings."
            },
            {
                question: "What is the purpose of 'if __name__ == '__main__':' in Python?",
                options: ["To define the main function", "To check if the script is run directly", "To import modules", "To create a class constructor"],
                correctAnswer: 1,
                explanation: "This condition checks if the script is being run directly (not imported as a module)."
            },
            {
                question: "Which method is used to add an element to a list in Python?",
                options: ["append()", "add()", "insert()", "push()"],
                correctAnswer: 0,
                explanation: "The append() method adds an element to the end of a list."
            },
            {
                question: "What does the 'range(5)' function generate?",
                options: ["[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4, 5]", "[5]"],
                correctAnswer: 0,
                explanation: "range(5) generates numbers from 0 to 4 (5 numbers total)."
            },
            {
                question: "Which operator is used for exponentiation in Python?",
                options: ["^", "**", "^^", "pow"],
                correctAnswer: 1,
                explanation: "The ** operator is used for exponentiation in Python (e.g., 2**3 = 8)."
            },
            {
                question: "What is the output of: print([1, 2, 3] + [4, 5])?",
                options: ["[1, 2, 3, 4, 5]", "[5, 7, 3]", "Error", "[1, 2, 3][4, 5]"],
                correctAnswer: 0,
                explanation: "The + operator concatenates lists in Python."
            },
            {
                question: "Which of these is NOT a built-in data type in Python?",
                options: ["list", "dictionary", "array", "tuple"],
                correctAnswer: 2,
                explanation: "Array is not a built-in data type; it's available through the array module."
            }
        ]
    },
    
    web: {
        name: "Web Development",
        icon: "fas fa-code",
        color: "#f7df1e",
        questions: [
            {
                question: "What does CSS stand for?",
                options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
                correctAnswer: 2,
                explanation: "CSS stands for Cascading Style Sheets."
            },
            {
                question: "Which HTML tag is used to create a hyperlink?",
                options: ["&lt;link&gt;", "&lt;a&gt;", "&lt;href&gt;", "&lt;hyperlink&gt;"],
                correctAnswer: 1,
                explanation: "The &lt;a&gt; tag is used to create hyperlinks in HTML."
            },
            {
                question: "What is the purpose of JavaScript in web development?",
                options: ["To style web pages", "To add interactivity", "To structure content", "To connect to databases"],
                correctAnswer: 1,
                explanation: "JavaScript is used to add interactivity and dynamic behavior to web pages."
            },
            {
                question: "Which CSS property is used to change the text color?",
                options: ["text-color", "font-color", "color", "text-style"],
                correctAnswer: 2,
                explanation: "The 'color' property is used to change text color in CSS."
            },
            {
                question: "What does API stand for in web development?",
                options: ["Application Programming Interface", "Advanced Programming Interface", "Application Page Integration", "Automated Programming Interface"],
                correctAnswer: 0,
                explanation: "API stands for Application Programming Interface."
            },
            {
                question: "Which method is used to select an element by its ID in JavaScript?",
                options: ["document.querySelector()", "document.getElementById()", "document.getElementByClass()", "document.findElement()"],
                correctAnswer: 1,
                explanation: "getElementById() is used to select an element by its ID."
            },
            {
                question: "What is the purpose of media queries in CSS?",
                options: ["To play media files", "To create responsive designs", "To optimize images", "To add animations"],
                correctAnswer: 1,
                explanation: "Media queries are used to create responsive designs that adapt to different screen sizes."
            },
            {
                question: "Which HTML5 tag is used for navigation links?",
                options: ["&lt;nav&gt;", "&lt;menu&gt;", "&lt;navigation&gt;", "&lt;links&gt;"],
                correctAnswer: 0,
                explanation: "The &lt;nav&gt; tag is used to define navigation links in HTML5."
            },
            {
                question: "What is the box model in CSS?",
                options: ["A way to create 3D effects", "The model that describes element layout", "A method for organizing code", "A technique for animation"],
                correctAnswer: 1,
                explanation: "The CSS box model describes how elements are laid out with content, padding, border, and margin."
            },
            {
                question: "Which JavaScript keyword is used to declare a variable?",
                options: ["variable", "var", "let", "Both let and var"],
                correctAnswer: 3,
                explanation: "Both 'let' and 'var' can be used to declare variables in JavaScript (with 'let' being preferred in modern code)."
            }
        ]
    }
};
