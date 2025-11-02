// Java Programming Quiz Questions
const quizQuestions = [
    {
        question: "What is the default value of a boolean variable in Java?",
        options: [
            "true",
            "false",
            "0",
            "null"
        ],
        correctAnswer: 1,
        explanation: "In Java, the default value of a boolean variable is 'false'."
    },
    {
        question: "Which of the following is NOT a valid Java identifier?",
        options: [
            "_variable",
            "2variable",
            "$variable",
            "variable2"
        ],
        correctAnswer: 1,
        explanation: "Identifiers cannot start with a digit in Java. '2variable' is invalid."
    },
    {
        question: "What is the size of an int in Java?",
        options: [
            "16 bits",
            "32 bits",
            "64 bits",
            "Depends on the platform"
        ],
        correctAnswer: 1,
        explanation: "In Java, an int is always 32 bits, regardless of the platform."
    },
    {
        question: "Which keyword is used to inherit a class in Java?",
        options: [
            "implements",
            "extends",
            "inherits",
            "super"
        ],
        correctAnswer: 1,
        explanation: "The 'extends' keyword is used for class inheritance in Java."
    },
    {
        question: "What is the output of: System.out.println(10 + 20 + 'Hello' + 10 + 20);",
        options: [
            "30Hello30",
            "30Hello1020",
            "1020Hello1020",
            "Error"
        ],
        correctAnswer: 1,
        explanation: "First 10+20=30, then 30+'Hello'='30Hello', then '30Hello'+10='30Hello10', then '30Hello10'+20='30Hello1020'."
    },
    {
        question: "Which method is the entry point of a Java application?",
        options: [
            "start()",
            "main()",
            "run()",
            "execute()"
        ],
        correctAnswer: 1,
        explanation: "The main() method is the entry point of any Java application."
    },
    {
        question: "What is the purpose of the 'final' keyword in Java?",
        options: [
            "To indicate a constant value",
            "To prevent method overriding",
            "To prevent class inheritance",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "The 'final' keyword can be used for variables (constants), methods (no overriding), and classes (no inheritance)."
    },
    {
        question: "Which collection class allows duplicate elements and maintains insertion order?",
        options: [
            "HashSet",
            "TreeSet",
            "ArrayList",
            "HashMap"
        ],
        correctAnswer: 2,
        explanation: "ArrayList allows duplicates and maintains insertion order, unlike Sets which don't allow duplicates."
    },
    {
        question: "What is polymorphism in Java?",
        options: [
            "The ability to take multiple forms",
            "The process of hiding implementation details",
            "The mechanism of bundling data and methods",
            "The concept of inheriting properties"
        ],
        correctAnswer: 0,
        explanation: "Polymorphism allows an object to take multiple forms, typically through method overriding and overloading."
    },
    {
        question: "Which exception is thrown when dividing by zero in Java?",
        options: [
            "NullPointerException",
            "ArithmeticException",
            "DivideByZeroException",
            "NumberFormatException"
        ],
        correctAnswer: 1,
        explanation: "Dividing by zero in Java throws an ArithmeticException."
    }
];
