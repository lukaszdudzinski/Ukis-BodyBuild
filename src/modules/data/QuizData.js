import { lecturesData } from './LecturesData.js';

export const QuizData = {
    getAllQuizzes: () => {
        return lecturesData.map(lecture => lecture.quiz).flat();
    },

    getQuizForLecture: (lectureId) => {
        const lecture = lecturesData.find(l => l.id === lectureId);
        return lecture ? lecture.quiz : [];
    }
};
