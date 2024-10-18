import QuestionsPreview from '@/components/hack/QuestionPreview'
import React from 'react'

type Props = {}
const questions = [
    {
        "question": "How visually appealing is the interface?",
        "parameter": "UI UX",
        "ans": [
            {"answer": "Very Poor", "score": 1},
            {"answer": "Fair", "score": 2},
            {"answer": "Good", "score": 3},
            {"answer": "Excellent", "score": 4}
        ]
    },
    {
        "question": "Is the navigation intuitive and easy to follow?",
        "parameter": "UI UX",
        "ans": [
            {"answer": "Very Difficult", "score": 1},
            {"answer": "Somewhat Difficult", "score": 2},
            {"answer": "Somewhat Easy", "score": 3},
            {"answer": "Very Easy", "score": 4}
        ]
    },
    {
        "question": "How unique is the idea presented?",
        "parameter": "Innovation",
        "ans": [
            {"answer": "Not Unique", "score": 1},
            {"answer": "Somewhat Unique", "score": 2},
            {"answer": "Quite Unique", "score": 3},
            {"answer": "Very Unique", "score": 4}
        ]
    },
    {
        "question": "Does the project solve a real problem?",
        "parameter": "Innovation",
        "ans": [
            {"answer": "Not at All", "score": 1},
            {"answer": "Somewhat", "score": 2},
            {"answer": "Mostly", "score": 3},
            {"answer": "Definitely", "score": 4}
        ]
    },
    {
        "question": "Is the product easy to use without help?",
        "parameter": "Usability",
        "ans": [
            {"answer": "Very Difficult", "score": 1},
            {"answer": "Somewhat Difficult", "score": 2},
            {"answer": "Somewhat Easy", "score": 3},
            {"answer": "Very Easy", "score": 4}
        ]
    },
    {
        "question": "Are the features well-integrated and functional?",
        "parameter": "Usability",
        "ans": [
            {"answer": "Not at All", "score": 1},
            {"answer": "Somewhat", "score": 2},
            {"answer": "Mostly", "score": 3},
            {"answer": "Completely", "score": 4}
        ]
    },
    {
        "question": "Is there a clear market for this solution?",
        "parameter": "Business plan",
        "ans": [
            {"answer": "No Market", "score": 1},
            {"answer": "Unclear Market", "score": 2},
            {"answer": "Some Market", "score": 3},
            {"answer": "Strong Market", "score": 4}
        ]
    },
    {
        "question": "Do they have a feasible revenue model?",
        "parameter": "Business plan",
        "ans": [
            {"answer": "Not Feasible", "score": 1},
            {"answer": "Somewhat Feasible", "score": 2},
            {"answer": "Feasible", "score": 3},
            {"answer": "Highly Feasible", "score": 4}
        ]
    }
]
const QuestionPage = (props: Props) => {
  return (
    <div>
        <QuestionsPreview questions={questions}/>
    </div>
  )
}

export default QuestionPage